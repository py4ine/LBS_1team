import express from 'express'
import ctrl from './details.ctrl.js'

const router = express.Router();
router.get('/', ctrl.getDetailALL);

router.get('/:bldg_id', ctrl.getDetailByBldgId);

export default router