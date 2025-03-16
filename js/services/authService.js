const API_URL = 'http://localhost:5000/api';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    getCurrentUser() {
        return this.user;
    }

    async login(credentials) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            
            if (data.success) {
                this.token = data.data.token;
                this.user = data.data.user;
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
            }
            return data;
        } catch (error) {
            throw new Error('Erro ao fazer login');
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            throw new Error('Erro ao fazer registro');
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    async handleOAuth(provider) {
        try {
            const response = await fetch(`${API_URL}/auth/${provider}`);
            const data = await response.json();
            if (data.success) {
                window.location.href = data.authUrl;
            }
            return data;
        } catch (error) {
            throw new Error(`Erro na autenticação com ${provider}`);
        }
    }
}

export const authService = new AuthService();

export const checkAuth = () => {
    // Lógica de autenticação
    return !!localStorage.getItem('authToken');
};

export const login = (token) => {
    localStorage.setItem('authToken', token);
};

export const logout = () => {
    localStorage.removeItem('authToken');
};

// Ou para exportação padrão:
/*
const authService = {
    checkAuth: () => Boolean(localStorage.getItem('userToken'))
};
export default authService;
*/ 