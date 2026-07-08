import { Router } from 'express';
import { getPublicStats, getAdminStats } from '../controllers/statsController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/public', getPublicStats);
router.get('/admin', protect, getAdminStats);

export default router;
