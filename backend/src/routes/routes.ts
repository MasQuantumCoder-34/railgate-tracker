import { Router } from 'express';
import { getAll, create, update, deleteRoute } from '../controllers/routeController.js';
import { createRouteValidation } from '../middleware/validate.js';

const router = Router();

router.get('/', getAll);
router.post('/', createRouteValidation, create);
router.put('/:id', update);
router.delete('/:id', deleteRoute);

export default router;
