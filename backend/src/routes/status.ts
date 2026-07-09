import { Router } from 'express';
import { getCurrentStatus, getRecentClosures, updateStatus } from '../controllers/statusController.js';
import { gateStatusValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getCurrentStatus);
router.get('/closures', getRecentClosures);
router.post('/', gateStatusValidation, updateStatus);

export default router;