import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./src/routes/authRouters.js";
import etudiantRoutes from './src/routes/crudEtudiant.js';
import enseignantRoutes from './src/routes/crudEnseignant.js';
import professionnelRoutes from './src/routes/crudProfessionnel.js';
import adminProfil from './src/routes/administrateurProfil.js';

import adminRouter from "./src/routes/cadreRouter.js";
import CompetenceRouter from "./src/routes/CompetenceRouter.js";
import StatiqueRouter from "./src/routes/statistiqueRouter.js";
import EvaluationRouter from "./src/routes/evaluationRouter.js";
import Evaluation from "./src/routes/Evaluation.js";
import EtudiantProfil from './src/routes/EtudiantProfil.js'
import EnseignantProfil from './src/routes/EnseignantProfil.js'
import ProfessionnelProfil from './src/routes/ProfessionnelProfil.js'
import indicateurRoutes from './src/routes/indicateur.js';
const app = express();
app.use(express.json());

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Autoriser les cookies
}));

// Middleware pour parser les cookies
app.use(cookieParser());
app.use('/',EnseignantProfil)
app.use('/',EtudiantProfil)
app.use('/',ProfessionnelProfil)
app.use('/', indicateurRoutes);
app.use('/', Evaluation);
// Routes de l'API
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/professionnels', professionnelRoutes);
app.use('/adminProfil', adminProfil);
app.use('/auth', authRoutes);
app.use('/api', adminRouter); 
app.use('/api', CompetenceRouter);
app.use('/api', StatiqueRouter);
app.use('/api', EvaluationRouter);

// Route d'authentification
app.use('/auth', authRoutes);

// Route de test
app.get("/", (req, res) => {
  res.send("Backend is live and watching!");
});

// Écoute du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Le serveur fonctionne à l'adresse http://localhost:${PORT}`);
});

export default app;
