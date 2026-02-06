import express from "express";
import {
  registerChild,
  getChildByCode,
  addVaccinationRecord,
} from "../controllers/childController.js";

const router = express.Router();

router.post("/register", registerChild);
router.get("/:code", getChildByCode);
router.post("/vaccinate", addVaccinationRecord);

export default router;
