import { Router } from 'express';
import { getUpcoming, getAll, create, update, remove } from '../controllers/scheduleController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/upcoming', getUpcoming);
router.get('/', protect, getAll);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);

export default router;
