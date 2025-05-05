




import db from '../models/index.js';

const { Utilisateur, Etudiant } = db;

const getProfile = async (req, res) => {
    try {
        const etudiant = await Utilisateur.findOne({
            where: { 
                cin: req.params.cin,  
                role: 'etudiant'
            },
            attributes: ['nom', 'prenom', 'email', 'role'],
            include: [{
                model: Etudiant,as:'etudiant',
                attributes: ['promotion', 'filiere']
            }]
        });

        if (!etudiant) {
            return res.status(404).json({ message: "Etudiant non trouvé" });
        }
console.log(etudiant)
        return res.status(200).json(etudiant);

    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

export { getProfile };