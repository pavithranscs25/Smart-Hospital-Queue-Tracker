import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';

const router = Router();

router.get('/dashboard', adminController.getDashboardStats);

export default router;
