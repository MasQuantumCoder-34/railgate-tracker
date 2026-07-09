import { Router } from 'express';
import { report, getRecentReport } from '../controllers/communityController.js';

const router = Router();

router.post('/', report);
router.get('/latest', getRecentReport);

export default router;