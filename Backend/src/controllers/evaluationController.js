import db from '../models/index.js';
const { Cadre, Evaluation} = db;


export const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.findAll({
            include: [
                {
                    model: Evaluation.sequelize.models.Utilisateur,
                    as: 'evaluateur',
                    attributes: ['cin','nom', 'prenom','role'],
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['cin','promotion', 'filiere'],
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
                    attributes: [ 'id_cadre','Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: [ 'id_competence','Nom']
                }
            ]
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
                    attributes: ['cin','nom', 'prenom','role'],
                },
                {
                    model: Evaluation.sequelize.models.Etudiant,
                    as: 'evalué',
                    attributes: ['cin','promotion', 'filiere'],
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
                    attributes: ['id_cadre', 'Nom']
                },
                {
                    model: Evaluation.sequelize.models.Competence,
                    as: 'competence',
                    attributes: ['id_competence','Nom']
                }
            ]
        });
        if (!evaluation) {
            return res.status(404).json({ message: "Evaluation not found" });
        }
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEvaluationforEtudiant = async (req, res) => {
    const id_etudiant = req.params.id_etudiant;
    if (!id_etudiant) {
        return res.status(400).json({ message: "CIN is required" });
    }
    const co_evaluations = await Evaluation.findAll({
        where: {
            cinEvalué: id_etudiant,
            cinEvaluateur:id_etudiant
        },
        include: [
            {
                model: Evaluation.sequelize.models.Utilisateur,
                as: 'evaluateur',
                attributes: ['cin','nom', 'prenom','role'],
            },
            {
                model: Evaluation.sequelize.models.Etudiant,
                as: 'evalué',
                attributes: ['cin','promotion', 'filiere'],
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
                attributes: [ 'id_cadre','Nom']
            },
            {
                model: Evaluation.sequelize.models.Competence,
                as: 'competence',
                attributes: [ 'id_competence','Nom']
            }
        ]
    });
    res.status(200).json(evaluations);
}

export const getEvaluationforProf=async (req, res) => {
    const id_prof = req.params.id_prof;
    if (!id_prof) {
        return res.status(400).json({ message: "CIN is required" });
    }
    const evaluations = await Evaluation.findAll({
        where: {
            cinEvaluateur: id_prof
        },
        include: [
            {
                model: Evaluation.sequelize.models.Utilisateur,
                as: 'evaluateur',
                attributes: ['nom', 'prenom','role'],
            },
            {
                model: Evaluation.sequelize.models.Cadre,
                as: 'cadre',
                attributes: [ 'Nom']
            },
            {
                model: Evaluation.sequelize.models.Competence,
                as: 'competence',
                attributes: ['Nom']
            }
        ]
    })
}

export const createEvaluation = async (req, res) => {
    try {
        const { Score, Commentaire, Anonymat, cinEvaluateur, cinEvalué, id_cadre, id_competence } = req.body;
        if (!Score || !cinEvaluateur || !cinEvalué || !id_cadre || !id_competence) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const date = Date.now();
        console.log(date);

        const inCadre= await Cadre.findByPk(id_cadre,{
            include: [
                {
                    module: Cadre.sequelize.models.Competence,
                    as: 'competences',
                    attributes: ['id_Competence'],
                },{
                    module: Cadre.sequelize.models.Etudiant,
                    as: 'participants',
                    attributes: ['cin'],
                },{
                    module: Cadre.sequelize.models.Enseignant,
                    as: 'superviseurs',
                    attributes: ['cin'],
                },{
                    module: Cadre.sequelize.models.Professionnel,
                    as: 'professionnel',
                    attributes: ['cin'],
                }
            ]
        });
        if (!inCadre) {
            return res.status(404).json({ message: "Cadre not found" });
        }
        if(!inCadre.participants.map(e => e.cin).includes(cinEvalué)){
            return res.status(404).json({ message: "Etudiant not in cadre" });
        }
        if(!inCadre.superviseurs.map(e => e.cin).includes(cinEvaluateur)||!inCadre.professionnel.map(e => e.cin).includes(cinEvaluateur)){
            return res.status(404).json({ message: "Enseignant or Professionnel not in cadre" });
        }
        if(!inCadre.competences.map(e => e.id_Competence).includes(id_competence)){
            return res.status(404).json({ message: "Competence not in cadre" });
        }
        
        const newEvaluation = await Evaluation.create({
            date,
            Score,
            Commentaire,
            Anonymat,
            cinEvaluateur,
            cinEvalué,
            id_cadre,
            id_competence
        });
        res.status(201).json(newEvaluation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
