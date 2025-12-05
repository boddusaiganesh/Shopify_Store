import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authController from '../controllers/authController';
import prisma from '../prisma';

const app = express();
app.use(express.json());
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

describe('Authentication Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                id: 'test-user-id',
                email: 'test@example.com',
                password: 'hashedpassword',
                name: 'Test User',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe('test@example.com');
        });

        it('should reject registration with existing email', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 'existing-user',
                email: 'test@example.com',
            });

            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email already registered');
        });

        it('should reject registration with short password', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    email: 'test@example.com',
                    password: '12345',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Password must be at least 6 characters');
        });

        it('should reject registration without email', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    password: 'password123',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email and password are required');
        });
    });

    describe('POST /auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = {
                id: 'test-user-id',
                email: 'test@example.com',
                password: hashedPassword,
                name: 'Test User',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('test@example.com');
        });

        it('should reject login with invalid email', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid email or password');
        });

        it('should reject login with invalid password', async () => {
            const hashedPassword = await bcrypt.hash('correctpassword', 10);
            const mockUser = {
                id: 'test-user-id',
                email: 'test@example.com',
                password: hashedPassword,
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid email or password');
        });

        it('should reject login without credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email and password are required');
        });
    });

    describe('JWT Token Generation', () => {
        it('should generate valid JWT token', () => {
            const userId = 'test-user-id';
            const token = jwt.sign({userId}, process.env.JWT_SECRET || 'test-secret', {expiresIn: '7d'});

            expect(token).toBeDefined();

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as any;
            expect(decoded.userId).toBe(userId);
        });
    });
});
