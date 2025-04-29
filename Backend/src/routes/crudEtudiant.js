import express from 'express';
import {
  createEtudiant,
  getAllEtudiants,
  updateEtudiant,
  deleteEtudiant
} from '../controllers/EtudiantControllers.js';
import checkAdmin from '../middlewares/verification.js';
const router = express.Router();
// router.use('/:administrateurId', checkAdmin);
router.post('/:administrateurId', createEtudiant);
router.get('/:administrateurId', getAllEtudiants);
router.put('/:administrateurId', updateEtudiant);
router.delete('/:administrateurId/:cin', deleteEtudiant);
export default router;