import express from "express";
import {
    getAllEvaluations,
    getEvaluationById,
    getEvaluationforEtudiant,
    getEvaluationforProf,
    createEvaluation,
} from "../controllers/evaluationController.js";

Router = express.Router();

Router.get("/evaluation", getAllEvaluations);
Router.get("/evaluation/:id", getEvaluationById);
Router.get("/evaluation/etudiant/:cin", getEvaluationforEtudiant);
Router.get("/evaluation/prof/:cin", getEvaluationforProf);
Router.post("/evaluation", createEvaluation);

