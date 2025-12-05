import { Request, Response } from 'express';
import prisma from '../prisma';
import {AuthRequest} from '../middleware/auth';

const verifyTenantOwnership = async (tenantId: string, userId: string) => {
    const tenant = await prisma.tenant.findFirst({
        where: {id: tenantId, userId},
    });
    return tenant;
};

export const getSummary = async (req: AuthRequest, res: Response) => {
    const {tenantId} = req.query;
    const userId = req.userId;

    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({error: 'Tenant ID required'});
    }

    if (!userId) {
        return res.status(401).json({error: 'User not authenticated'});
    }

    try {
        const tenant = await verifyTenantOwnership(tenantId, userId);
        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }
        const totalCustomers = await prisma.customer.count({ where: { tenantId } });
        const totalOrders = await prisma.order.count({ where: { tenantId } });
        const revenueResult = await prisma.order.aggregate({
            where: { tenantId },
            _sum: { totalPrice: true },
        });

        res.json({
            totalCustomers,
            totalOrders,
            totalRevenue: revenueResult._sum.totalPrice || 0,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
};

export const getTopCustomers = async (req: AuthRequest, res: Response) => {
    const {tenantId} = req.query;
    const userId = req.userId;

    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({error: 'Tenant ID required'});
    }

    if (!userId) {
        return res.status(401).json({error: 'User not authenticated'});
    }

    try {
        const tenant = await verifyTenantOwnership(tenantId, userId);
        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }
        
        // Get customers with their orders
        const customers = await prisma.customer.findMany({
            where: { tenantId },
            include: {
                orders: {
                    select: {
                        totalPrice: true
                    }
                }
            },
        });
        
        // Calculate actual spend from orders in database
        const customersWithSpend = customers.map(customer => {
            const actualSpent = (customer.orders || []).reduce((sum, order) => 
                sum + (Number(order.totalPrice) || 0), 0
            );
            const actualOrdersCount = (customer.orders || []).length;
            
            return {
                id: customer.id,
                shopifyId: customer.shopifyId,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                ordersCount: actualOrdersCount,
                totalSpent: actualSpent,
            };
        });
        
        // Sort by actual spend and take top 5
        customersWithSpend.sort((a, b) => b.totalSpent - a.totalSpent);
        const topCustomers = customersWithSpend.slice(0, 5);
        
        res.json(topCustomers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch top customers' });
    }
};

export const getOrdersTrend = async (req: AuthRequest, res: Response) => {
    const {tenantId, startDate, endDate} = req.query;
    const userId = req.userId;

    if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({error: 'Tenant ID required'});
    }

    if (!userId) {
        return res.status(401).json({error: 'User not authenticated'});
    }

    try {
        const tenant = await verifyTenantOwnership(tenantId, userId);
        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }

        // Date range filtering
        const start = startDate && typeof startDate === 'string'
            ? new Date(startDate)
            : new Date(new Date().setDate(new Date().getDate() - 30));

        const end = endDate && typeof endDate === 'string'
            ? new Date(endDate)
            : new Date();
        const orders = await prisma.order.findMany({
            where: {
                tenantId,
                OR: [
                    {
                        processedAt: {
                            gte: start,
                            lte: end,
                        },
                    },
                    {
                        processedAt: null,
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                    },
                ],
            },
            select: { createdAt: true, processedAt: true, totalPrice: true },
        });

        const trend: Record<string, number> = {};
        orders.forEach((o: { createdAt: Date; processedAt: Date | null }) => {
            const dateToUse = o.processedAt || o.createdAt;
            const date = dateToUse.toISOString().split('T')[0];
            trend[date] = (trend[date] || 0) + 1;
        });

        const chartData = Object.entries(trend).map(([date, count]) => ({ date, count }));
        chartData.sort((a, b) => a.date.localeCompare(b.date));

        res.json(chartData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders trend' });
    }
};
