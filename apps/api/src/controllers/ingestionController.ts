import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../prisma';
import {AuthRequest} from '../middleware/auth';

const getShopifyHeaders = (accessToken: string) => ({
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
});

const verifyTenantOwnership = async (tenantId: string, userId: string) => {
    const tenant = await prisma.tenant.findFirst({
        where: {id: tenantId, userId},
    });
    return tenant;
};

export const ingestProducts = async (req: AuthRequest, res: Response) => {
    const {tenantId} = req.body;
    const userId = req.userId;

    try {
        if (!userId) {
            return res.status(401).json({error: 'User not authenticated'});
        }

        const tenant = await verifyTenantOwnership(tenantId, userId);
        if (!tenant || !tenant.accessToken) {
            return res.status(404).json({error: 'Tenant not found or missing access token'});
        }

        const response = await axios.get(`${tenant.storeUrl}/admin/api/2023-10/products.json`, {
            headers: getShopifyHeaders(tenant.accessToken),
        });

        const products = response.data.products;
        for (const p of products) {
            await prisma.product.upsert({
                where: { shopifyId_tenantId: { shopifyId: p.id.toString(), tenantId } },
                update: { title: p.title, bodyHtml: p.body_html, vendor: p.vendor, productType: p.product_type },
                create: {
                    shopifyId: p.id.toString(),
                    title: p.title,
                    bodyHtml: p.body_html,
                    vendor: p.vendor,
                    productType: p.product_type,
                    tenantId,
                },
            });
        }
        res.json({ message: `Ingested ${products.length} products` });
    } catch (error) {
        console.error('Error ingesting products:', error);
        res.status(500).json({ error: 'Failed to ingest products' });
    }
};

export const ingestCustomers = async (req: AuthRequest, res: Response) => {
    const {tenantId} = req.body;
    const userId = req.userId;

    try {
        if (!userId) {
            return res.status(401).json({error: 'User not authenticated'});
        }

        const tenant = await verifyTenantOwnership(tenantId, userId);
        if (!tenant || !tenant.accessToken) {
            return res.status(404).json({error: 'Tenant not found or missing access token'});
        }

        const response = await axios.get(`${tenant.storeUrl}/admin/api/2023-10/customers.json`, {
            headers: getShopifyHeaders(tenant.accessToken),
        });

        const customers = response.data.customers;
        for (const c of customers) {
            await prisma.customer.upsert({
                where: { shopifyId_tenantId: { shopifyId: c.id.toString(), tenantId } },
                update: {
                    firstName: c.first_name,
                    lastName: c.last_name,
                    email: c.email,
                    phone: c.phone,
                    totalSpent: c.total_spent,
                    ordersCount: c.orders_count,
                },
                create: {
                    shopifyId: c.id.toString(),
                    firstName: c.first_name,
                    lastName: c.last_name,
                    email: c.email,
                    phone: c.phone,
                    totalSpent: c.total_spent,
                    ordersCount: c.orders_count,
                    tenantId,
                },
            });
        }
        res.json({ message: `Ingested ${customers.length} customers` });
    } catch (error) {
        console.error('Error ingesting customers:', error);
        res.status(500).json({ error: 'Failed to ingest customers' });
    }
};

export const ingestOrders = async (req: AuthRequest, res: Response) => {
    const {tenantId} = req.body;
    const userId = req.userId;

    try {
        if (!userId) {
            return res.status(401).json({error: 'User not authenticated'});
        }

        const tenant = await verifyTenantOwnership(tenantId, userId);
        if (!tenant || !tenant.accessToken) {
            return res.status(404).json({error: 'Tenant not found or missing access token'});
        }

        const response = await axios.get(`${tenant.storeUrl}/admin/api/2023-10/orders.json?status=any`, {
            headers: getShopifyHeaders(tenant.accessToken),
        });

        const orders = response.data.orders;
        for (const o of orders) {
            // Find customer if exists
            let customerId = null;
            if (o.customer) {
                const customer = await prisma.customer.findUnique({
                    where: { shopifyId_tenantId: { shopifyId: o.customer.id.toString(), tenantId } },
                });
                if (customer) customerId = customer.id;
            }

            await prisma.order.upsert({
                where: { shopifyId_tenantId: { shopifyId: o.id.toString(), tenantId } },
                update: {
                    orderNumber: o.order_number,
                    totalPrice: o.total_price,
                    currency: o.currency,
                    processedAt: o.processed_at ? new Date(o.processed_at) : null,
                    customerId,
                },
                create: {
                    shopifyId: o.id.toString(),
                    orderNumber: o.order_number,
                    totalPrice: o.total_price,
                    currency: o.currency,
                    processedAt: o.processed_at ? new Date(o.processed_at) : null,
                    tenantId,
                    customerId,
                },
            });
        }
        res.json({ message: `Ingested ${orders.length} orders` });
    } catch (error) {
        console.error('Error ingesting orders:', error);
        res.status(500).json({ error: 'Failed to ingest orders' });
    }
};
