import db from '../models/index.js';
const { Cadre, Etudiant, Enseignant, Professionnel,Competence,etudiant_cadre,sequelize} = db;

export const addCadre = async (req, res) => {
    const {
      Nom,
      Frequence_evaluation,
      Date_debut,
      Date_fin,
      Description,
      Type,
      id_Professionnel,
      id_Enseignant,
    } = req.body;
    if (!id_Enseignant && !id_Professionnel) {
      return res.status(400).json({ message: 'Il faut fournir un enseignant ou un professionnel.' });
    }
    if (!Nom || !Frequence_evaluation || !Date_debut || !Date_fin|| !Type) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }
    const dateDebut = new Date(Date_debut);
    const dateFin = new Date(Date_fin);
    if (dateDebut > dateFin) {
      return res.status(400).json({ message: 'La date de début doit être inférieure à la date de fin.' });
    }
    const t = await sequelize.transaction();
    try {
      /* 1️⃣  Create the Cadre */
      const cadre = await Cadre.create(
        { Nom, Frequence_evaluation, Date_debut, Date_fin,Type, Description },
        { transaction: t }
      );
  
      /* 2️⃣  Link Enseignant (optional one‑to‑many via join) */
      if (id_Enseignant) {
        const enseignant = await Enseignant.findByPk(id_Enseignant, { transaction: t });
        if (!enseignant) {
          await t.rollback();
          return res.status(404).json({ message: 'Enseignant introuvable.' });
        }
        await cadre.addSuperviseur(enseignant, { transaction: t });
      }
  
      /* 3️⃣  Link Professionnel (belongsTo) */
      if (id_Professionnel) {
        const professionnel = await Professionnel.findByPk(id_Professionnel, { transaction: t });
        if (!professionnel) {
          await t.rollback();
          return res.status(404).json({ message: 'Professionnel introuvable.' });
        }
        await cadre.setProfessionnel(professionnel, { transaction: t });
      }
  
      /* 6️⃣  Commit transaction */
      await t.commit();
  
      /* 7️⃣  Return the created Cadre with its relations */
      const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
        include: [
          { model: Enseignant, as: 'superviseurs' },
          { model: Professionnel, as: 'Professionnel' },
        ]
      });
  
      return res.status(201).json(fullCadre);
  
    } catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ error: error.message });
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
    try {
        const t = await sequelize.transaction();
        const cadre = await Cadre.findByPk(req.params.id_cadre);
        if (!cadre) {
            return res.status(404).json({ message: 'Cadre introuvable.' });
        }
        const { Nom, Frequence_evaluation, Date_debut, Date_fin, Description } = req.body;
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
        await cadre.update({ Nom, Frequence_evaluation, Date_debut, Date_fin, Description }, { transaction: t });
        const { id_Enseignant, id_Professionnel} = req.body;
        if(id_Enseignant){
            const enseignant = await Enseignant.findByPk(id_Enseignant, { transaction: t });
            if (!enseignant) {
                await t.rollback();
                return res.status(404).json({ message: 'Enseignant introuvable.' });
            }
            await cadre.addSuperviseur(enseignant, { transaction: t });
        }

        if(id_Professionnel){
            const professionnel = await Professionnel.findByPk(id_Professionnel, { transaction: t });
            if (!professionnel) {
                await t.rollback();
                return res.status(404).json({ message: 'Professionnel introuvable.' });
            }
            await cadre.setProfessionnel(professionnel, { transaction: t });
        }
        await t.commit();
        const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
            include: [
                { model: Enseignant, as: 'superviseurs' },
                { model: Professionnel, as: 'Professionnel' },
                { model: Etudiant, as: 'participants' },
                { model: Competence, as: 'competences' }
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
                { model: Enseignant, as: 'superviseurs' },
                { model: Professionnel, as: 'Professionnel' },
                { model: Etudiant, as: 'participants' },
                { model: Competence, as: 'competences' }
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
                { model: Enseignant, as: 'superviseurs' },
                { model: Professionnel, as: 'Professionnel' },
                { model: Etudiant, as: 'participants' },
                { model: Competence, as: 'competences' }
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
          { model: Enseignant, as: 'superviseurs' },
          { model: Professionnel, as: 'Professionnel' },
          { model: Etudiant, as: 'participants' },
          { model: Competence, as: 'competences' }
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
        { model: Enseignant, as: 'superviseurs' },
        { model: Professionnel, as: 'Professionnel' },
        { model: Etudiant, as: 'participants' },
        { model: Competence, as: 'competences' }
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
      where: { Nom: competence ,Categorie:categorie}
    });
    if(!competences || competences.length === 0) {
      return res.status(404).json({ message: 'Competence introuvable.' });
    }
    
    await cadre.addCompetences(competences);
    const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
      include: [
        { model: Enseignant, as: 'superviseurs' },
        { model: Professionnel, as: 'Professionnel' },
        { model: Etudiant, as: 'participants' },
        { model: Competence, as: 'competences' }
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
    console.log(competences);
    if (!competences|| competences.length === 0) {
      return res.status(404).json({ message: 'Competence introuvable.' });
    }
    await cadre.removeCompetences(competences);
    const fullCadre = await Cadre.findByPk(cadre.id_cadre, {
      include: [
        { model: Enseignant, as: 'superviseurs' },
        { model: Professionnel, as: 'Professionnel' },
        { model: Etudiant, as: 'participants' },
        { model: Competence, as: 'competences' }
      ]
    });
    return res.status(200).json(fullCadre);
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
