import { Router } from 'express';
import { getPublicStats, getAdminStats } from '../controllers/statsController.js';

const router = Router();

router.get('/public', getPublicStats);
router.get('/admin', getAdminStats);

export default router;
