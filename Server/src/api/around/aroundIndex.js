import express from 'express'
import ctrl from './aroundctrl.js'

const router = express.Router();
router.get('/', ctrl.getAroundALL);


export default router