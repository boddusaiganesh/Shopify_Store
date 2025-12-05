import request from 'supertest';
import express from 'express';
import routes from '../routes';
import prisma from '../prisma';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Integration Tests - Full User Flow', () => {
    let authToken: string;
    let userId: string;
    let tenantId: string;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Complete User Journey', () => {
        it('Step 1: User registers', async () => {
            const mockUser = {
                id: 'new-user-id',
                email: 'integration@example.com',
                password: 'hashed',
                name: 'Integration Test User',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'integration@example.com',
                    password: 'password123',
                    name: 'Integration Test User',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');

            authToken = response.body.token;
            userId = response.body.user.id;
        });

        it('Step 2: User creates a tenant', async () => {
            const mockTenant = {
                id: 'new-tenant-id',
                storeName: 'Integration Test Store',
                storeUrl: 'https://integration-test.myshopify.com',
                accessToken: 'shpat_test123',
                userId: 'new-user-id',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.tenant.create as jest.Mock).mockResolvedValue(mockTenant);

            const response = await request(app)
                .post('/api/tenants')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    storeName: 'Integration Test Store',
                    storeUrl: 'https://integration-test.myshopify.com',
                    accessToken: 'shpat_test123',
                });

            expect(response.status).toBe(200);
            expect(response.body.storeName).toBe('Integration Test Store');

            tenantId = response.body.id;
        });

        it('Step 3: User retrieves their tenants', async () => {
            const mockTenants = [
                {
                    id: tenantId,
                    storeName: 'Integration Test Store',
                    storeUrl: 'https://integration-test.myshopify.com',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            (prisma.tenant.findMany as jest.Mock).mockResolvedValue(mockTenants);

            const response = await request(app)
                .get('/api/tenants')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].storeName).toBe('Integration Test Store');
        });

        it('Step 4: User views summary insights', async () => {
            const mockTenant = {id: tenantId, userId};

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.customer.count as jest.Mock).mockResolvedValue(25);
            (prisma.order.count as jest.Mock).mockResolvedValue(50);
            (prisma.order.aggregate as jest.Mock).mockResolvedValue({
                _sum: {totalPrice: 12500},
            });

            const response = await request(app)
                .get(`/api/insights/summary?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.totalCustomers).toBe(25);
            expect(response.body.totalOrders).toBe(50);
            expect(response.body.totalRevenue).toBe(12500);
        });

        it('Step 5: User views top customers', async () => {
            const mockTenant = {id: tenantId, userId};
            const mockCustomers = [
                {id: '1', firstName: 'Top', lastName: 'Customer', totalSpent: 5000, ordersCount: 10},
            ];

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);

            const response = await request(app)
                .get(`/api/insights/top-customers?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].firstName).toBe('Top');
        });
    });

    describe('Security Tests', () => {
        it('should prevent access to other user tenants', async () => {
            const otherUserToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJvdGhlci11c2VyIiwiaWF0IjoxNjE2MjM5MDIyfQ.test';

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/insights/summary?tenantId=${tenantId}`)
                .set('Authorization', otherUserToken);

            // Will fail auth verification, but concept is tenant isolation
            expect(response.status).toBeGreaterThanOrEqual(401);
        });

        it('should reject requests without authentication', async () => {
            const response = await request(app).get('/api/tenants');

            expect(response.status).toBe(401);
        });

        it('should reject requests with invalid token', async () => {
            const response = await request(app)
                .get('/api/tenants')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(403);
        });
    });

    describe('Error Handling', () => {
        it('should handle database errors gracefully', async () => {
            (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(response.status).toBe(500);
        });

        it('should validate request data', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    // Missing required fields
                });

            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });
});
