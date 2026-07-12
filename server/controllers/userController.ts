import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export const getCredits = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { credits: true }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ credits: user.credits });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ projects });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId: req.userId }
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ project });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const toggleProjectPublic = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId: req.userId }
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await prisma.project.update({
            where: { id: projectId },
            data: { isPublished: !project.isPublished }
        });
        res.json({ isPublished: !project.isPublished });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};