import express from 'express'
import ctrl from './danger.ctrl.js'

const router = express.Router();
router.get('/', ctrl.getdangerALL);


export default router