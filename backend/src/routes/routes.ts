import { Router } from 'express';
import { getAll, create, update, deleteRoute } from '../controllers/routeController.js';
import { protect } from '../middleware/auth.js';
import { createRouteValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getAll);
router.post('/', protect, createRouteValidation, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteRoute);

export default router;
