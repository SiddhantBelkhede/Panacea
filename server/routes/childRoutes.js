import express from "express";
import { registerChild } from "../controllers/childController.js";

const router = express.Router();

router.post("/register", registerChild);

export default router;
