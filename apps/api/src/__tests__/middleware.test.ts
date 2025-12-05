import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {authenticateToken, generateToken} from '../middleware/auth';

describe('Middleware Tests', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
    });

    describe('authenticateToken', () => {
        it('should authenticate valid token', () => {
            const userId = 'test-user-id';
            const token = generateToken(userId);

            mockRequest.headers = {
                authorization: `Bearer ${token}`,
            };

            authenticateToken(mockRequest as any, mockResponse as Response, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect((mockRequest as any).userId).toBe(userId);
        });

        it('should reject request without token', () => {
            authenticateToken(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({error: 'Access token required'});
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should reject invalid token', () => {
            mockRequest.headers = {
                authorization: 'Bearer invalid-token',
            };

            authenticateToken(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({error: 'Invalid or expired token'});
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should reject expired token', () => {
            const userId = 'test-user-id';
            const expiredToken = jwt.sign(
                {userId},
                process.env.JWT_SECRET || 'test-secret',
                {expiresIn: '-1s'}
            );

            mockRequest.headers = {
                authorization: `Bearer ${expiredToken}`,
            };

            authenticateToken(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should reject malformed authorization header', () => {
            mockRequest.headers = {
                authorization: 'InvalidFormat',
            };

            authenticateToken(mockRequest as any, mockResponse as Response, nextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });

    describe('generateToken', () => {
        it('should generate valid JWT token', () => {
            const userId = 'test-user-id';
            const token = generateToken(userId);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as any;
            expect(decoded.userId).toBe(userId);
        });

        it('should generate different tokens for different users', () => {
            const token1 = generateToken('user-1');
            const token2 = generateToken('user-2');

            expect(token1).not.toBe(token2);

            const decoded1 = jwt.verify(token1, process.env.JWT_SECRET || 'test-secret') as any;
            const decoded2 = jwt.verify(token2, process.env.JWT_SECRET || 'test-secret') as any;

            expect(decoded1.userId).toBe('user-1');
            expect(decoded2.userId).toBe('user-2');
        });

        it('should generate token with 7 day expiration', () => {
            const userId = 'test-user-id';
            const token = generateToken(userId);

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as any;

            const now = Math.floor(Date.now() / 1000);
            const sevenDaysInSeconds = 7 * 24 * 60 * 60;

            expect(decoded.exp).toBeGreaterThan(now);
            expect(decoded.exp).toBeLessThanOrEqual(now + sevenDaysInSeconds + 10); // Allow 10 second buffer
        });
    });
});
