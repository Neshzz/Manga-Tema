import FavoriteManager from '../services/FavoriteManager.js';
import NotificationSystem from '../components/NotificationSystem.js';

class FavoritesPage {
    static init() {
        this.bindTabs();
        this.loadFavorites();
        this.loadHistory();
        this.bindClearHistory();
    }

    static bindTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const contents = document.querySelectorAll('.tab-content');
                contents.forEach(c => c.classList.remove('active'));
                document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
            });
        });
    }

    static loadFavorites() {
        const favorites = FavoriteManager.getFavorites();
        const grid = document.getElementById('favorites-grid');
        
        if (favorites.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <p>Você ainda não tem favoritos</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = favorites.map(manga => `
            <div class="manga-card" data-id="${manga.id}">
                <img src="${manga.cover}" alt="${manga.title}" class="manga-cover">
                <button class="remove-favorite" onclick="removeFavorite(${manga.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="manga-info">
                    <h3 class="manga-title">${manga.title}</h3>
                    <div class="manga-meta">
                        Adicionado em: ${new Date(manga.addedAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        `).join('');
    }

    static loadHistory() {
        const history = FavoriteManager.getHistory();
        const list = document.getElementById('history-list');

        if (history.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>Seu histórico está vazio</p>
                </div>
            `;
            return;
        }

        list.innerHTML = history.map(item => `
            <div class="history-item">
                <img src="${item.mangaCover}" alt="${item.mangaTitle}" class="history-cover">
                <div class="history-info">
                    <h3 class="history-title">${item.mangaTitle}</h3>
                    <div class="history-chapter">
                        Capítulo ${item.lastChapter}: ${item.lastChapterTitle}
                    </div>
                    <div class="history-progress">
                        <div class="progress-bar" style="width: ${item.progress}%"></div>
                    </div>
                    <div class="history-date">
                        Última leitura: ${new Date(item.lastRead).toLocaleString()}
                    </div>
                </div>
            </div>
        `).join('');
    }

    static bindClearHistory() {
        document.getElementById('clear-history')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja limpar seu histórico de leitura?')) {
                FavoriteManager.clearHistory();
                this.loadHistory();
            }
        });
    }

    static removeFavorite(mangaId) {
        FavoriteManager.removeFromFavorites(mangaId);
        this.loadFavorites();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    NotificationSystem.init();
    FavoritesPage.init();
});

// Expor função para o onclick
window.removeFavorite = FavoritesPage.removeFavorite.bind(FavoritesPage); 