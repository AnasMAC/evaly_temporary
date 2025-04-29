import express from "express";
import {
  addCadre,
  deleteCadre,
  updateCadre,
  getAllCadres,
  getCadreById,
  ajouterEtudiant,
  supprimerEtudiant,
  ajouterCompetence,
  supprimerCompetence,
} from "../controllers/cadercontoler.js";

const Router = express.Router();

Router.get('/cadre', getAllCadres);
Router.get('/cadre/:id_cadre', getCadreById);

Router.post("/cadre",addCadre);
Router.delete("/cadre/:id_cadre",deleteCadre);
Router.put("/cadre/:id_cadre",updateCadre);

Router.post("/cadre/:id_cadre/etudiant/:id_Etudiant", ajouterEtudiant);
Router.delete("/cadre/:id_cadre/etudiant/:id_Etudiant", supprimerEtudiant);

Router.post("/cadre/:id_cadre", ajouterCompetence);
Router.delete("/cadre/:id_cadre/competence/:id_Competence", supprimerCompetence);



export default Router;