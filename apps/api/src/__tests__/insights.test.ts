import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import * as insightsController from '../controllers/insightsController';
import {authenticateToken} from '../middleware/auth';
import prisma from '../prisma';

const app = express();
app.use(express.json());
app.get('/insights/summary', authenticateToken, insightsController.getSummary);
app.get('/insights/top-customers', authenticateToken, insightsController.getTopCustomers);
app.get('/insights/orders-trend', authenticateToken, insightsController.getOrdersTrend);

const generateToken = (userId: string) => {
    return jwt.sign({userId}, process.env.JWT_SECRET || 'test-secret', {expiresIn: '7d'});
};

describe('Insights Tests', () => {
    const userId = 'test-user-id';
    const tenantId = 'test-tenant-id';
    let token: string;

    beforeEach(() => {
        jest.clearAllMocks();
        token = generateToken(userId);
    });

    describe('GET /insights/summary', () => {
        it('should return summary statistics', async () => {
            const mockTenant = {id: tenantId, userId};

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.customer.count as jest.Mock).mockResolvedValue(150);
            (prisma.order.count as jest.Mock).mockResolvedValue(320);
            (prisma.order.aggregate as jest.Mock).mockResolvedValue({
                _sum: {totalPrice: 45000.50},
            });

            const response = await request(app)
                .get(`/insights/summary?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.totalCustomers).toBe(150);
            expect(response.body.totalOrders).toBe(320);
            expect(response.body.totalRevenue).toBe(45000.50);
        });

        it('should reject without tenant ID', async () => {
            const response = await request(app)
                .get('/insights/summary')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Tenant ID required');
        });

        it('should reject for non-existent tenant', async () => {
            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get(`/insights/summary?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Tenant not found');
        });

        it('should handle zero revenue', async () => {
            const mockTenant = {id: tenantId, userId};

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.customer.count as jest.Mock).mockResolvedValue(0);
            (prisma.order.count as jest.Mock).mockResolvedValue(0);
            (prisma.order.aggregate as jest.Mock).mockResolvedValue({
                _sum: {totalPrice: null},
            });

            const response = await request(app)
                .get(`/insights/summary?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.totalRevenue).toBe(0);
        });
    });

    describe('GET /insights/top-customers', () => {
        it('should return top 5 customers by spend', async () => {
            const mockTenant = {id: tenantId, userId};
            const mockCustomers = [
                {id: '1', firstName: 'John', lastName: 'Doe', totalSpent: 5000, ordersCount: 10},
                {id: '2', firstName: 'Jane', lastName: 'Smith', totalSpent: 4500, ordersCount: 8},
                {id: '3', firstName: 'Bob', lastName: 'Johnson', totalSpent: 4000, ordersCount: 7},
                {id: '4', firstName: 'Alice', lastName: 'Williams', totalSpent: 3500, ordersCount: 6},
                {id: '5', firstName: 'Charlie', lastName: 'Brown', totalSpent: 3000, ordersCount: 5},
            ];

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);

            const response = await request(app)
                .get(`/insights/top-customers?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(5);
            expect(response.body[0].firstName).toBe('John');
            expect(response.body[0].totalSpent).toBe(5000);
        });

        it('should return empty array if no customers', async () => {
            const mockTenant = {id: tenantId, userId};

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.customer.findMany as jest.Mock).mockResolvedValue([]);

            const response = await request(app)
                .get(`/insights/top-customers?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });
    });

    describe('GET /insights/orders-trend', () => {
        it('should return orders trend with date filtering', async () => {
            const mockTenant = {id: tenantId, userId};
            const mockOrders = [
                {createdAt: new Date('2024-01-01'), totalPrice: 100},
                {createdAt: new Date('2024-01-01'), totalPrice: 150},
                {createdAt: new Date('2024-01-02'), totalPrice: 200},
                {createdAt: new Date('2024-01-03'), totalPrice: 250},
            ];

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

            const response = await request(app)
                .get(`/insights/orders-trend?tenantId=${tenantId}&startDate=2024-01-01&endDate=2024-01-31`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should use default date range if not provided', async () => {
            const mockTenant = {id: tenantId, userId};

            (prisma.tenant.findFirst as jest.Mock).mockResolvedValue(mockTenant);
            (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

            const response = await request(app)
                .get(`/insights/orders-trend?tenantId=${tenantId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(prisma.order.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        createdAt: expect.objectContaining({
                            gte: expect.any(Date),
                            lte: expect.any(Date),
                        }),
                    }),
                })
            );
        });
    });
});
