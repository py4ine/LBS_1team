import express from 'express'
import ctrl from './cases.ctrl.js'

const router = express.Router();
router.get('/', ctrl.getCasesALL);


export default router