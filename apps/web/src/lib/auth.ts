const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token); // Store token after successful login
    return data;
};

export const register = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, name}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    setToken(data.token); // Store token after successful registration
    return data;
};

export const getMe = async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return response.json();
};

export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
};

export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};
