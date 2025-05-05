import express from'express'
import {getProfile} from '../controllers/ProfessionnelProfil.js'
import { changePwd } from '../controllers/changePwd.js'; 

const router=express.Router()
router.get('/profilProfessionnel/:cin',getProfile)

router.patch('Professionnel/changepwd/:cin', changePwd('professionnel'));

export default router;
