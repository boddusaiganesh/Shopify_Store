import { Request, Response } from 'express';
import prisma from '../prisma';
import {AuthRequest} from '../middleware/auth';

export const createTenant = async (req: AuthRequest, res: Response) => {
    try {
        const {storeName, storeUrl, apiKey, apiSecret, accessToken} = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({error: 'User not authenticated'});
        }

        if (!storeName || !storeUrl || !accessToken) {
            return res.status(400).json({error: 'Store name, URL, and access token are required'});
        }

        const tenant = await prisma.tenant.create({
            data: {
                storeName,
                storeUrl,
                apiKey,
                apiSecret,
                accessToken,
                userId,
            },
        });
        res.json(tenant);
    } catch (error: any) {
        console.error('Create tenant error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({error: 'Store URL already exists'});
        }
        res.status(500).json({error: 'Failed to create tenant'});
    }
};

export const getTenants = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({error: 'User not authenticated'});
        }

        const tenants = await prisma.tenant.findMany({
            where: {userId},
            select: {
                id: true,
                storeName: true,
                storeUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(tenants);
    } catch (error) {
        console.error('Get tenants error:', error);
        res.status(500).json({error: 'Failed to fetch tenants'});
    }
};

export const getTenant = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({error: 'User not authenticated'});
        }

        const tenant = await prisma.tenant.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                id: true,
                storeName: true,
                storeUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!tenant) {
            return res.status(404).json({error: 'Tenant not found'});
        }

        res.json(tenant);
    } catch (error) {
        console.error('Get tenant error:', error);
        res.status(500).json({error: 'Failed to fetch tenant' });
    }
};
