class NotificationSystem {
    static notifications = [];
    static container = null;

    static init() {
        // Criar container de notificações se não existir
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            document.body.appendChild(this.container);
        }
    }

    static show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-progress"></div>
        `;

        // Adicionar ao container
        this.container.appendChild(notification);

        // Adicionar classe para animar entrada
        setTimeout(() => notification.classList.add('show'), 10);

        // Configurar botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.close(notification));

        // Auto-fechar após duração
        if (duration > 0) {
            setTimeout(() => this.close(notification), duration);
        }

        // Adicionar à lista
        this.notifications.push(notification);

        // Limitar número de notificações visíveis
        if (this.notifications.length > 5) {
            this.close(this.notifications[0]);
        }

        return notification;
    }

    static close(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            notification.remove();
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    static getIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': default: return 'fa-info-circle';
        }
    }

    // Métodos de conveniência
    static success(message, duration) {
        return this.show(message, 'success', duration);
    }

    static error(message, duration) {
        return this.show(message, 'error', duration);
    }

    static warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    static info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

export default NotificationSystem; 