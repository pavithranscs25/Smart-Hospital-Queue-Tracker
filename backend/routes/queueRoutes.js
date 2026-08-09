import { Router } from 'express';
import { queueController } from '../controllers/queueController.js';

const router = Router();

// Departments & Doctors
router.get('/departments', queueController.getDepartments);
router.get('/doctors', queueController.getDoctors);

// Queue endpoints
router.post('/token', queueController.generateToken);
router.get('/current', queueController.getCurrentQueue);
router.get('/doctor/:doctorId', queueController.getDoctorQueue);
router.get('/patient/:patientId', queueController.getPatientHistory);
router.get('/:token', queueController.getTokenDetails);

// Doctor queue control operations
router.put('/:token/call', queueController.callPatient);
router.put('/:token/complete', queueController.completePatient);
router.put('/:token/skip', queueController.skipPatient);
router.put('/:token/hold', queueController.holdPatient);

export default router;
