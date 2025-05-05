// controllers/evaluationController.js
import db from '../models/index.js';
const {
  Cadre,
  Etudiant,
  Enseignant,
  Professionnel,
  Utilisateur,
  Competence,
  Indicateur,
  Evaluation
} = db;

// ----------------------
// Vérifie si l'user appartient au cadre
// ----------------------
const checkCadreAccess = (user, cadre) => {
  switch (user.role) {
    case 'etudiant':
      return cadre.participants?.some(p => p.cin === user.cin);

    case 'enseignant':
      // superviseurs est un objet unique
      return cadre.superviseurs?.cin === user.cin;

    case 'professionnel':
      // Professionnel exposé sans alias
      return cadre.Professionnel?.cin === user.cin;

    default:
      return false;
  }
};

// ----------------------
// 1) Lister les cadres auxquels appartient un user
// ----------------------
export const getUserCadres = async (req, res) => {
  try {
    const { cin, role } = req.body;
    if (!cin || !role) {
      return res.status(400).json({
        message: "Informations utilisateur manquantes (cin, role requis)"
      });
    }

    let cadres;
    switch (role) {
      case 'etudiant':
        cadres = await Cadre.findAll({
          include: [{
            model: Etudiant,
            as: 'participants',
            where: { cin },
            through: { attributes: [] }
          }]
        });
        break;

      case 'enseignant':
        cadres = await Cadre.findAll({
          include: [{
            model: Enseignant,
            as: 'superviseurs',
            where: { cin }
          }]
        });
        break;

      case 'professionnel':
        cadres = await Cadre.findAll({
          include: [{
            model: Professionnel,
            where: { cin }
          }]
        });
        break;

      default:
        return res.status(403).json({ message: "Rôle non reconnu" });
    }

    return res.status(200).json(cadres);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ----------------------
// 2) Récupérer les étudiants d’un cadre
// ----------------------
export const getCadreStudents = async (req, res) => {
  try {
    const { cadreId } = req.params;
    const { cin, role } = req.body;
    if (!cin || !role) {
      return res.status(400).json({ message: "Informations utilisateur manquantes" });
    }

    const cadre = await Cadre.findByPk(cadreId, {
      include: [{
        model: Etudiant,
        as: 'participants',
        attributes: ['cin', 'promotion', 'filiere'],
        through: { attributes: [] },
        include: [{
          model: Utilisateur,
          as: 'base',
          attributes: ['nom', 'prenom']
        }]
      }]
    });
    if (!cadre) {
      return res.status(404).json({ message: "Cadre introuvable" });
    }

    if (!checkCadreAccess({ cin, role }, cadre)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    return res.status(200).json(cadre.participants);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ----------------------
// 3) Contexte d’évaluation
// ----------------------
export const getEvaluationContext = async (req, res) => {
  try {
    const { cadreId, cinEvaluateur, cinEvalue } = req.params;
    const { cin, role } = req.body;
    if (!cin || !role) {
      return res.status(400).json({ message: "Informations utilisateur manquantes" });
    }
    if (cin !== cinEvaluateur) {
      return res.status(403).json({ message: "Authentification invalide" });
    }

    let evaluationType;
    if (cinEvaluateur === cinEvalue) {
      evaluationType = 'auto';
    } else if (role === 'etudiant') {
      evaluationType = 'co';
    } else {
      evaluationType = 'supervisor';
    }

    const includes = [
      {
        model: Competence,
        as: 'competences',
        through: { attributes: [] },
        include: [{
          model: Indicateur,
          as: 'indicateurs',
          attributes: ['id_indicateur', 'indicateur']
        }]
      },
      {
        model: Etudiant,
        as: 'participants',
        where: { cin: cinEvalue },
        required: true,
        through: { attributes: [] },
        include: [{
          model: Utilisateur,
          as: 'base',
          attributes: ['nom', 'prenom']
        }]
      }
    ];

    if (evaluationType === 'supervisor') {
      if (role === 'enseignant') {
        includes.push({
          model: Enseignant,
          as: 'superviseurs',
          where: { cin: cinEvaluateur },
          required: true
        });
      } else {
        includes.push({
          model: Professionnel,
          where: { cin: cinEvaluateur },
          required: true
        });
      }
    }

    const cadre = await Cadre.findByPk(cadreId, { include: includes });
    if (!cadre) {
      return res.status(404).json({ message: "Contexte d'évaluation invalide" });
    }

    return res.status(200).json({
      type: evaluationType,
      competences: cadre.competences,
      context: {
        cadreId,
        cinEvaluateur,
        cinEvalue,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ----------------------
// 4) Soumission d’évaluation
// ----------------------
export const submitEvaluation = async (req, res) => {
  try {
    const { cadreId, cinEvaluateur, cinEvalue } = req.params;
    const {
      id_competence,
      score,
      commentaire,
      anonymat,
      cin,
      role
    } = req.body;

    if (!cin || !role) {
      return res.status(400).json({ message: "Informations manquantes" });
    }
    if (cin !== cinEvaluateur) {
      return res.status(403).json({ message: "Autorisation refusée" });
    }
    if (score == null || !id_competence) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const isValid = await validateEvaluationSubmission(
      { cin, role },
      cadreId,
      cinEvaluateur,
      cinEvalue,
      id_competence
    );
    if (!isValid) {
      return res.status(403).json({ message: "Opération non autorisée" });
    }

    const evaluation = await Evaluation.create({
      Date: new Date(),
      Score: score,
      Commentaire: commentaire,
      Anonymat: anonymat,
      cinEvaluateur,
      cinEvalué: cinEvalue,
      id_cadre: cadreId,
      id_competence
    });

    return res.status(201).json(evaluation);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ----------------------
// 5) Validation métier
// ----------------------
const validateEvaluationSubmission = async (
  user,
  cadreId,
  evaluateur,
  evaluatee,
  competenceId
) => {
  const cadre = await Cadre.findByPk(cadreId, {
    include: [
      {
        model: Etudiant,
        as: 'participants',
        attributes: ['cin'],
        through: { attributes: [] }
      },
      {
        model: Enseignant,
        as: 'superviseurs',
        attributes: ['cin'],
        required: false
      },
      {
        model: Professionnel,
        attributes: ['cin'],
        required: false
      },
      {
        model: Competence,
        as: 'competences',
        attributes: ['id_Competence'],
        through: { attributes: [] }
      }
    ]
  });
  if (!cadre) return false;

  if (!cadre.competences.some(c => c.id_Competence === competenceId)) {
    return false;
  }

  if (evaluateur === evaluatee) {
    return true;
  }

  if (user.role === 'etudiant') {
    return (
      cadre.participants.some(p => p.cin === evaluateur) &&
      cadre.participants.some(p => p.cin === evaluatee)
    );
  }

  if (user.role === 'enseignant') {
    return cadre.superviseurs?.cin === evaluateur;
  }

  if (user.role === 'professionnel') {
    return cadre.Professionnel?.cin === evaluateur;
  }

  return false;
};
