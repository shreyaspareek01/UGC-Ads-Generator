import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { generateImage, generateVideo } from '../services/generationService.js';

const IMAGE_CREDITS = 5;
const VIDEO_CREDITS = 10;

export const createProject = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { name = 'New Project', aspectRatio, userPrompt, productName, productDescription, targetLength } = req.body;
    const images: any = req.files;

    if (!images || images.length < 2 || !productName)
        return res.status(400).json({ message: 'Please upload at least 2 images and provide product name' });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.credits < IMAGE_CREDITS)
            return res.status(400).json({ message: `Not enough credits. You need ${IMAGE_CREDITS} credits. You have ${user.credits}.` });

        const uploadedImages: string[] = images.map((item: any) => `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${item.filename}`);

        const project = await prisma.project.create({
            data: {
                name,
                userId,
                productName,
                productDescription: productDescription || '',
                userPrompt: userPrompt || '',
                aspectRatio: aspectRatio || '9:16',
                targetLength: parseInt(targetLength) || 5,
                uploadedImages,
                generatedImage: '',
                isGenerating: true,
            }
        });

        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: IMAGE_CREDITS } }
        });

        res.json({ message: 'Project created, generating image...', projectId: project.id });

        generateImage({
            productName,
            productDescription: productDescription || '',
            userPrompt: userPrompt || '',
            aspectRatio: aspectRatio || '9:16',
        }).then(async (generatedImageUrl) => {
            await prisma.project.update({
                where: { id: project.id },
                data: { generatedImage: generatedImageUrl, isGenerating: false }
            });
        }).catch(async (error) => {
            console.error('Image generation failed:', error);
            await prisma.project.update({
                where: { id: project.id },
                data: { error: error.message || 'Image generation failed', isGenerating: false }
            });
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const generateProjectVideo = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { projectId } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.credits < VIDEO_CREDITS)
            return res.status(400).json({ message: `Not enough credits. You need ${VIDEO_CREDITS} credits. You have ${user.credits}.` });

        const project = await prisma.project.findUnique({ where: { id: projectId, userId } });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (!project.generatedImage)
            return res.status(400).json({ message: 'Generate an image first' });
        if (project.generatedVideo)
            return res.json({ message: 'Video already exists', videoUrl: project.generatedVideo });

        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: VIDEO_CREDITS } }
        });

        await prisma.project.update({
            where: { id: projectId },
            data: { isGenerating: true }
        });

        res.json({ message: 'Generating video...' });

        generateVideo({
            imageUrl: project.generatedImage,
            aspectRatio: project.aspectRatio,
            targetLength: project.targetLength,
        }).then(async (videoUrl) => {
            await prisma.project.update({
                where: { id: projectId },
                data: { generatedVideo: videoUrl, isGenerating: false }
            });
        }).catch(async (error) => {
            console.error('Video generation failed:', error);
            await prisma.project.update({
                where: { id: projectId },
                data: { error: error.message || 'Video generation failed', isGenerating: false }
            });
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getProjectStatus = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId: req.userId },
            select: { id: true, generatedImage: true, generatedVideo: true, isGenerating: true, error: true }
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ project });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllPublishedProjects = async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany({ where: { isPublished: true } });
        res.json({ projects });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: projectId, userId: req.userId }
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await prisma.project.delete({ where: { id: projectId } });
        res.json({ message: 'Project deleted' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
