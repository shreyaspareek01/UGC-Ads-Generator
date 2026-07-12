import express from 'express';
import { createProject, deleteProject, getAllPublishedProjects, generateProjectVideo, getProjectStatus } from '../controllers/projectController.js';
import { protect } from '../middlewares/auth.js';
import upload from '../configs/multer.js';

const projectRouter = express.Router();

projectRouter.post('/create', upload.array('images', 2), protect, createProject);
projectRouter.post('/generate-video/:projectId', protect, generateProjectVideo);
projectRouter.get('/status/:projectId', protect, getProjectStatus);
projectRouter.get('/published', getAllPublishedProjects);
projectRouter.delete('/:projectId', protect, deleteProject);

export default projectRouter;
