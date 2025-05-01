import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const generatePassword = (length = 8) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
};
const { Utilisateur, Etudiant} = db;

const createEtudiant = async (req, res) => {
  try {
    const rawPassword = generatePassword();
    const pwd = await bcrypt.hash(rawPassword, 10); 
    console.log("Raw Password:", rawPassword);
    const utilisateur = await Utilisateur.create({
      cin: req.body.cin,
      pwd: pwd,
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      role: req.body.role,
      administrateurId: req.params.administrateurId
    });

    await Etudiant.create({
      cin: utilisateur.cin,
      promotion: req.body.promotion,
      filiere: req.body.filiere
    });
    console.log("BODY:", req.body);
    const responseData = {
      message: 'Etudiant créé avec succès',
      ...utilisateur.toJSON(),promotion: req.body.promotion,
      filiere: req.body.filiere
    };
  delete responseData.pwd;
  
  res.status(201).json(responseData);

  } catch (error) {
    console.error("Full Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllEtudiants = async (req, res) => {
  try {
    
    const etudiants = await Utilisateur.findAll({
      where: { role: 'etudiant' },
      include: [{
        model: Etudiant,
        as: 'etudiant',
        attributes: ['filiere', 'promotion']
      }],
      attributes: ['cin', 'nom', 'prenom', 'email']
    });

    return res.status(200).json(etudiants);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateEtudiant = async (req, res) => {
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
  
        await Etudiant.update({
          promotion: req.body.promotion,
          filiere: req.body.filiere
        }, {
          where: { cin: req.body.cin },
          transaction: t
        });
      });
  
      res.status(200).json({ message: 'Étudiant mis à jour avec succès' });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const deleteEtudiant = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByPk(req.params.cin );
      if (!utilisateur) {
        return res.status(404).json({ message: "Étudiant non trouvé" });
      }
        await db.sequelize.transaction(async (t) => {
        await Etudiant.destroy({ where: { cin: req.params.cin }, transaction: t });
        await Utilisateur.destroy({ where: { cin: req.params.cin }, transaction: t });
      });
  
      return res.status(200).json({ message: "Étudiant supprimé avec succès" });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  export { createEtudiant, getAllEtudiants, updateEtudiant,deleteEtudiant ,generatePassword };