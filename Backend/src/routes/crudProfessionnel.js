import express from 'express';
import {
  createProfessionnel,
  getAllProfessionnels,
  updateProfessionnel,
  deleteProfessionnel
} from '../controllers/ProfessionnelControllers.js';
import checkAdmin from '../middlewares/verification.js';
const router = express.Router();
//router.use('/:administrateurId', checkAdmin);
router.post('/:administrateurId', createProfessionnel);
router.get('/:administrateurId', getAllProfessionnels);
router.put('/:administrateurId', updateProfessionnel);
router.delete('/:administrateurId/:cin', deleteProfessionnel);
export default router;
