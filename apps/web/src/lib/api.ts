import {getToken} from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && {'Authorization': `Bearer ${token}`}),
    };
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({error: 'Request failed'}));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
};

export const getTenants = () => apiRequest('/tenants');

export const createTenant = (data: {
    storeName: string;
    storeUrl: string;
    accessToken: string;
    apiKey?: string;
    apiSecret?: string;
}) => apiRequest('/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
});

export const getSummary = (tenantId: string) =>
    apiRequest(`/insights/summary?tenantId=${tenantId}`);

export const getTopCustomers = (tenantId: string) =>
    apiRequest(`/insights/top-customers?tenantId=${tenantId}`);

export const getOrdersTrend = (tenantId: string, startDate?: string, endDate?: string) => {
    let url = `/insights/orders-trend?tenantId=${tenantId}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return apiRequest(url);
};

export const ingestData = (tenantId: string, type: 'products' | 'customers' | 'orders') =>
    apiRequest(`/ingest/${type}`, {
        method: 'POST',
        body: JSON.stringify({tenantId}),
    });

export const syncTenant = (tenantId: string) =>
    apiRequest(`/sync/${tenantId}`, {
        method: 'POST',
    });
