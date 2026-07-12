import express from 'express';
import { getAllProjects, getProjectById, toggleProjectPublic, getCredits } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/credits', protect, getCredits);
userRouter.get('/projects', protect, getAllProjects);
userRouter.get('/projects/:projectId', protect, getProjectById);
userRouter.get('/publish/:projectId', protect, toggleProjectPublic);

export default userRouter;
