async function loadMangas() {
    try {
        const response = await fetch('/api/manga');
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }

        // Renderizar os mangás
        renderMangaList(data.mangas);
    } catch (error) {
        console.error('Erro ao carregar mangás:', error);
    }
}

// Função para renderizar a lista de mangás
function renderMangaList(mangas) {
    const mangaContainer = document.querySelector('.manga-grid');
    mangaContainer.innerHTML = mangas.map(manga => `
        <div class="manga-card">
            <img src="${manga.cover_path}" alt="${manga.title}">
            <h3>${manga.title}</h3>
            <p class="manga-genre">${manga.genre}</p>
        </div>
    `).join('');
}


// Existing loadNewChapters function
async function loadNewChapters() {
    try {
        const response = await fetch('https://mangadex-api.vercel.app/api/new-chapters');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        const data = JSON.parse(text);        

        let chapters;
        try {
            chapters = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('Erro ao parsear JSON:', jsonError);
            throw new Error('Resposta inválida do servidor: ' + responseText);
        }

        const newChaptersList = document.getElementById('new-chapters-list');
        newChaptersList.innerHTML = '';

        if (!chapters || chapters.length === 0) {
            newChaptersList.innerHTML = '<p>Nenhum capítulo novo encontrado.</p>';
            return;
        }

        chapters.forEach(chapter => {
            const chapterElement = document.createElement('div');
            chapterElement.classList.add('manga-card');
            chapterElement.innerHTML = `
                <div class="manga-card-image">
                    <img src="${chapter.cover_path}" alt="${chapter.manga_title}">
                    <span class="new-chapter-badge">Cap. ${chapter.chapter_number}</span>
                </div>
                <div class="manga-card-content">
                    <h2>${chapter.manga_title}</h2>
                    <div class="manga-card-details">
                        <span class="manga-time">${chapter.time_ago}</span>
                    </div>
                    <a href="read.html?chapterId=${chapter.id}" class="read-btn">Ler Capítulo</a>
                </div>
            `;
            newChaptersList.appendChild(chapterElement);
        });
    } catch (error) {
        console.error('Erro ao carregar novos capítulos:', error);
        const newChaptersList = document.getElementById('new-chapters-list');
        newChaptersList.innerHTML = `
            <div style="color: red; text-align: center;">
                Erro ao carregar novos capítulos: ${error.message}
            </div>
        `;
    }
}

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadMangas();
    loadNewChapters();
});
