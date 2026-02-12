import express from 'express';
import {
  registerChild,
  getChildByCode,
  addVaccinationRecord,
  scheduleVaccination,
  requestAppointment,
  updateAppointmentStatus
} from '../controllers/childController.js';

const router = express.Router();

router.post('/register', registerChild);
router.get('/:code', getChildByCode);
router.post('/vaccinate', addVaccinationRecord);
router.post('/schedule', scheduleVaccination);
router.post('/request-appointment', requestAppointment);
router.post('/update-appointment', updateAppointmentStatus);

export default router;
