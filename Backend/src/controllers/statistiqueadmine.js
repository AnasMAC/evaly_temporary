import db from '../models/index.js';
const {sequelize} = db;
import QueryTypes from 'sequelize';


export const getNBRcadres = async (req, res) => {
    try {
        const nbrModule = await sequelize.query(
            'SELECT COUNT(*) as count FROM cadres WHERE "Type" = \'Module\'', 
            { type: QueryTypes.SELECT }
        );
        const nbrStage = await sequelize.query(
            'SELECT COUNT(*) as count FROM cadres WHERE "Type" = \'Stage\'', 
            { type: QueryTypes.SELECT }
        );
        const nbrProjet = await sequelize.query(
            'SELECT COUNT(*) as count FROM cadres WHERE "Type" = \'Projet\'', 
            { type: QueryTypes.SELECT }
        );
        res.status(200).json({
            nbrModule: nbrModule[0],
            nbrStage: nbrStage[0],
            nbrProjet: nbrProjet[0]
        });
    } catch (error) {
        console.error('Error fetching cadre count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
