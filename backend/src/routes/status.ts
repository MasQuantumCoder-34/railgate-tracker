import { Router } from 'express';
import { getCurrentStatus, getRecentUpdates, updateStatus } from '../controllers/statusController.js';
import { protect } from '../middleware/auth.js';
import { gateStatusValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getCurrentStatus);
router.get('/updates', getRecentUpdates);
router.post('/', protect, gateStatusValidation, updateStatus);

export default router;
