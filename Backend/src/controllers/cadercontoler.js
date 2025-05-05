import e from 'express';
import db from '../models/index.js';
const { Cadre, Etudiant, Enseignant, Professionnel,Competence,Utilisateur,Indicateur,sequelize} = db;

export const addCadre = async (req, res) => {
  const {
      Nom,
      Frequence_evaluation,
      Date_debut,
      Date_fin,
      Description,
      Type,
      id_Enseignant // Champ unique reçu du frontend
  } = req.body;

  // Validation de base
  if (!Nom || !Frequence_evaluation || !Date_debut || !Date_fin || !Type || !id_Enseignant) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  // Vérification des dates
  const dateDebut = new Date(Date_debut);
  const dateFin = new Date(Date_fin);
  if (dateDebut > dateFin) {
      return res.status(400).json({ message: 'La date de début doit être antérieure à la date de fin.' });
  }

  const t = await sequelize.transaction();
  
  try {
      // 1. Création du cadre
      const cadre = await Cadre.create({
          Nom,
          Frequence_evaluation,
          Date_debut,
          Date_fin,
          Type,
          Description
      }, { transaction: t });

      // 2. Recherche de l'encadrant
      let enseignant = await Enseignant.findByPk(id_Enseignant, { transaction: t });
      let professionnel = await Professionnel.findByPk(id_Enseignant, { transaction: t });

      // 3. Vérification de l'existence
      if (!enseignant && !professionnel) {
          await t.rollback();
          return res.status(404).json({ message: 'Encadrant introuvable dans les enseignants ou professionnels.' });
      }

      // 4. Association selon le type trouvé
      if (enseignant) {
          await cadre.setSuperviseurs(enseignant, { transaction: t });
      } else {
          await cadre.setProfessionnel(professionnel, { transaction: t });
      }

      await t.commit();

      // 5. Récupération du cadre complet
      const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
        include: [
            {
              model: Etudiant,
              as: 'participants',
              attributes: { exclude: ['promotion'] },
              through: { attributes: [] }, // 👈 Exclude etudiant_cadre (through table)
              include: [{
                  model: Utilisateur,
                  as: 'base',
                  attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
              }]
            },
            { 
              model: Competence, 
              as: 'competences' ,
              attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
              through:{attributes:[]},
              include:[{
                model:Indicateur,
                as:'indicateurs',
                attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
              }]
              
             },
        ]
      });

      return res.status(201).json(fullCadre);

  } catch (error) {
      await t.rollback();
      console.error('Erreur création cadre:', error);
      return res.status(500).json({ 
          message: 'Échec de la création du cadre',
          error: error.message 
      });
  }
};

export const deleteCadre = async(req,res)=>{
    try{
        const cadre = await Cadre.findByPk(req.params.id_cadre);
        if (!cadre){
            return res.status(404).json({ message: 'Cadre introuvable.' });
        }
        await cadre.destroy();
        return res.status(200).json({ message: 'Cadre supprimé avec succès.' });
    }catch(error){
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

export const updateCadre=async(req,res)=>{
  const t = await sequelize.transaction();
    try {
        
        const cadre = await Cadre.findByPk(req.params.id_cadre);
        if (!cadre) {
            return res.status(404).json({ message: 'Cadre introuvable.' });
        }
        const { Nom,Type, Frequence_evaluation, Date_debut, Date_fin, Description } = req.body;
        if (!Nom || !Frequence_evaluation || !Date_debut || !Date_fin) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }
        const dateDebut = new Date(Date_debut);
        const dateFin = new Date(Date_fin);
        if(dateDebut > dateFin) {
            return res.status(400).json({ message: 'La date de début doit être inférieure à la date de fin.' });
        }
        if (cadre.Date_fin < new Date()) {
            return res.status(400).json({ message: 'Impossible de modifier un cadre déjà terminé.' });
        }
        await cadre.update({ Nom,Type, Frequence_evaluation, Date_debut, Date_fin, Description }, { transaction: t });
        const {id_Enseignant} = req.body;
        let enseignant = await Enseignant.findByPk(id_Enseignant, { transaction: t });
        let professionnel = await Professionnel.findByPk(id_Enseignant, { transaction: t });

              // Supprimer les anciens superviseurs enseignants
        await cadre.setSuperviseurs(null, { transaction: t }); // remove all current teachers
        await cadre.setProfessionnel(null, { transaction: t }); // remove professional if exists

        // Associer le nouveau superviseur
        if (enseignant) {
            await cadre.setSuperviseurs(enseignant, { transaction: t });
        } else {
            await cadre.setProfessionnel(professionnel, { transaction: t });
        }
        await t.commit();
        const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
          include: [
              {
                model: Etudiant,
                as: 'participants',
                attributes: { exclude: ['promotion'] },
                through: { attributes: [] }, // 👈 Exclude etudiant_cadre (through table)
                include: [{
                    model: Utilisateur,
                    as: 'base',
                    attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
                }]
              },
              { 
                model: Competence, 
                as: 'competences' ,
                attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
                through:{attributes:[]},
                include:[{
                  model:Indicateur,
                  as:'indicateurs',
                  attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
                }]
                
               },
          ]
        });
        return res.status(200).json(fullCadre);
    }catch(error){
        await t.rollback();
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}


export const getAllCadres = async (req, res) => {
    try {
        const cadres = await Cadre.findAll({
          include: [
              {
                model: Etudiant,
                as: 'participants',
                attributes: { exclude: ['promotion'] },
                through: { attributes: [] }, // 👈 Exclude etudiant_cadre (through table)
                include: [{
                    model: Utilisateur,
                    as: 'base',
                    attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
                }]
              },
              { 
                model: Competence, 
                as: 'competences' ,
                attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
                through:{attributes:[]},
                include:[{
                  model:Indicateur,
                  as:'indicateurs',
                  attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
                }]
                
               },
          ]
        });
        return res.status(200).json(cadres);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
export const getCadreById = async (req, res) => {
    try {
        const cadre = await Cadre.findByPk(req.params.id_cadre, {
            include: [
                {
                  model: Etudiant,
                  as: 'participants',
                  attributes: { exclude: ['promotion'] },
                  through: { attributes: [] }, // 👈 Exclude etudiant_cadre (through table)
                  include: [{
                      model: Utilisateur,
                      as: 'base',
                      attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
                  }]
                },
                { 
                  model: Competence, 
                  as: 'competences' ,
                  attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
                  through:{attributes:[]},
                  include:[{
                    model:Indicateur,
                    as:'indicateurs',
                    attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
                  }]
                  
                 },
            ]
        });
        if (!cadre) {
            return res.status(404).json({ message: 'Cadre introuvable.' });
        }
        return res.status(200).json(cadre);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

export const ajouterEtudiant = async (req, res) => {
    try {
      const cadre = await Cadre.findByPk(req.params.id_cadre);
      if (!cadre) {
        return res.status(404).json({ message: 'Cadre introuvable.' });
      }
      const etudiant = await Etudiant.findByPk(req.params.id_Etudiant);
      if (!etudiant) {
        return res.status(404).json({ message: 'etudiant introvable .' });
      }
      await cadre.addParticipants(etudiant);
      const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
            include: [
                {
                  model: Etudiant,
                  as: 'participants',
                  attributes: { exclude: ['promotion'] },
                  through: { attributes: [] }, // 👈 Exclude etudiant_cadre (through table)
                  include: [{
                      model: Utilisateur,
                      as: 'base',
                      attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
                  }]
                },
                { 
                  model: Competence, 
                  as: 'competences' ,
                  attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
                  through:{attributes:[]},
                  include:[{
                    model:Indicateur,
                    as:'indicateurs',
                    attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
                  }]
                  
                 },
            ]
        });
      return res.status(200).json(fullCadre);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

export const supprimerEtudiant = async (req, res) => {
  try{
    const cadre = await Cadre.findByPk(req.params.id_cadre);
    if (!cadre) {
      return res.status(404).json({ message: 'Cadre introuvable.' });
    }
    const participant = await cadre.getParticipants({
      where: { cin: req.params.id_Etudiant }
    });
    console.log(participant);
    
    if (!participant || participant.length === 0) {
      return res.status(404).json({ message: 'Etudiant introuvable.' });
    }
    await cadre.removeParticipants(participant);
    const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
            include: [
                {
                  model: Etudiant,
                  as: 'participants',
                  attributes: { exclude: ['promotion'] },
                  through: { attributes: [] }, // 👈 Exclude etudiant_cadre (through table)
                  include: [{
                      model: Utilisateur,
                      as: 'base',
                      attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
                  }]
                },
                { 
                  model: Competence, 
                  as: 'competences' ,
                  attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
                  through:{attributes:[]},
                  include:[{
                    model:Indicateur,
                    as:'indicateurs',
                    attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
                  }]
                  
                 },
            ]
    });
    return res.status(200).json(fullCadre);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

export const ajouterCompetence = async (req, res) => {
  try {
    const cadre = await Cadre.findByPk(req.params.id_cadre);
    if (!cadre) {
      return res.status(404).json({ message: 'Cadre introuvable.' });
    }
    const { competence,categorie} = req.body;
    const competences = await Competence.findAll({
      where: { Nom: competence }
    });
    if(!competences || competences.length === 0) {
      return res.status(404).json({ message: 'Competence introuvable.' });
    }
    
    await cadre.addCompetences(competences);
    const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
            include: [
                {
                  model: Etudiant,
                  as: 'participants',
                  attributes: { exclude: ['promotion'] },
                  through: { attributes: [] }, // 👈 Exclude etudiant_cadre (through table)
                  include: [{
                      model: Utilisateur,
                      as: 'base',
                      attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
                  }]
                },
                { 
                  model: Competence, 
                  as: 'competences' ,
                  attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
                  through:{attributes:[]},
                  include:[{
                    model:Indicateur,
                    as:'indicateurs',
                    attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
                  }]
                  
                 },
            ]
    });
    return res.status(200).json(fullCadre);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

export const supprimerCompetence = async (req, res) => {
  try {
    const cadre = await Cadre.findByPk(req.params.id_cadre);
    if (!cadre) {
      return res.status(404).json({ message: 'Cadre introuvable.' });
    }
    const competence = req.params.id_Competence;
    console.log(competence);
    const competences = await cadre.getCompetences({
      where: { id_Competence: competence }
    });
    if (!competences|| competences.length === 0) {
      return res.status(404).json({ message: 'Competence introuvable.' });
    }
    await cadre.removeCompetences(competences);
    const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
            include: [
                {
                  model: Etudiant,
                  as: 'participants',
                  attributes: { exclude: ['promotion'] },
                  through: { attributes: [] }, 
                  include: [{
                      model: Utilisateur,
                      as: 'base',
                      attributes: { exclude: ['role', 'administrateurId', 'pwd', 'cin'] }
                  }]
                },
                { 
                  model: Competence, 
                  as: 'competences' ,
                  attributes: { exclude: ['id_Competence','Descreption','createdAt','updatedAt',] },
                  through:{attributes:[]},
                  include:[{
                    model:Indicateur,
                    as:'indicateurs',
                    attributes: { exclude: ['id_indicateur','createdAt','updatedAt'] },
                  }]
                  
                 },
            ]
    });
    return res.status(200).json(fullCadre);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
