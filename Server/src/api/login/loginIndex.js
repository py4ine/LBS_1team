import express from 'express'
import ctrl from './loginCtrl.js'

const router = express.Router();
router.post('/', ctrl.login);

export default router;