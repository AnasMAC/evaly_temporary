

import db from '../models/index.js';
const { Utilisateur, Enseignant } = db;

const getProfile = async (req, res) => {
    try {
        const enseignant = await Utilisateur.findOne({
            where: { 
                cin: req.params.cin,  
                role: 'enseignant'
            },
            attributes: ['nom', 'prenom', 'email', 'role'],
            include: [{
                model: Enseignant,as:'enseignant',
                attributes: ['departement']
            }]
        });

        if (!enseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }

        console.log(enseignant);
        return res.status(200).json(enseignant);

    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
};

export { getProfile };