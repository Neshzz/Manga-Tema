import { authService } from '../services/authService.js';

class AuthModals {
    constructor() {
        if (AuthModals.instance) {
            return AuthModals.instance;
        }
        AuthModals.instance = this;
        this.init();
    }

    async init() {
        await this.loadModalHTML();
        this.loginModal = document.getElementById('login-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.setupLoginModal();
        this.setupOAuthButtons();
    }

    async loadModalHTML() {
        try {
            const response = await fetch('/components/login-modal.html');
            const html = await response.text();
            
            const existingModal = document.getElementById('login-modal');
            if (existingModal) {
                existingModal.remove();
            }
            
            document.body.insertAdjacentHTML('beforeend', html);
            
            console.log('Modal carregado com sucesso');
        } catch (error) {
            console.error('Erro ao carregar modal:', error);
        }
    }

    setupLoginModal() {
        const closeModalButton = document.getElementById('close-modal');
        const loginForm = document.getElementById('login-form');

        closeModalButton?.addEventListener('click', () => {
            this.hideModal();
        });

        this.modalOverlay?.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.hideModal();
            }
        });

        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e.target);
        });
    }

    setupOAuthButtons() {
        const providers = ['google', 'discord'];
        providers.forEach(provider => {
            const button = document.getElementById(`${provider}-login`);
            button?.addEventListener('click', () => {
                authService.handleOAuth(provider);
            });
        });
    }

    async handleLogin(form) {
        try {
            const credentials = {
                email: form.querySelector('input[name="email"]').value,
                password: form.querySelector('input[name="password"]').value
            };

            const response = await authService.login(credentials);
            
            if (response.success) {
                this.hideModal();
                window.location.reload();
            } else {
                this.showError(response.message);
            }
        } catch (error) {
            this.showError('Erro ao fazer login');
        }
    }

    showModal() {
        this.loginModal.style.display = 'block';
        this.modalOverlay.style.display = 'block';
    }

    hideModal() {
        this.loginModal.style.display = 'none';
        this.modalOverlay.style.display = 'none';
    }

    showError(message) {
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    static getInstance() {
        if (!AuthModals.instance) {
            AuthModals.instance = new AuthModals();
        }
        return AuthModals.instance;
    }

    static openLoginModal() {
        const instance = AuthModals.getInstance();
        instance.showModal();
    }
}

export const authModals = AuthModals.getInstance();
export const openLoginModal = AuthModals.openLoginModal;

// Não precisamos mais desta inicialização pois usamos Singleton
// document.addEventListener('DOMContentLoaded', () => {
//     new AuthModals();
// }); 