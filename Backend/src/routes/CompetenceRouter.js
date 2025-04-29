import express from 'express';
import { 
    addCompetences,
    getCompetences,
    getCompetenceById,
    updateCompetence,
    deleteCompetence
} from '../controllers/CompetenceController.js';

const Router = express.Router();

Router.post('/competence', addCompetences);
Router.get('/competence', getCompetences);
Router.get('/competence/:id_Competence', getCompetenceById);
Router.put('/competence/:id_Competence', updateCompetence);
Router.delete('/competence/:id_Competence', deleteCompetence);
export default Router;
