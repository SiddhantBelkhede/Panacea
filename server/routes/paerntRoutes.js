import express from 'express';
import { loginParent } from '../controllers/parentController.js';

const router = express.Router();

router.post('/login', loginParent);

export default router;
