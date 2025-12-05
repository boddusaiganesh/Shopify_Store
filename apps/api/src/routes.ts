import { Router } from 'express';
import * as authController from './controllers/authController';
import * as tenantController from './controllers/tenantController';
import * as ingestionController from './controllers/ingestionController';
import * as insightsController from './controllers/insightsController';
import * as webhookController from './controllers/webhookController';
import {authenticateToken} from './middleware/auth';
import {syncTenantManually} from './services/syncScheduler';
import prisma from './prisma';

const router = Router();

// Auth Routes (Public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);

// Tenant Routes (Protected)
router.post('/tenants', authenticateToken, tenantController.createTenant);
router.get('/tenants', authenticateToken, tenantController.getTenants);
router.get('/tenants/:id', authenticateToken, tenantController.getTenant);

// Ingestion Routes (Protected)
router.post('/ingest/products', authenticateToken, ingestionController.ingestProducts);
router.post('/ingest/orders', authenticateToken, ingestionController.ingestOrders);
router.post('/ingest/customers', authenticateToken, ingestionController.ingestCustomers);

// Manual sync endpoint
router.post('/sync/:tenantId', authenticateToken, async (req, res) => {
    try {
        const {tenantId} = req.params;
        const userId = (req as any).userId;

        // Verify ownership
        const tenant = await prisma.tenant.findFirst({
            where: {id: tenantId, userId},
        });

        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }

        // Trigger manual sync
        syncTenantManually(tenantId).catch(err => console.error('Sync error:', err));

        res.json({message: 'Sync started'});
    } catch (error) {
        res.status(500).json({error: 'Failed to start sync'});
    }
});

// Insights Routes (Protected)
router.get('/insights/summary', authenticateToken, insightsController.getSummary);
router.get('/insights/top-customers', authenticateToken, insightsController.getTopCustomers);
router.get('/insights/orders-trend', authenticateToken, insightsController.getOrdersTrend);

// Webhook Routes (Public - Shopify webhooks)
router.post('/webhooks/orders/create', webhookController.handleOrderCreated);
router.post('/webhooks/customers/create', webhookController.handleCustomerCreated);
router.post('/webhooks/carts/abandoned', webhookController.handleCartAbandoned);
router.post('/webhooks/checkouts/create', webhookController.handleCheckoutStarted);

export default router;
