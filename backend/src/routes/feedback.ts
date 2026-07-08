import { Router } from 'express';
import { getAll, create, deleteFeedback, markResolved } from '../controllers/feedbackController.js';
import { feedbackValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getAll);
router.post('/', feedbackValidation, create);
router.put('/:id/resolve', markResolved);
router.delete('/:id', deleteFeedback);

export default router;
