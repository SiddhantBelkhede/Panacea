import express from 'express';
import {
  registerChild,
  getChildByCode,
  addVaccinationRecord,
  scheduleVaccination,
} from '../controllers/childController.js';

const router = express.Router();

router.post('/register', registerChild);
router.get('/:code', getChildByCode);
router.post('/vaccinate', addVaccinationRecord);
router.post('/schedule', scheduleVaccination);

export default router;
