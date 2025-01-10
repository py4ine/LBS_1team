import express from 'express'
import ctrl from './images.ctrl.js'

const router = express.Router();

router.get('/:bldg_id', ctrl.getImagesByBldgId);

export default router