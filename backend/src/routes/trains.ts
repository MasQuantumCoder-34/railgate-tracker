import { Router } from 'express';
import { getAll, create, update, deleteTrain } from '../controllers/trainController';
import { protect } from '../middleware/auth';
import { createTrainValidation } from '../middleware/validate';

const router = Router();

router.get('/', getAll);
router.post('/', protect, createTrainValidation, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteTrain);

export default router;
