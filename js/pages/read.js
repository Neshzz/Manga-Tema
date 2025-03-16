import CommentSystem from '../components/CommentSystem.js';

class ReadPage {
    constructor() {
        this.currentChapter = null;
        this.commentSystem = null;
        this.init();
    }

    async init() {
        await this.loadChapterData();
        this.initComments();
        this.bindEvents();
    }

    async loadChapterData() {
        // ... código existente de carregamento do capítulo ...
    }

    initComments() {
        const commentsContainer = document.getElementById('chapter-comments');
        if (commentsContainer && this.currentChapter) {
            this.commentSystem = new CommentSystem({
                container: commentsContainer,
                itemId: this.currentChapter.id,
                itemType: 'chapter',
                pageSize: 15
            });
        }
    }

    bindEvents() {
        // ... outros event listeners existentes ...

        // Toggle de comentários
        const toggleBtn = document.getElementById('toggle-comments');
        const commentsSection = document.getElementById('chapter-comments');

        toggleBtn?.addEventListener('click', () => {
            const isHidden = commentsSection.classList.contains('hidden');
            commentsSection.classList.toggle('hidden');
            toggleBtn.innerHTML = isHidden ? 
                '<i class="fas fa-times"></i> Ocultar Comentários' :
                '<i class="fas fa-comments"></i> Mostrar Comentários';

            if (!isHidden) {
                commentsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Atualizar comentários ao mudar de capítulo
        this.on('chapterChange', () => {
            if (this.commentSystem && this.currentChapter) {
                this.commentSystem.updateItem(this.currentChapter.id);
                commentsSection.classList.add('hidden');
                toggleBtn.innerHTML = '<i class="fas fa-comments"></i> Mostrar Comentários';
            }
        });
    }

    // ... resto do código existente ...
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new ReadPage();
}); 