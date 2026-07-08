import { Router } from 'express';
import { getPublicStats, getAdminStats } from '../controllers/statsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/public', getPublicStats);
router.get('/admin', protect, getAdminStats);

export default router;
