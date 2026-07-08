import { Router } from 'express';
import { getUpcoming, getAll, create, update, remove } from '../controllers/scheduleController.js';

const router = Router();

router.get('/upcoming', getUpcoming);
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
