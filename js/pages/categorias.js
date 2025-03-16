import InfiniteScroll from '../components/InfiniteScroll.js';
import NotificationSystem from '../components/NotificationSystem.js';

class CategoriasPage {
    constructor() {
        this.mangaGrid = document.getElementById('manga-list');
        this.currentCategory = null;
        this.infiniteScroll = null;
        
        this.init();
    }

    init() {
        this.setupInfiniteScroll();
        this.loadCategories();
        this.bindEvents();
    }

    setupInfiniteScroll() {
        this.infiniteScroll = new InfiniteScroll({
            container: this.mangaGrid,
            pageSize: 24,
            onLoadMore: async (page) => {
                if (!this.currentCategory) return [];
                
                try {
                    const response = await fetch(`/api/manga?category=${this.currentCategory}&page=${page}`);
                    const data = await response.json();
                    
                    if (data.success) {
                        this.renderMangaItems(data.items);
                        return data.items;
                    }
                    return [];
                } catch (error) {
                    NotificationSystem.error('Erro ao carregar mais mangás');
                    return [];
                }
            }
        });
    }

    renderMangaItems(items) {
        const html = items.map(manga => `
            <div class="manga-card" data-id="${manga.id}">
                <img src="${manga.cover}" alt="${manga.title}" loading="lazy">
                <div class="manga-info">
                    <h3>${manga.title}</h3>
                    <p>${manga.description}</p>
                </div>
            </div>
        `).join('');

        this.mangaGrid.insertAdjacentHTML('beforeend', html);
    }

    // ... resto do código existente
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new CategoriasPage();
});