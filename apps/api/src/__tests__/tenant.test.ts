import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import * as tenantController from '../controllers/tenantController';
import {authenticateToken} from '../middleware/auth';
import prisma from '../prisma';

const app = express();
app.use(express.json());
app.post('/tenants', authenticateToken, tenantController.createTenant);
app.get('/tenants', authenticateToken, tenantController.getTenants);
app.get('/tenants/:id', authenticateToken, tenantController.getTenant);

const generateToken = (userId: string) => {
    return jwt.sign({userId}, process.env.JWT_SECRET || 'test-secret', {expiresIn: '7d'});
};

describe('Tenant Tests', () => {
    const userId = 'test-user-id';
    let token: string;

    beforeEach(() => {
        jest.clearAllMocks();
        token = generateToken(userId);
    });

    describe('POST /tenants - Create Tenant', () => {
        it('should create a new tenant successfully', async () => {
            const mockTenant = {
                id: 'tenant-id',
                storeName: 'Test Store',
                storeUrl: 'https://test.myshopify.com',
                accessToken: 'shpat_test123',
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.tenant.create as jest.Mock).mockResolvedValue(mockTenant);

            const response = await request(app)
                .post('/tenants')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    storeName: 'Test Store',
                    storeUrl: 'https://test.myshopify.com',
                    accessToken: 'shpat_test123',
                });

            expect(response.status).toBe(200);
            expect(response.body.storeName).toBe('Test Store');
            expect(prisma.tenant.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    storeName: 'Test Store',
                    storeUrl: 'https://test.myshopify.com',
                    userId,
                }),
            });
        });

        it('should reject tenant creation without authentication', async () => {
            const response = await request(app)
                .post('/tenants')
                .send({
                    storeName: 'Test Store',
                    storeUrl: 'https://test.myshopify.com',
                    accessToken: 'shpat_test123',
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Access token required');
        });

        it('should reject tenant creation without required fields', async () => {
            const response = await request(app)
                .post('/tenants')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    storeName: 'Test Store',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Store name, URL, and access token are required');
        });

        it('should reject duplicate store URL', async () => {
            (prisma.tenant.create as jest.Mock).mockRejectedValue({
                code: 'P2002',
                meta: {target: ['storeUrl']},
            });

            const response = await request(app)
                .post('/tenants')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    storeName: 'Test Store',
                    storeUrl: 'https://test.myshopify.com',
                    accessToken: 'shpat_test123',
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Store URL already exists');
        });
    });

    describe('GET /tenants - List Tenants', () => {
        it('should list all user tenants', async () => {
            const mockTenants = [
                {
                    id: 'tenant-1',
                    storeName: 'Store 1',
                    storeUrl: 'https://store1.myshopify.com',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 'tenant-2',
                    storeName: 'Store 2',
                    storeUrl: 'https://store2.myshopify.com',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            (prisma.tenant.findMany as jest.Mock).mockResolvedValue(mockTenants);

            const response = await request(app)
                .get('/tenants')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].storeName).toBe('Store 1');
        });

        it('should return empty array if no tenants', async () => {
            (prisma.tenant.findMany as jest.Mock).mockResolvedValue([]);

            const response = await request(app)
                .get('/tenants')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it('should reject without authentication', async () => {
            const response = await request(app).get('/tenants');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /tenants/:id - Get Tenant', () => {
        it('should get specific tenant', async () => {
            const mockTenant = {
                id: 'tenant-1',
                storeName: 'Store 1',
                storeUrl: 'https://store1.myshopify.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);

            const response = await request(app)
                .get('/tenants/tenant-1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe('tenant-1');
        });

        it('should return 404 for non-existent tenant', async () => {
            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get('/tenants/non-existent')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Tenant not found');
        });
    });
});
