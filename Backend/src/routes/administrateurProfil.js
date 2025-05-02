import express from 'express';
import { getAdministrateur, getNbrUsers } from '../controllers/AdministrateurProfil.js';
import { changePwd } from '../controllers/changePwd.js'; 
import checkAdmin from './../middlewares/verification.js';

const router = express.Router();
router.get('/:administrateurId', getAdministrateur);
router.patch('/changepwd/:administrateurId', changePwd('administrateur'));
router.get('/Utilisateurs/:administrateurId', checkAdmin, getNbrUsers);

export default router;