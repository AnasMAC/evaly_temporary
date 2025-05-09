
import db from '../models/index.js';
const {Evaluation,sequelize} = db;
import { Op } from 'sequelize';

export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.findAll({
            include: [
                {
                    model: Evaluation.sequelize.models.Utilisateur,
                    as: 'evaluateur',
                    attributes: ['nom', 'prenom', 'role']
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['promotion', 'filiere'],
                    include: [
                        {
                            model: Evaluation.sequelize.models.Utilisateur,
                            as: 'base',
                            attributes: ['nom', 'prenom']
                        }
                    ]
                },
                {
                    model: Evaluation.sequelize.models.Cadre,
                    as: 'cadre',
                    attributes: ['Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: ['Nom','Categorie']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEvaluationById = async (req, res) => {
    const id  = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }
    try {
        const evaluation = await Evaluation.findByPk(id, {
            include: [
                {
                    model: Evaluation.sequelize.models.Utilisateur,
                    as: 'evaluateur',
                    attributes: ['nom', 'prenom', 'role']
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['promotion', 'filiere'],
                    include: [
                        {
                            model: Evaluation.sequelize.models.Utilisateur,
                            as: 'base',
                            attributes: ['nom', 'prenom']
                        }
                    ]
                },
                {
                    model: Evaluation.sequelize.models.Cadre,
                    as: 'cadre',
                    attributes: ['Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: ['Nom','Categorie']
                }
            ],
            
        });
        if (!evaluation) {
            return res.status(404).json({ message: "Evaluation not found" });
        }
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function filterAnonyme(evaluations) {
    return evaluations.map(evaluation => {
        if (evaluation.Anonymat.trim().toUpperCase() === 'ANONYME') {
            evaluation.cinEvaluateur = 'ANONYME';
            evaluation.evaluateur.nom = 'ANONYME';
            evaluation.evaluateur.prenom = 'ANONYME';
            evaluation.evaluateur.cin = 'ANONYME';
            evaluation.evaluateur.role = 'ANONYME';
        } else if (evaluation.Anonymat.trim().toUpperCase() === 'PARTIELMENT ANONYME') {
            evaluation.cinEvaluateur = 'ANONYME';
            evaluation.evaluateur.nom = 'ANONYME';
            evaluation.evaluateur.prenom = 'ANONYME';
            evaluation.evaluateur.cin = 'ANONYME';
        } 
        return evaluation;
    });
}
// export const getEvaluationforEtudiant = async (req, res) => {
//     const id_etudiant = req.params.id_etudiant;
//     if (!id_etudiant) {
//         return res.status(400).json({ message: "CIN is required" });
//     }
//     try {
//         const tout_evaluations = await Evaluation.findAll({
//             where: {
//                 cinEvalué: id_etudiant,
//             },
//             include: [
//                 {
//                     model: Evaluation.sequelize.models.Utilisateur,
//                     as: 'evaluateur',
//                     attributes: ['nom', 'prenom', 'role']
//                 },
//                 {
//                     model: Evaluation.sequelize.models.Etudiant,
//                     as: 'evalué',
//                     attributes: ['promotion', 'filiere'],
//                     include: [
//                         {
//                             model: Evaluation.sequelize.models.Utilisateur,
//                             as: 'base',
//                             attributes: ['nom', 'prenom']
//                         }
//                     ]
//                 },
//                 {
//                     model: Evaluation.sequelize.models.Cadre,
//                     as: 'cadre',
//                     attributes: ['id_cadre', 'Nom']
//                 },
//                 {
//                     model: Evaluation.sequelize.models.Competence,
//                     as: 'competence',
//                     attributes: ['id_Competence', 'Nom']
//                 }
//             ],
//             order: [['createdAt', 'DESC']]
//         });
        

//         const selfEvaluations = tout_evaluations.filter(evaluation => evaluation.cinEvaluateur === id_etudiant);
//         const otherEvaluations = filterAnonyme(tout_evaluations.filter(evaluation => evaluation.cinEvaluateur !== id_etudiant));

//         const evaluations = {...selfEvaluations, ...otherEvaluations};
//         res.status(200).json(evaluations);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const getCo_evaluationforEtudiant = async (req, res) => {
    const id_etudiant = req.params.id_etudiant;
    if (!id_etudiant) {
        return res.status(400).json({ message: "CIN is required" });
    }
    try {
        const evaluations = await Evaluation.findAll({
            where: {
                cinEvalué: id_etudiant,
                cinEvaluateur: { [Op.ne]: id_etudiant },
            },
            include: [
                {
                    model: Evaluation.sequelize.models.Utilisateur,
                    as: 'evaluateur',
                    attributes: ['nom', 'prenom', 'role']
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['promotion', 'filiere'],
                    include: [
                        {
                            model: Evaluation.sequelize.models.Utilisateur,
                            as: 'base',
                            attributes: ['nom', 'prenom']
                        }
                    ]
                },
                {
                    model: Evaluation.sequelize.models.Cadre,
                    as: 'cadre',
                    attributes: ['Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: ['Nom','Categorie']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        const otherEvaluations = filterAnonyme(evaluations);
        res.status(200).json(otherEvaluations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
export const getauto_EvaluationforEtudiant = async (req, res) => {
    const id_etudiant = req.params.id_etudiant;
    if (!id_etudiant) {
        return res.status(400).json({ message: "CIN is required" });
    }
    try {
        const evaluations = await Evaluation.findAll({
            where: {
                cinEvalué: id_etudiant,
                cinEvaluateur: id_etudiant
            },
            include: [
                {
                    model: Evaluation.sequelize.models.Utilisateur,
                    as: 'evaluateur',
                    attributes: ['nom', 'prenom', 'role']
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['promotion', 'filiere'],
                    include: [
                        {
                            model: Evaluation.sequelize.models.Utilisateur,
                            as: 'base',
                            attributes: ['nom', 'prenom']
                        }
                    ]
                },
                {
                    model: Evaluation.sequelize.models.Cadre,
                    as: 'cadre',
                    attributes: ['Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: ['Nom','Categorie']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEvaluationforProf = async (req, res) => {
    const id_enseignant = req.params.id_enseignant; 
    if (!id_enseignant) {
        return res.status(400).json({ message: "CIN is required" });
    }
    try {
        const evaluations = await Evaluation.findAll({
            where: {
                cinEvaluateur: id_enseignant, 
            },
            include: [
                {
                    model: Evaluation.sequelize.models.Utilisateur,
                    as: 'evaluateur',
                    attributes: ['nom', 'prenom', 'role']
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['promotion', 'filiere'],
                    include: [
                        {
                            model: Evaluation.sequelize.models.Utilisateur,
                            as: 'base',
                            attributes: ['nom', 'prenom']
                        }
                    ]
                },
                {
                    model: Evaluation.sequelize.models.Cadre,
                    as: 'cadre',
                    attributes: ['Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: ['Nom','Categorie']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getvoirplus = async (req, res) => {
    const id_enseignant = req.params.id_enseignant;
    if (!id_enseignant) {
        return res.status(400).json({ message: "CIN is required" });
    }
    const id_etudiant = req.params.id_etudiant;
    if (!id_etudiant) {
        return res.status(400).json({ message: "CIN is required" });
    }
    try {
        const evaluations = await Evaluation.findAll({
            where: {
                cinEvaluateur: id_enseignant,
                cinEvalué: id_etudiant
            },
            include: [
                {
                    model: Evaluation.sequelize.models.Utilisateur,
                    as: 'evaluateur',
                    attributes: ['nom', 'prenom', 'role']
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['promotion', 'filiere'],
                    include: [
                        {
                            model: Evaluation.sequelize.models.Utilisateur,
                            as: 'base',
                            attributes: ['nom', 'prenom']
                        }
                    ]
                },
                {
                    model: Evaluation.sequelize.models.Cadre,
                    as: 'cadre',
                    attributes: ['Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: ['Nom','Categorie']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}