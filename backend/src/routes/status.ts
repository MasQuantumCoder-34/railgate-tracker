import { Router } from 'express';
import { getCurrentStatus, getRecentUpdates, updateStatus } from '../controllers/statusController';
import { protect } from '../middleware/auth';
import { gateStatusValidation } from '../middleware/validate';

const router = Router();

router.get('/', getCurrentStatus);
router.get('/updates', getRecentUpdates);
router.post('/', protect, gateStatusValidation, updateStatus);

export default router;
