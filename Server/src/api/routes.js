import { Router } from "express";
import login from "./login/loginIndex.js";
import details from "./details/detailsIndex.js";
import waters from "./waters/waterIndex.js";
import danger from "./danger/dangerIndex.js";
import cases from "./cases/casesIndex.js";
import around from "./around/aroundIndex.js";
import images from "./images/imagesIndex.js";

const router = Router();

router.use("/login", login);
router.use("/details", details);
router.use("/waters", waters);
router.use("/danger", danger);
router.use("/cases", cases);
router.use("/around", around);
router.use("/images", images);

const mountRouters = (app) => {
  app.use("/api", router); // 모든 경로에 "/api" 추가
};

export default mountRouters;
