import db from '../models/index.js';
const { Utilisateur, Professionnel } = db;

const getProfile = async (req, res) => {
    try {
        const professionnel = await Utilisateur.findOne({
            where: { 
                cin: req.params.cin,  
                role: 'professionnel'
            },
            attributes: ['nom', 'prenom', 'email', 'role'],
            include: [{
                model: Professionnel,as:'professionnel',
                attributes: ['nomEntreprise', 'domaineActivite']
            }]
        });
           

        if (!professionnel) {
            return res.status(404).json({ message: "Professionnel non trouvé" });
        }

        console.log(professionnel);
        return res.status(200).json(professionnel);

    } catch(err) {
        return res.status(500).json({ message: err.message });
    }
};

export { getProfile };