import db from '../models/index.js';
const { Competence, Indicateur } = db;

// CREATE
export const addCompetences = async (req, res) => {
  try {
    const { Nom, Categorie, Descreption, ind = [] } = req.body;
    
    const transaction = await db.sequelize.transaction();
    
    try {
      const competence = await Competence.create({
        Nom,
        Categorie,
        Descreption
      }, { transaction });

      await Promise.all(ind.map(indicateur => 
        Indicateur.create({
          indicateur,
          id_competence: competence.id_Competence
        }, { transaction })
      ));

      await transaction.commit();
      res.status(201).json({ 
        message: 'Compétence ajoutée avec succès.',
        competence: {
          ...competence.toJSON(),
          indicateurs: ind
        }
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Erreur création:', error);
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
export const getCompetences = async (req, res) => {
  try {
    const competences = await Competence.findAll({
      include: [{
        model: Indicateur,
        as: 'indicateurs',
        attributes: ['id_indicateur', 'indicateur'] // Exclure dans la réponse finale
      }]
    });
    res.status(200).json(competences);
  } catch (error) {
    console.error('Erreur lecture:', error);
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
export const getCompetenceById = async (req, res) => {
  try {
    const competence = await Competence.findByPk(req.params.id_Competence, {
      include: [{
        model: Indicateur,
        as: 'indicateurs',
        attributes: ['id_indicateur', 'indicateur'] // Exclure dans la réponse finale
      }]
    });
    
    if (!competence) return res.status(404).json({ message: 'Non trouvé', });
    
    res.status(200).json(competence);
  } catch (error) {
    console.error('Erreur lecture:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateCompetence = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    
    try {
      // Récupération avec l'alias correct
      const competence = await Competence.findByPk(req.params.id_Competence, { 
        transaction,
        include: [{
          model: Indicateur,
          as: 'indicateurs' // <-- Ajouter l'alias ici
        }]
      });
  
      if (!competence) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Compétence non trouvée' });
      }
  
      // Mise à jour de la compétence
      await competence.update({
        Nom: req.body.Nom,
        Categorie: req.body.Categorie,
        Descreption: req.body.Descreption
      }, { transaction });
  
      // Suppression des anciens indicateurs
      await Indicateur.destroy({ 
        where: { id_competence: competence.id_Competence },
        transaction
      });
  
      // Création des nouveaux indicateurs
      if (req.body.ind && req.body.ind.length > 0) {
        await Indicateur.bulkCreate(
          req.body.ind.map(indicateur => ({
            indicateur,
            id_competence: competence.id_Competence
          })),
          { transaction }
        );
      }
  
      await transaction.commit();
  
      // Récupération finale avec l'alias
      const updatedCompetence = await Competence.findByPk(req.params.id_Competence, {
        include: [{
          model: Indicateur,
          as: 'indicateurs',
          attributes: ['id_indicateur', 'indicateur'] // Exclure dans la réponse finale
        }]
      });
  
      res.status(200).json({
        message: 'Compétence mise à jour avec succès',
        competence: updatedCompetence
      });
  
    } catch (error) {
      if (transaction.finished !== 'commit') {
        await transaction.rollback();
      }
      console.error('Erreur:', error);
      res.status(500).json({
        message: 'Erreur lors de la mise à jour',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

// DELETE
export const deleteCompetence = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const competence = await Competence.findByPk(req.params.id_Competence, { transaction });
    if (!competence) return res.status(404).json({ message: 'Non trouvé' });

    // Delete related indicateurs first
    await Indicateur.destroy({
      where: { id_competence: competence.id_Competence },
      transaction
    });

    await competence.destroy({ transaction });
    await transaction.commit();
    
    res.status(200).json({ message: 'Supprimé avec succès' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur suppression:', error);
    res.status(500).json({ message: error.message });
  }
};