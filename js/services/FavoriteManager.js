class FavoriteManager {
    static KEY_FAVORITES = 'manga_favorites';
    static KEY_HISTORY = 'manga_history';
    
    static init() {
        if (!localStorage.getItem(this.KEY_FAVORITES)) {
            localStorage.setItem(this.KEY_FAVORITES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEY_HISTORY)) {
            localStorage.setItem(this.KEY_HISTORY, JSON.stringify([]));
        }
    }

    // Métodos para Favoritos
    static getFavorites() {
        return JSON.parse(localStorage.getItem(this.KEY_FAVORITES) || '[]');
    }

    static addToFavorites(manga) {
        const favorites = this.getFavorites();
        if (!favorites.some(fav => fav.id === manga.id)) {
            favorites.push({
                id: manga.id,
                title: manga.title,
                cover: manga.cover,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem(this.KEY_FAVORITES, JSON.stringify(favorites));
            NotificationSystem.success('Manga adicionado aos favoritos!');
            return true;
        }
        return false;
    }

    static removeFromFavorites(mangaId) {
        const favorites = this.getFavorites();
        const newFavorites = favorites.filter(fav => fav.id !== mangaId);
        localStorage.setItem(this.KEY_FAVORITES, JSON.stringify(newFavorites));
        NotificationSystem.info('Manga removido dos favoritos');
    }

    static isFavorite(mangaId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === mangaId);
    }

    // Métodos para Histórico de Leitura
    static getHistory() {
        return JSON.parse(localStorage.getItem(this.KEY_HISTORY) || '[]');
    }

    static addToHistory(manga, chapter) {
        const history = this.getHistory();
        const existingEntry = history.find(h => h.mangaId === manga.id);
        
        const historyEntry = {
            mangaId: manga.id,
            mangaTitle: manga.title,
            mangaCover: manga.cover,
            lastChapter: chapter.number,
            lastChapterTitle: chapter.title,
            progress: chapter.progress || 0,
            lastRead: new Date().toISOString()
        };

        if (existingEntry) {
            Object.assign(existingEntry, historyEntry);
        } else {
            history.unshift(historyEntry); // Adiciona no início
        }

        // Manter apenas os últimos 50 itens
        if (history.length > 50) {
            history.pop();
        }

        localStorage.setItem(this.KEY_HISTORY, JSON.stringify(history));
    }

    static updateReadingProgress(mangaId, chapterId, progress) {
        const history = this.getHistory();
        const entry = history.find(h => h.mangaId === mangaId);
        if (entry) {
            entry.progress = progress;
            entry.lastRead = new Date().toISOString();
            localStorage.setItem(this.KEY_HISTORY, JSON.stringify(history));
        }
    }

    static clearHistory() {
        localStorage.setItem(this.KEY_HISTORY, JSON.stringify([]));
        NotificationSystem.info('Histórico de leitura limpo');
    }
}

export default FavoriteManager; 