import { Router } from 'express';
import { getAll, create, update, deleteRoute } from '../controllers/routeController';
import { protect } from '../middleware/auth';
import { createRouteValidation } from '../middleware/validate';

const router = Router();

router.get('/', getAll);
router.post('/', protect, createRouteValidation, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteRoute);

export default router;
