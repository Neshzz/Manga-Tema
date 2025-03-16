import api from '../config/api.js';

async function loadMangaDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = urlParams.get('id');

    if (!mangaId) {
        console.error('ID do mangá não fornecido');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/manga/${mangaId}`);
        const data = await response.json();

        if (data.success) {
            // Atualizar informações básicas
            document.getElementById('manga-cover').src = data.manga.cover_path;
            document.getElementById('manga-title').textContent = data.manga.title;
            document.getElementById('manga-synopsis').textContent = data.manga.description;
            document.getElementById('manga-author').textContent = data.manga.author;
            document.getElementById('manga-genre').textContent = data.manga.genre.join(', ');
            document.getElementById('manga-status').textContent = data.manga.status;

            // Carregar capítulos
            loadChapters(mangaId);
            
            // Carregar comentários
            loadComments(mangaId);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
    }
}

async function loadChapters(mangaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/manga/${mangaId}/chapters`);
        const data = await response.json();

        if (data.success) {
            renderChaptersPreview(data.chapters);
            renderFullChaptersList(data.chapters);
        }
    } catch (error) {
        console.error('Erro ao carregar capítulos:', error);
    }
}

function renderChaptersPreview(chapters) {
    const container = document.getElementById('chapters-preview-container');
    const previewChapters = chapters.slice(0, 5); // Mostrar apenas os 5 primeiros

    container.innerHTML = previewChapters.map(chapter => `
        <div class="chapter-item">
            <span>Capítulo ${chapter.number}</span>
            <a href="read.html?id=${chapter._id}">Ler</a>
        </div>
    `).join('');
}

function renderFullChaptersList(chapters) {
    const container = document.getElementById('chapters-list-full');
    
    container.innerHTML = chapters.map(chapter => `
        <div class="chapter-item">
            <span>Capítulo ${chapter.number}</span>
            <a href="read.html?id=${chapter._id}">Ler</a>
        </div>
    `).join('');
}

function renderComments(comments) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = comments
        .map(comment => `
            <div class="comment">
                <strong>${comment.username}</strong>
                <p>${comment.content}</p>
                <small>${new Date(comment.createdAt).toLocaleString()}</small>
            </div>
        `).join('');
}

// Sistema de avaliação
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', async () => {
        const rating = parseInt(star.dataset.value);
        const mangaId = new URLSearchParams(window.location.search).get('id');

        try {
            const response = await fetch(`http://localhost:3000/api/manga/${mangaId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating })
            });

            const data = await response.json();
            if (data.success) {
                updateStarRating(rating);
            }
        } catch (error) {
            console.error('Erro ao avaliar:', error);
        }
    });
});

// Sistema de comentários
document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('comment-input').value;
    const mangaId = new URLSearchParams(window.location.search).get('id');

    try {
        const response = await fetch(`http://localhost:3000/api/manga/${mangaId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('comment-input').value = '';
            loadComments(mangaId);
        }
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
    }
});

// Função para carregar comentários
async function loadComments(mangaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/manga/${mangaId}/comments`);
        const data = await response.json();

        if (data.success) {
            const container = document.getElementById('comments-container');
            container.innerHTML = data.comments.map(comment => `
                <div class="comment">
                    <strong>${comment.username}</strong>
                    <p>${comment.content}</p>
                    <small>${new Date(comment.createdAt).toLocaleString()}</small>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}

// Funções do modal de capítulos
function openChaptersModal() {
    document.getElementById('chapters-modal').style.display = 'flex';
}

function closeChaptersModal() {
    document.getElementById('chapters-modal').style.display = 'none';
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadMangaDetails);