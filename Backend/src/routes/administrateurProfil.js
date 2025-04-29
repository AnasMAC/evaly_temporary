import express from 'express';
import { getAdministrateur } from '../controllers/AdministrateurProfil.js';
import { changePwd } from '../controllers/changePwd.js'; 

const router = express.Router();

router.get('/:administrateurId', getAdministrateur);

router.patch('/changepwd/:cin', changePwd('administrateur'));

export default router;
