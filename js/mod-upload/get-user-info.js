class UserManager {
    constructor() {
        this.currentUser = null;
        this.initialize();
    }

    async initialize() {
        await this.loadUserInfo();
        this.setupProfileForm();
    }

    async loadUserInfo() {
        try {
            const response = await fetch('/api/user/profile');
            this.currentUser = await response.json();
            this.updateUI();
        } catch (error) {
            FeedbackManager.error('Erro ao carregar informações do usuário');
        }
    }

    updateUI() {
        if (!this.currentUser) return;

        const fields = ['username', 'email', 'bio'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = this.currentUser[field];
            }
        });

        // Update avatar if exists
        const avatar = document.getElementById('user-avatar');
        if (avatar && this.currentUser.avatar) {
            avatar.src = this.currentUser.avatar;
        }
    }

    setupProfileForm() {
        const form = document.getElementById('profile-form');
        form?.addEventListener('submit', this.handleProfileUpdate.bind(this));
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        const form = e.target;
        
        try {
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                body: new FormData(form)
            });

            if (response.ok) {
                FeedbackManager.success('Perfil atualizado com sucesso!');
                await this.loadUserInfo();
            }
        } catch (error) {
            FeedbackManager.error('Erro ao atualizar perfil');
        }
    }
}