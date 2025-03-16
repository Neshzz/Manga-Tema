import api from '../config/api.js';

class MangaReader {
    constructor() {
        if (!this) {
            throw new Error('MangaReader constructor needs to be called with "new" keyword');
        }

        this.currentPage = 1;
        this.totalPages = 0;
        this.chapterPages = [];

        try {
            this.initialize();
        } catch (error) {
            console.error('Erro ao inicializar leitor:', error);
            this.showError('Erro ao inicializar leitor');
        }
    }

    showError(errorMessage) {
        document.getElementById('error-message').textContent = errorMessage;
        document.getElementById('error-message').style.display = 'block';
    }

    async initialize() {
        const urlParams = new URLSearchParams(window.location.search);
        const chapterId = urlParams.get('id');

        if (chapterId) {
            await this.loadChapter(chapterId);
        }
    }

    async loadChapter(chapterId) {
        try {
            const response = await fetch(`http://localhost:3000/api/chapter/${chapterId}`);
            const data = await response.json();

            if (data.success) {
                this.chapterPages = data.chapter.pages;
                this.totalPages = this.chapterPages.length;
                this.updateUI();
                this.loadImages();
            }
        } catch (error) {
            console.error('Erro ao carregar capítulo:', error);
            this.showError('Erro ao carregar capítulo');
        }
    }

    updateUI() {
        document.getElementById('page-number').textContent = 
            `Página ${this.currentPage} de ${this.totalPages}`;
    }

    loadImages() {
        const container = document.getElementById('chapter-pages');
        container.innerHTML = '';

        this.chapterPages.forEach(page => {
            const img = document.createElement('img');
            img.src = page.image_path;
            img.alt = `Página ${page.number}`;
            img.loading = 'lazy';
            container.appendChild(img);
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Inicializar o leitor
new MangaReader();