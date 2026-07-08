import { Router } from 'express';
import { updateFromSensor, getHealth } from '../controllers/iotController.js';
import { validateIotKey } from '../middleware/iotAuth.js';

const router = Router();

router.get('/health', getHealth);
router.post('/status', validateIotKey, updateFromSensor);
router.get('/status', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'IoT endpoint is active. Use POST with x-api-key header and JSON body { "status": "OPEN" | "CLOSED" }',
    docs: 'See admin panel /admin/iot for details',
  });
});

export default router;
