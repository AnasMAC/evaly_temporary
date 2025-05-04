import express from "express";
import {
    getAllEvaluations,
    getEvaluationById,
    getEvaluationforProf,
    getCo_evaluationforEtudiant,
    getauto_EvaluationforEtudiant,
} from "../controllers/evaluationController.js";

const Router = express.Router();

Router.get("/evaluation", getAllEvaluations);
Router.get("/evaluation/:id", getEvaluationById);
Router.get("/Co_evaluation/etudiant/:id_etudiant", getCo_evaluationforEtudiant);
Router.get("/auto_evaluation/etudiant/:id_etudiant", getauto_EvaluationforEtudiant);
Router.get("/evaluation/prof/:id_enseignant", getEvaluationforProf);


export default Router;

