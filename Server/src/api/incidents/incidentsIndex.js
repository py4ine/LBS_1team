import express from 'express'
import ctrl from './incidents.ctrl.js'

const router = express.Router();
router.get('/', ctrl.getIncidentALL);


export default router