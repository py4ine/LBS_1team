import express from "express";
import ctrl from "./around.ctrl.js";

const router = express.Router();
router.get("/", ctrl.getAroundALL);

export default router;
