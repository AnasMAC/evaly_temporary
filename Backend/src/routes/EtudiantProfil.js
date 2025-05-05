import express from'express'

import {getProfile} from '../controllers/EtudiantProfil.js'
import { changePwd } from '../controllers/changePwd.js'; 

const router=express.Router()
router.get('/profilEtudiant/:cin',getProfile)

router.patch('Etudiant/changepwd/:cin', changePwd('etudiant'));
 
export default router;