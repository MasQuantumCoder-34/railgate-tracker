import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { loginValidation } from '../middleware/validate';

const router = Router();

router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);

export default router;
