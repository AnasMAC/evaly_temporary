import db from '../models/index.js';
const {Competence}=db

export const addCompetences = async(req,res)=>{
    try {
        const{Nom,Categorie,Descreption}=req.body;
        if (!Nom || !Categorie || !Descreption) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }
        const competence = await Competence.create({
            Nom,
            Categorie,
            Descreption
        });
        res.status(201).json({ message: 'Compétence ajoutée avec succès.', competence });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la compétence:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la compétence.' });
    }

}

export const getCompetences = async(req,res)=>{
    try {
        const competences = await Competence.findAll();
        res.status(200).json(competences);
    } catch (error) {
        console.error('Erreur lors de la récupération des compétences:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des compétences.' });
    }
}

export const getCompetenceById = async(req,res)=>{
    try {
        const competence = await Competence.findByPk(req.params.id_Competence);
        if (!competence) {
            return res.status(404).json({ message: 'Compétence introuvable.' });
        }
        res.status(200).json(competence);
    } catch (error) {
        console.error('Erreur lors de la récupération de la compétence:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la compétence.' });
    }
}

export const updateCompetence = async(req,res)=>{
    try {
        const competence = await Competence.findByPk(req.params.id_Competence);
        if (!competence) {
            return res.status(404).json({ message: 'Compétence introuvable.' });
        }
        const { Nom, Categorie, Descreption } = req.body;
        await competence.update({ Nom, Categorie, Descreption });
        res.status(200).json({ message: 'Compétence mise à jour avec succès.', competence });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la compétence:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la compétence.' });
    }
}

export const deleteCompetence = async(req,res)=>{
    try {
        const competence = await Competence.findByPk(req.params.id_Competence);
        if (!competence) {
            return res.status(404).json({ message: 'Compétence introuvable.' });
        }
        await competence.destroy();
        res.status(200).json({ message: 'Compétence supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la compétence:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la compétence.' });
    }
}