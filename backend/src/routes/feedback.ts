import { Router } from 'express';
import { getAll, create, deleteFeedback, markResolved } from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';
import { feedbackValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', protect, getAll);
router.post('/', feedbackValidation, create);
router.put('/:id/resolve', protect, markResolved);
router.delete('/:id', protect, deleteFeedback);

export default router;
