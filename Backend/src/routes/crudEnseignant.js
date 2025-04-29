import express from 'express';
import {
  createEnseignant,
  getAllEnseignants,
  updateEnseignant,
  deleteEnseignant
} from '../controllers/EnseignantControllers.js';
import checkAdmin from '../middlewares/verification.js';
const router = express.Router();
router.use('/:administrateurId', checkAdmin);
router.post('/:administrateurId', createEnseignant);
router.get('/:administrateurId', getAllEnseignants);
router.put('/:administrateurId', updateEnseignant);
router.delete('/:administrateurId/:cin', deleteEnseignant);
export default router;
