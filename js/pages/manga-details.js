import CommentSystem from '../components/CommentSystem.js';

const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

class MangaDetailsPage {
    constructor() {
        this.mangaId = this.getMangaId();
        this.init();
    }

    // Obtém o ID do mangá da URL
    getMangaId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async init() {
        if (!this.mangaId) {
            showFeedback('Mangá não encontrado', 'error');
            return;
        }

        try {
            // Adicione um loader
            document.querySelector('.loading-message').style.display = 'block';
            
            const mangaData = await this.fetchMangaDetails();
            this.populateMangaDetails(mangaData);
            
            await this.fetchAndDisplayChapters();
            
            this.initComments();
            this.setupRatingSystem();
            
            // Esconda o loader após carregar
            document.querySelector('.loading-message').style.display = 'none';
            
        } catch (error) {
            showFeedback(`Erro ao carregar dados: ${error.message}`, 'error');
            document.querySelector('.loading-message').style.display = 'none';
        }
    }

    // Busca detalhes do mangá da API
    async fetchMangaDetails() {
        return {
            title: 'Demônio Imperador',
            author: '17K',
            genres: ['Ação', 'Aventura'],
            status: 'Em lançamento',
            views: 1760000,
            synopsis: 'Um jovem encontra um artefato ancestral que desencadeia poderes demoníacos...',
            coverImage: '/backend/public/assets/images/Cover/Demonio Imperador.jpg',
            chapters: Array.from({length: 20}, (_, i) => ({
                number: i + 1,
                title: `Capítulo ${i + 1}: O Início da Jornada`,
                releaseDate: new Date(Date.now() - (i * 86400000)).toISOString()
            }))
        };
    }

    // Preenche os dados na página
    populateMangaDetails(mangaData) {
        document.getElementById('manga-cover').src = mangaData.coverImage;
        document.getElementById('manga-title').textContent = mangaData.title;
        document.getElementById('manga-author').textContent = mangaData.author;
        document.getElementById('manga-genre').textContent = mangaData.genres.join(', ');
        document.getElementById('manga-status').textContent = mangaData.status;
        document.getElementById('manga-views').textContent = mangaData.views.toLocaleString();
        document.getElementById('manga-synopsis').textContent = mangaData.synopsis;
    }

    // Busca e exibe capítulos
    async fetchAndDisplayChapters() {
        try {
            const response = await fetch(`/api/manga/${this.mangaId}/chapters`);
            if (!response.ok) throw new Error('Falha ao carregar capítulos');
            const chapters = await response.json();
            
            this.updateChaptersUI(chapters);
            this.setupChapterModals(chapters);
        } catch (error) {
            showFeedback(`Erro: ${error.message}`, 'error');
        }
    }

    // Atualiza a UI dos capítulos
    updateChaptersUI(chapters) {
        const container = document.getElementById('chapters-preview-container');
        container.innerHTML = chapters.slice(0, 5).map(chap => `
            <div class="chapter-item">
                <a href="read.html?manga=${this.mangaId}&chapter=${chap.number}" 
                   class="chapter-link">
                    Capítulo ${chap.number}
                </a>
                <span class="chapter-date">${formatDate(chap.releaseDate)}</span>
            </div>
        `).join('');
    }

    // Configura o modal de capítulos
    setupChapterModals(chapters) {
        const modalContainer = document.getElementById('chapters-list-full');
        modalContainer.innerHTML = chapters.map(chap => `
            <div class="chapter-item">
                <a href="read.html?manga=${this.mangaId}&chapter=${chap.number}" 
                   class="chapter-link">
                    Capítulo ${chap.number} - ${chap.title}
                </a>
                <span class="chapter-date">${formatDate(chap.releaseDate)}</span>
            </div>
        `).join('');
        
        // Adicionar evento de clique nos links
        modalContainer.querySelectorAll('.chapter-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = link.href;
            });
        });
    }

    // Sistema de avaliação
    setupRatingSystem() {
        const stars = document.querySelectorAll('.star');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRating(star.dataset.value);
                this.highlightStars(star.dataset.value);
            });
            
            star.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleRating(star.dataset.value);
                    this.highlightStars(star.dataset.value);
                }
            });
        });
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.color = star.dataset.value <= rating 
                ? '#ffd700' 
                : '#ccc';
        });
    }

    async handleRating(rating) {
        try {
            const response = await fetch(`/api/manga/${this.mangaId}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating })
            });
            
            if (response.ok) {
                const data = await response.json();
                document.getElementById('rating-total').textContent = data.totalRatings;
                showFeedback('Avaliação registrada!', 'success');
            }
        } catch (error) {
            showFeedback('Erro ao avaliar', 'error');
        }
    }

    // Sistema de comentários
    initComments() {
        const commentsContainer = document.getElementById('manga-comments');
        this.commentSystem = new CommentSystem({
            container: commentsContainer,
            itemId: this.mangaId,
            itemType: 'manga',
            onCommentSubmit: () => this.handleNewComment()
        });
    }

    handleNewComment() {
        // Lógica adicional após comentário (ex: atualizar contador)
        showFeedback('Comentário postado!', 'success');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se está na página correta
    if (document.querySelector('.manga-details-page')) {
        new MangaDetailsPage();
    }
    
    // Verificar clique no botão de capítulos
    const chaptersBtn = document.getElementById('show-all-chapters');
    if (chaptersBtn) {
        chaptersBtn.addEventListener('click', openChaptersModal);
    }
});

// Funções globais para o modal
window.openChaptersModal = () => {
    document.getElementById('chapters-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

window.closeChaptersModal = () => {
    document.getElementById('chapters-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fechar modal ao clicar fora
document.getElementById('chapters-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('chapters-modal')) {
        closeChaptersModal();
    }
}); 