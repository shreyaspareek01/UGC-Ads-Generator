import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../configs/prisma.js';

const signToken = (userId: string) =>
    jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashed }
        });

        const token = signToken(user.id);
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, credits: user.credits } });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken(user.id);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, credits: user.credits } });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, credits: true }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
