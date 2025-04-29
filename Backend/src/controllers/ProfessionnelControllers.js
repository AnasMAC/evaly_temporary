import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { generatePassword } from './EtudiantControllers.js'; 
const { Utilisateur, Professionnel } = db;

const createProfessionnel = async (req, res) => {
  try {
    const rawPassword = generatePassword();
    const pwd = await bcrypt.hash(rawPassword, 10); 
    const utilisateur = await Utilisateur.create({
      cin: req.body.cin,
      pwd: pwd,
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      role: 'professionnel', 
      administrateurId: req.params.administrateurId
    });

   const professionnel= await Professionnel.create({
      cin: utilisateur.cin,
nomEntreprise:  req.body.nomEntreprise,
    domaineActivite:  req.body.domaineActivite  });
    
    console.log("BODY:", req.body);
    const responseData = {
        message: 'Professionnel créé avec succès',
        ...utilisateur.toJSON(),
        nomEntreprise: professionnel.nomEntreprise,
        domaineActivite:  professionnel.domaineActivite
      };
    delete responseData.pwd;
    
    res.status(201).json(responseData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProfessionnels = async (req, res) => {
  try {
    const professionnels = await Utilisateur.findAll({
      where: { role: 'professionnel' },
      include: [{
        model: Professionnel,
        as: 'professionnel', 
        attributes: ['nomEntreprise','domaineActivite']
      }],
      attributes: ['cin', 'nom', 'prenom', 'email']
    });
    return res.status(200).json(professionnels);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfessionnel = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await Utilisateur.update({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        role:req.body.role
      }, {
        where: { cin: req.body.cin }, 
        transaction: t
      });

      await Professionnel.update({
        nomEntreprise: req.body.nomEntreprise,
        domaineActivite:  req.body.domaineActivite      }, {
        where: { cin: req.body.cin }, 
        transaction: t
      });
    });

    res.status(200).json({ message: 'Professionnel mis à jour avec succès' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProfessionnel = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.cin);
    if (!utilisateur) {
      return res.status(404).json({ message: "Professionnel non trouvé" });
    }
    await db.sequelize.transaction(async (t) => {
      await Professionnel.destroy({ 
        where: { cin: req.params.cin }, 
        transaction: t 
      });
      await Utilisateur.destroy({ 
        where: { cin: req.params.cin }, 
        transaction: t 
      });
    });

    return res.status(200).json({ message: "Professionnel supprimé avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createProfessionnel, getAllProfessionnels, updateProfessionnel, deleteProfessionnel };