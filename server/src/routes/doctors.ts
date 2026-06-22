import { Router } from 'express';
import { listDoctors } from '../controllers/doctorController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, listDoctors);

export default router;
