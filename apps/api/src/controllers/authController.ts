import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import {generateToken} from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
    try {
        const {email, password, name} = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }

        if (password.length < 6) {
            return res.status(400).json({error: 'Password must be at least 6 characters'});
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return res.status(400).json({error: 'Email already registered'});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: 'Failed to register user'});
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }

        // Find user
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        // Generate token
        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: 'Failed to login'});
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                tenants: {
                    select: {
                        id: true,
                        storeName: true,
                        storeUrl: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({error: 'Failed to fetch user data'});
    }
};
