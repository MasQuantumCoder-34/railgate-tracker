import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginValidation } from '../middleware/validate.js';

const router = Router();

router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

export default router;
