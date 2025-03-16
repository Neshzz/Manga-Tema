import authService from '../services/authService.js';

const authMiddleware = {
    // Verificar se usuário está logado
    requireAuth(redirectUrl = '/login.html') {
        if (!authService.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Verificar se usuário é admin
    requireAdmin(redirectUrl = '/') {
        const user = authService.getCurrentUser();
        if (!user || user.role !== 'admin') {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Adicionar headers de autenticação
    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${authService.getToken()}`
        };
    }
};

export default authMiddleware; 