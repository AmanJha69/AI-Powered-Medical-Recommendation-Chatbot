import { Router } from 'express';
import { bookAppointment, getUserAppointments } from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', bookAppointment);
router.get('/', getUserAppointments);

export default router;
