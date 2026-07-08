import { Router } from 'express';
import { getCurrentStatus, getRecentUpdates, updateStatus } from '../controllers/statusController.js';
import { gateStatusValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getCurrentStatus);
router.get('/updates', getRecentUpdates);
router.post('/', gateStatusValidation, updateStatus);

export default router;
