// Set environment variables before any imports
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock Prisma Client completely
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            user: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
            },
            tenant: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findFirst: jest.fn(),
                findMany: jest.fn(),
            },
            product: {
                upsert: jest.fn(),
                findMany: jest.fn(),
            },
            customer: {
                upsert: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                count: jest.fn(),
            },
            order: {
                upsert: jest.fn(),
                findMany: jest.fn(),
                count: jest.fn(),
                aggregate: jest.fn(),
            },
            customEvent: {
                create: jest.fn(),
            },
            syncLog: {
                create: jest.fn(),
                update: jest.fn(),
            },
        })),
    };
});
