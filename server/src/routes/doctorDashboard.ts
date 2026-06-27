import { Router } from 'express';
import { getDoctorAppointments, updateAppointmentStatus } from '../controllers/doctorDashboardController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

export default router;
