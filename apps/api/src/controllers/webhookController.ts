import {Request, Response} from 'express';
import prisma from '../prisma';

// Webhook handlers for Shopify events
export const handleOrderCreated = async (req: Request, res: Response) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'] as string;
        const orderData = req.body;

        // Find tenant by store URL
        const tenant = await prisma.tenant.findFirst({
            where: {
                storeUrl: {
                    contains: shopDomain,
                },
            },
        });

        if (!tenant) {
            console.error('Tenant not found for shop:', shopDomain);
            return res.status(404).json({error: 'Tenant not found'});
        }

        // Check if customer exists
        let customerId = null;
        if (orderData.customer) {
            const customer = await prisma.customer.findUnique({
                where: {
                    shopifyId_tenantId: {
                        shopifyId: orderData.customer.id.toString(),
                        tenantId: tenant.id,
                    },
                },
            });
            if (customer) customerId = customer.id;
        }

        // Create or update order
        await prisma.order.upsert({
            where: {
                shopifyId_tenantId: {
                    shopifyId: orderData.id.toString(),
                    tenantId: tenant.id,
                },
            },
            update: {
                orderNumber: orderData.order_number,
                totalPrice: orderData.total_price,
                currency: orderData.currency,
                processedAt: orderData.processed_at ? new Date(orderData.processed_at) : null,
                customerId,
            },
            create: {
                shopifyId: orderData.id.toString(),
                orderNumber: orderData.order_number,
                totalPrice: orderData.total_price,
                currency: orderData.currency,
                processedAt: orderData.processed_at ? new Date(orderData.processed_at) : null,
                tenantId: tenant.id,
                customerId,
            },
        });

        res.status(200).json({success: true});
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({error: 'Failed to process webhook'});
    }
};

export const handleCustomerCreated = async (req: Request, res: Response) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'] as string;
        const customerData = req.body;

        const tenant = await prisma.tenant.findFirst({
            where: {
                storeUrl: {
                    contains: shopDomain,
                },
            },
        });

        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }

        await prisma.customer.upsert({
            where: {
                shopifyId_tenantId: {
                    shopifyId: customerData.id.toString(),
                    tenantId: tenant.id,
                },
            },
            update: {
                firstName: customerData.first_name,
                lastName: customerData.last_name,
                email: customerData.email,
                phone: customerData.phone,
                totalSpent: customerData.total_spent,
                ordersCount: customerData.orders_count,
            },
            create: {
                shopifyId: customerData.id.toString(),
                firstName: customerData.first_name,
                lastName: customerData.last_name,
                email: customerData.email,
                phone: customerData.phone,
                totalSpent: customerData.total_spent,
                ordersCount: customerData.orders_count,
                tenantId: tenant.id,
            },
        });

        res.status(200).json({success: true});
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({error: 'Failed to process webhook'});
    }
};

export const handleCartAbandoned = async (req: Request, res: Response) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'] as string;
        const cartData = req.body;

        const tenant = await prisma.tenant.findFirst({
            where: {
                storeUrl: {
                    contains: shopDomain,
                },
            },
        });

        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }

        // Store cart abandoned event
        await prisma.customEvent.create({
            data: {
                eventType: 'cart_abandoned',
                eventData: cartData,
                customerId: cartData.customer?.id?.toString(),
                customerEmail: cartData.email || cartData.customer?.email,
                shopifyId: cartData.id?.toString(),
                tenantId: tenant.id,
            },
        });

        res.status(200).json({success: true});
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({error: 'Failed to process webhook'});
    }
};

export const handleCheckoutStarted = async (req: Request, res: Response) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'] as string;
        const checkoutData = req.body;

        const tenant = await prisma.tenant.findFirst({
            where: {
                storeUrl: {
                    contains: shopDomain,
                },
            },
        });

        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }

        await prisma.customEvent.create({
            data: {
                eventType: 'checkout_started',
                eventData: checkoutData,
                customerId: checkoutData.customer?.id?.toString(),
                customerEmail: checkoutData.email || checkoutData.customer?.email,
                shopifyId: checkoutData.id?.toString(),
                tenantId: tenant.id,
            },
        });

        res.status(200).json({success: true});
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({error: 'Failed to process webhook'});
    }
};
