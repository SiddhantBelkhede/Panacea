import express from 'express';
import {
  registerHospital,
  loginHospital,
  getPendingRequest,
} from '../controllers/hospitalController.js';

const router = express.Router();

router.post('/register', registerHospital);
router.post('/login', loginHospital);
router.get('/:id/requests', getPendingRequest);

export default router;
