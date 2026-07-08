import { Router } from 'express';
import { getAll, create, update, deleteTrain } from '../controllers/trainController.js';
import { protect } from '../middleware/auth.js';
import { createTrainValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getAll);
router.post('/', protect, createTrainValidation, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteTrain);

export default router;
