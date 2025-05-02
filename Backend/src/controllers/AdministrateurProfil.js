import db from '../models/index.js';
const { Utilisateur } = db;

const getAdministrateur = async (req, res) => {
  try {
    const admin = await Utilisateur.findOne({
      where: { 
        cin: req.params.administrateurId,  
        role: 'administrateur'
      },
      attributes: ['nom', 'prenom', 'email', 'role']
    });

    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }

    return res.status(200).json(admin);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const  getNbrUsers=async(req,res)=>{
  try{
  const nbrEtudiants=await Utilisateur.count({where :{role:'etudiant'}})
  const nbrEnseignants=await Utilisateur.count({where :{role:'enseignant'}})
  const nbrProfessionnels=   await   Utilisateur.count({where :{role:'professionnel'}})
const nbrTotal=nbrProfessionnels+nbrEnseignants+nbrEtudiants
return res.status(200).json({
  enseignants: nbrEnseignants,
  etudiants: nbrEtudiants,
  professionnels: nbrProfessionnels,
  total: nbrTotal
});
}catch(e){
  res.status(500).json({message:e.message})
}}
export { getAdministrateur, getNbrUsers}