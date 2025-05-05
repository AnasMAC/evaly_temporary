import express from'express'
import {getProfile} from '../controllers/EnseignantProfil.js'
import { changePwd } from '../controllers/changePwd.js'; 

const router=express.Router()
router.get('/profilEnseignant/:cin',getProfile)

router.patch('Enseignant/changepwd/:cin', changePwd('enseignant'));

export default router;