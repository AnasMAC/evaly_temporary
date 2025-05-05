import db from '../models/index.js'
const { Competence, Indicateur } =db; 

export const getCompetenceIndicators = async (req, res) => {
    try {
        const { competenceId } = req.params; 
        if (!competenceId) {
            return res.status(400).json({ message: "ID de la compétence requis" });
        }
        const competence = await Competence.findByPk(competenceId, {
            include: [{
                model: Indicateur,
                as: 'indicateurs',
                attributes: ['id_indicateur', 'indicateur'] 
            }]
        });

        if (!competence) {
            return res.status(404).json({ message: "Compétence non trouvée" });
        }

        res.status(200).json(competence.indicateurs); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
