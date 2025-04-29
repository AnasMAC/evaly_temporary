import db from '../models/index.js';
const {Administrateur}=db
const checkAdmin = async (req, res, next) => {
    try {
      const admin = await Administrateur.findByPk(req.params.administrateurId);
      if (!admin) return res.status(403).json({ message: "Accès refusé" });
      next();
    } catch (error) {
      res.status(500).json({ message: "Erreur de vérification admin" });
    }
  };
  export default checkAdmin