import cron from 'node-cron';
import axios from 'axios';
import prisma from '../prisma';

const getShopifyHeaders = (accessToken: string) => ({
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
});

const syncTenantData = async (tenantId: string) => {
    try {
        const tenant = await prisma.tenant.findUnique({where: {id: tenantId}});

        if (!tenant || !tenant.accessToken) {
            console.log(`Skipping tenant ${tenantId} - missing credentials`);
            return;
        }

        console.log(`Starting sync for tenant: ${tenant.storeName}`);

        // Create sync log
        const syncLog = await prisma.syncLog.create({
            data: {
                syncType: 'full',
                status: 'in_progress',
                tenantId: tenant.id,
            },
        });

        let totalItems = 0;
        let errorMessage = null;

        try {
            // Sync Products
            const productsResponse = await axios.get(
                `${tenant.storeUrl}/admin/api/2023-10/products.json`,
                {headers: getShopifyHeaders(tenant.accessToken)}
            );

            for (const p of productsResponse.data.products) {
                await prisma.product.upsert({
                    where: {shopifyId_tenantId: {shopifyId: p.id.toString(), tenantId: tenant.id}},
                    update: {title: p.title, bodyHtml: p.body_html, vendor: p.vendor, productType: p.product_type},
                    create: {
                        shopifyId: p.id.toString(),
                        title: p.title,
                        bodyHtml: p.body_html,
                        vendor: p.vendor,
                        productType: p.product_type,
                        tenantId: tenant.id,
                    },
                });
            }
            totalItems += productsResponse.data.products.length;

            // Sync Customers
            const customersResponse = await axios.get(
                `${tenant.storeUrl}/admin/api/2023-10/customers.json`,
                {headers: getShopifyHeaders(tenant.accessToken)}
            );

            for (const c of customersResponse.data.customers) {
                await prisma.customer.upsert({
                    where: {shopifyId_tenantId: {shopifyId: c.id.toString(), tenantId: tenant.id}},
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
                        tenantId: tenant.id,
                    },
                });
            }
            totalItems += customersResponse.data.customers.length;

            // Sync Orders
            const ordersResponse = await axios.get(
                `${tenant.storeUrl}/admin/api/2023-10/orders.json?status=any`,
                {headers: getShopifyHeaders(tenant.accessToken)}
            );

            for (const o of ordersResponse.data.orders) {
                let customerId = null;
                if (o.customer) {
                    const customer = await prisma.customer.findUnique({
                        where: {shopifyId_tenantId: {shopifyId: o.customer.id.toString(), tenantId: tenant.id}},
                    });
                    if (customer) customerId = customer.id;
                }

                await prisma.order.upsert({
                    where: {shopifyId_tenantId: {shopifyId: o.id.toString(), tenantId: tenant.id}},
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
                        tenantId: tenant.id,
                        customerId,
                    },
                });
            }
            totalItems += ordersResponse.data.orders.length;

            // Update sync log as successful
            await prisma.syncLog.update({
                where: {id: syncLog.id},
                data: {
                    status: 'success',
                    itemsCount: totalItems,
                    completedAt: new Date(),
                },
            });

            console.log(`✓ Sync completed for ${tenant.storeName}: ${totalItems} items`);
        } catch (error: any) {
            errorMessage = error.message || 'Unknown error';

            await prisma.syncLog.update({
                where: {id: syncLog.id},
                data: {
                    status: 'failed',
                    errorMessage,
                    completedAt: new Date(),
                },
            });

            console.error(`✗ Sync failed for ${tenant.storeName}:`, errorMessage);
        }
    } catch (error) {
        console.error(`Error syncing tenant ${tenantId}:`, error);
    }
};

export const startSyncScheduler = () => {
    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        console.log('Starting scheduled sync for all tenants...');

        try {
            const tenants = await prisma.tenant.findMany({
                where: {
                    accessToken: {
                        not: null,
                    },
                },
                select: {id: true},
            });

            console.log(`Found ${tenants.length} tenants to sync`);

            for (const tenant of tenants) {
                await syncTenantData(tenant.id);
                // Wait 5 seconds between tenants to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            console.log('Scheduled sync completed for all tenants');
        } catch (error) {
            console.error('Error in scheduled sync:', error);
        }
    });

    console.log('✓ Sync scheduler started (runs every 6 hours)');
};

// Manual sync function that can be called via API
export const syncTenantManually = async (tenantId: string) => {
    await syncTenantData(tenantId);
};
