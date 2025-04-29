import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRouters.js";
import cors from 'cors';
import etudiantRoutes from './src/routes/crudEtudiant.js';
import enseignantRoutes from './src/routes/crudEnseignant.js';
import professionnelRoutes from './src/routes/crudProfessionnel.js';
import adminProfil from './src/routes/administrateurProfil.js';
import { changePwd } from "./src/controllers/changePwd.js";
import adminRouter from "./src/routes/cadreRouter.js"
import CompetenceRouter from "./src/routes/CompetenceRouter.js";
import StatiqueRouter from "./src/routes/statistiqueRouter.js";
import EvaluationRouter from "./src/routes/evaluationRouter.js";


const app = express();
app.use(express.json());

app.use('/api/etudiants', etudiantRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/professionnels', professionnelRoutes);
app.use('/adminProfil',adminProfil)
app.use('/auth', authRoutes);
app.use('/api', adminRouter); 
app.use('/api', CompetenceRouter);
app.use('/api', StatiqueRouter);
app.use('/api', EvaluationRouter);
// Utiliser CORS pour toutes les routes
app.use(cors({
  origin: 'http://localhost:8080' ,
  credentials: true
}));

/*app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});*/



// Middleware pour parser les requêtes JSON et les cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is live and watching!");
});

// Route d'authentification
app.use('/auth', authRoutes);

// Écoute du serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Le serveur fonctionne à l'adresse http://localhost:${PORT}`);
});

export default app;