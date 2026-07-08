import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import { loginValidation } from '../middleware/validate.js';

const router = Router();

router.post('/login', loginValidation, login);
router.get('/me', getMe);

export default router;
