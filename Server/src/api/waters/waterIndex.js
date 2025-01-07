import express from 'express'
import ctrl from './water.ctrl.js'

const router = express.Router();

router.get('/', ctrl.getWaterALL);

export default router