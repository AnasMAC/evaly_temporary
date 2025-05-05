import express from 'express';
import { getCompetenceIndicators} from '../controllers/indicateurs.js'; 
const router = express.Router();

router.get('/competence/:competenceId/indicateurs', getCompetenceIndicators);

export default router;
