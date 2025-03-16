import NotificationSystem from './NotificationSystem.js';
import { authService } from '../services/authService.js';

class CommentSystem {
    constructor(options) {
        this.options = {
            container: null,          // Elemento que conterá os comentários
            itemId: null,             // ID do item (mangá, capítulo, etc)
            itemType: 'manga',        // Tipo do item
            maxLength: 1000,          // Tamanho máximo do comentário
            pageSize: 10,             // Comentários por página
            ...options
        };

        this.comments = [];
        this.currentPage = 1;
        this.totalComments = 0;
        this.replyingTo = null;

        this.init();
    }

    init() {
        this.render();
        this.loadComments();
        this.bindEvents();
    }

    render() {
        this.options.container.innerHTML = `
            <div class="comments-section">
                <h3 class="comments-title">
                    Comentários <span class="comments-count">(0)</span>
                </h3>
                
                <div class="comment-form-container">
                    ${this.renderCommentForm()}
                </div>

                <div class="comments-list"></div>

                <div class="comments-pagination">
                    <button class="load-more-btn" style="display: none;">
                        Carregar mais comentários
                    </button>
                </div>

                <div class="comments-loading" style="display: none;">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </div>
        `;

        // Guardar referências dos elementos
        this.elements = {
            list: this.options.container.querySelector('.comments-list'),
            form: this.options.container.querySelector('.comment-form'),
            loadMoreBtn: this.options.container.querySelector('.load-more-btn'),
            loading: this.options.container.querySelector('.comments-loading'),
            count: this.options.container.querySelector('.comments-count')
        };
    }

    renderCommentForm(parentId = null) {
        const isAuthenticated = authService.isAuthenticated();
        
        if (!isAuthenticated) {
            return `
                <div class="comment-login-prompt">
                    <p>Faça <a href="#" class="login-link">login</a> para comentar</p>
                </div>
            `;
        }

        return `
            <form class="comment-form" data-parent="${parentId || ''}">
                <div class="form-group">
                    <textarea 
                        name="content" 
                        placeholder="Escreva seu comentário..." 
                        maxlength="${this.options.maxLength}"
                    ></textarea>
                    <div class="char-counter">0/${this.options.maxLength}</div>
                </div>
                <div class="form-actions">
                    ${parentId ? `
                        <button type="button" class="cancel-reply-btn">Cancelar</button>
                    ` : ''}
                    <button type="submit" class="submit-comment-btn">
                        <i class="fas fa-paper-plane"></i> Enviar
                    </button>
                </div>
            </form>
        `;
    }

    renderComment(comment) {
        const user = authService.getCurrentUser();
        const isOwner = user && comment.userId === user.id;
        
        return `
            <div class="comment" data-id="${comment.id}">
                <div class="comment-avatar">
                    <img src="${comment.userAvatar || 'images/default-avatar.png'}" alt="Avatar">
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.userName}</span>
                        <span class="comment-date">
                            ${this.formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <div class="comment-text">${this.formatText(comment.content)}</div>
                    <div class="comment-actions">
                        <button class="reply-btn" data-id="${comment.id}">
                            <i class="fas fa-reply"></i> Responder
                        </button>
                        ${isOwner ? `
                            <button class="edit-btn" data-id="${comment.id}">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="delete-btn" data-id="${comment.id}">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        ` : ''}
                    </div>
                    ${comment.replies ? `
                        <div class="comment-replies">
                            ${comment.replies.map(reply => this.renderComment(reply)).join('')}
                        </div>
                    ` : ''}
                    <div class="reply-form-container"></div>
                </div>
            </div>
        `;
    }

    async loadComments(page = 1) {
        this.showLoading();
        
        try {
            const response = await fetch(`/api/comments?itemId=${this.options.itemId}&itemType=${this.options.itemType}&page=${page}`);
            const data = await response.json();

            if (data.success) {
                this.comments = page === 1 ? data.comments : [...this.comments, ...data.comments];
                this.totalComments = data.total;
                this.currentPage = page;

                this.updateCommentsList();
                this.updateLoadMoreButton();
                this.updateCommentsCount();
            }
        } catch (error) {
            NotificationSystem.error('Erro ao carregar comentários');
        } finally {
            this.hideLoading();
        }
    }

    async submitComment(content, parentId = null) {
        if (!authService.isAuthenticated()) {
            NotificationSystem.warning('Faça login para comentar');
            return;
        }

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({
                    itemId: this.options.itemId,
                    itemType: this.options.itemType,
                    content,
                    parentId
                })
            });

            const data = await response.json();

            if (data.success) {
                if (parentId) {
                    this.addReply(data.comment, parentId);
                } else {
                    this.addComment(data.comment);
                }
                NotificationSystem.success('Comentário enviado com sucesso');
            }
        } catch (error) {
            NotificationSystem.error('Erro ao enviar comentário');
        }
    }

    bindEvents() {
        // Form submission
        this.options.container.addEventListener('submit', (e) => {
            if (e.target.matches('.comment-form')) {
                e.preventDefault();
                const content = e.target.querySelector('textarea').value;
                const parentId = e.target.dataset.parent || null;
                this.submitComment(content, parentId);
                e.target.reset();
            }
        });

        // Reply button
        this.options.container.addEventListener('click', (e) => {
            if (e.target.matches('.reply-btn')) {
                const commentId = e.target.dataset.id;
                const comment = this.findComment(commentId);
                if (comment) {
                    this.showReplyForm(comment);
                }
            }
        });

        // Load more
        this.elements.loadMoreBtn.addEventListener('click', () => {
            this.loadComments(this.currentPage + 1);
        });

        // Character counter
        this.options.container.addEventListener('input', (e) => {
            if (e.target.matches('textarea')) {
                const counter = e.target.parentElement.querySelector('.char-counter');
                counter.textContent = `${e.target.value.length}/${this.options.maxLength}`;
            }
        });
    }

    // Métodos auxiliares
    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatText(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    }

    showLoading() {
        this.elements.loading.style.display = 'block';
    }

    hideLoading() {
        this.elements.loading.style.display = 'none';
    }

    updateCommentsCount() {
        this.elements.count.textContent = `(${this.totalComments})`;
    }

    updateLoadMoreButton() {
        const hasMore = this.totalComments > this.comments.length;
        this.elements.loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }

    findComment(id, comments = this.comments) {
        for (const comment of comments) {
            if (comment.id === id) return comment;
            if (comment.replies) {
                const found = this.findComment(id, comment.replies);
                if (found) return found;
            }
        }
        return null;
    }

    updateItem(newItemId) {
        this.options.itemId = newItemId;
        this.comments = [];
        this.currentPage = 1;
        this.totalComments = 0;
        this.loadComments();
    }
}

export default CommentSystem; 