class ChapterManager {
    constructor() {
        this.currentChapter = null;
        this.initialize();
    }

    async initialize() {
        const urlParams = new URLSearchParams(window.location.search);
        const chapterId = urlParams.get('id');

        if (chapterId) {
            await this.loadChapter(chapterId);
        }
    }

    async loadChapter(id) {
        try {
            const response = await fetch(`/api/chapters/${id}`);
            this.currentChapter = await response.json();
            this.updateUI();
        } catch (error) {
            FeedbackManager.error('Erro ao carregar capítulo');
        }
    }

    updateUI() {
        if (!this.currentChapter) return;

        document.getElementById('chapter-title').textContent = 
            this.currentChapter.title;
        document.getElementById('chapter-number').textContent = 
            `Capítulo ${this.currentChapter.number}`;
        
        this.loadPages(this.currentChapter.pages);
    }

    loadPages(pages) {
        const container = document.getElementById('pages-container');
        if (!container) return;

        container.innerHTML = '';
        pages.forEach(page => {
            const img = document.createElement('img');
            img.src = page.url;
            img.alt = `Página ${page.number}`;
            img.loading = 'lazy';
            container.appendChild(img);
        });
    }
}