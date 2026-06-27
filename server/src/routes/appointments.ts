import { Router } from 'express';
import { bookAppointment, getUserAppointments, cancelAppointment, rescheduleAppointment } from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', bookAppointment);
router.get('/', getUserAppointments);
router.delete('/:id', cancelAppointment);
router.put('/:id', rescheduleAppointment);

export default router;
