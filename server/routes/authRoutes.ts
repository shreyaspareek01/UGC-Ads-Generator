import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', protect, getMe);

export default authRouter;
