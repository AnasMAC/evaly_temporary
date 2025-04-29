import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { generatePassword } from './EtudiantControllers.js'; 
const { Utilisateur, Enseignant } = db;

const createEnseignant = async (req, res) => {
  try {
    const rawPassword = generatePassword();
    const pwd = await bcrypt.hash(rawPassword, 10); 
    const utilisateur = await Utilisateur.create({
      cin: req.body.cin,
      pwd: pwd,
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      role: 'enseignant', 
      administrateurId: req.params.administrateurId
    });

   const enseignant= await Enseignant.create({
      cin: utilisateur.cin,
      departement: req.body.departement,
    });
    
    console.log("BODY:", req.body);
    const responseData = {
        message: 'Enseignant créé avec succès',
        ...utilisateur.toJSON(),
        departement: enseignant.departement
      };
    delete responseData.pwd;
    
    res.status(201).json(responseData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await Utilisateur.findAll({
      where: { role: 'enseignant' },
      include: [{
        model: Enseignant,
        as: 'enseignant', 
        attributes: ['departement']
      }],
      attributes: ['cin', 'nom', 'prenom', 'email']
    });
    return res.status(200).json(enseignants);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEnseignant = async (req, res) => {
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

      await Enseignant.update({
        departement: req.body.departement,
      }, {
        where: { cin: req.body.cin }, 
        transaction: t
      });
    });

    res.status(200).json({ message: 'Enseignant mis à jour avec succès' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnseignant = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.cin);
    if (!utilisateur) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }
    await db.sequelize.transaction(async (t) => {
      await Enseignant.destroy({ 
        where: { cin: req.params.cin }, 
        transaction: t 
      });
      await Utilisateur.destroy({ 
        where: { cin: req.params.cin }, 
        transaction: t 
      });
    });

    return res.status(200).json({ message: "Enseignant supprimé avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createEnseignant, getAllEnseignants, updateEnseignant, deleteEnseignant };