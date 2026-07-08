import { Router } from 'express';
import { getAll, create, update, deleteTrain } from '../controllers/trainController.js';
import { createTrainValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getAll);
router.post('/', createTrainValidation, create);
router.put('/:id', update);
router.delete('/:id', deleteTrain);

export default router;
