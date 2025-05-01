import express from 'express';
import { getNBRcadres } from '../controllers/statistiqueadmine.js';

const Router = express.Router();


Router.get('/statcadres', getNBRcadres);



export default Router;
