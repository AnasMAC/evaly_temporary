import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { existsSync } from 'fs';

// Import des routes
import authRoutes from "./src/routes/authRouters.js";
import etudiantRoutes from './src/routes/crudEtudiant.js';
import enseignantRoutes from './src/routes/crudEnseignant.js';
import professionnelRoutes from './src/routes/crudProfessionnel.js';
import adminProfil from './src/routes/administrateurProfil.js';
import adminRouter from "./src/routes/cadreRouter.js";
import CompetenceRouter from "./src/routes/CompetenceRouter.js";
import StatiqueRouter from "./src/routes/statistiqueRouter.js";
import Evaluation from "./src/routes/Evaluation.js";
import { getCompetenceIndicators } from "./src/controllers/indicateurs.js";
import EtudiantProfil from './src/routes/EtudiantProfil.js'
import EnseignantProfil from './src/routes/EnseignantProfil.js'
import ProfessionnelProfil from './src/routes/ProfessionnelProfil.js'
import indicateurRoutes from './src/routes/indicateur.js';


// Configuration du chemin
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerPath = join(__dirname, 'src', 'docs', 'swagger.yaml');

// Vérification du fichier Swagger
if (!existsSync(swaggerPath)) {
  console.error(`Erreur: Fichier Swagger introuvable à ${swaggerPath}`);
  console.log('Veuillez vérifier que :');
  console.log('1. Le fichier swagger.yaml existe dans src/docs/');
  console.log('2. Le nom du fichier est exact (attention à la casse)');
  process.exit(1);
}

// Chargement du document Swagger
let swaggerDocument;
try {
  swaggerDocument = YAML.load(swaggerPath);
} catch (error) {
  console.error('Erreur lors du chargement du fichier Swagger:', error.message);
  process.exit(1);
}

// Configuration de l'application
const app = express();
app.use('/',EnseignantProfil)
app.use('/',EtudiantProfil)
app.use('/',ProfessionnelProfil)
// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(cookieParser());
app.use('/', indicateurRoutes);
// Configuration Swagger UI (une seule configuration)
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "API Documentation",
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'none'
    }
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/professionnels', professionnelRoutes);
app.use('/adminProfil', adminProfil);
app.use('/api', adminRouter);
app.use('/api', CompetenceRouter);
app.use('/api', StatiqueRouter);
app.use('/', Evaluation);
app.use('/', getCompetenceIndicators);

// Route de test
app.get("/", (req, res) => {
  res.send("Backend is live and watching!");
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// Écoute du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation API disponible sur http://localhost:${PORT}/api-docs`);
});

export default app;