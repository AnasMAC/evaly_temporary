import express from 'express';
import {
    getUserCadres,
    getCadreStudents,
    getEvaluationContext,
    submitEvaluation
} from '../controllers/evaluationController.js';

const router = express.Router();

router.get('/cadres',  getUserCadres);
router.get('/cadres/:cadreId/students',  getCadreStudents);
router.get(
    '/evaluation/:cadreId/:cinEvaluateur/:cinEvalue',
    getEvaluationContext
);

router.post(
    '/evaluation/:cadreId/:cinEvaluateur/:cinEvalue',
    submitEvaluation
);

export default router;