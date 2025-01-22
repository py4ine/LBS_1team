import express from "express";
import ctrl from "./login.ctrl.js";

const router = express.Router();
router.post("/", ctrl.login);

export default router;
