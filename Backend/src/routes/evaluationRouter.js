import express from "express";
import {
    getAllEvaluations,
    getEvaluationById,
    getEvaluationforEtudiant,
    getEvaluationforProf,
} from "../controllers/evaluationController.js";

const Router = express.Router();

Router.get("/evaluation", getAllEvaluations);
Router.get("/evaluation/:id", getEvaluationById);
Router.get("/evaluation/etudiant/:id_etudiant", getEvaluationforEtudiant);
Router.get("/evaluation/prof/:id_enseignant", getEvaluationforProf);


export default Router;

