import db from '../models/index.js';
import bcrypt from 'bcryptjs';

const { Utilisateur } = db; 

const changePwd = (roleAttendu) => async (req, res) => {  
  try {
    const { cin } = req.params;
    const { oldPwd, newPwd, confirmPwd } = req.body;  

    const utilisateur = await Utilisateur.findByPk(cin, {
      attributes: ['cin','pwd', 'role']  
    });

    if (!utilisateur) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    if (utilisateur.role !== roleAttendu) {
      return res.status(403).json({ msg: "Accès interdit pour ce type d'utilisateur" });  
    }

    const match = await bcrypt.compare(oldPwd, utilisateur.pwd);
    if (!match) {
      return res.status(400).json({ msg: "Ancien mot de passe incorrect" });
    }

    if (newPwd !== confirmPwd) {
      return res.status(400).json({ msg: "Les deux nouveaux mots de passe ne correspondent pas" });
    }

    const hashedPwd = await bcrypt.hash(newPwd, 10);
    await utilisateur.update({ pwd: hashedPwd });

    return res.status(200).json({ msg: "Mot de passe changé avec succès" });

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export { changePwd };
