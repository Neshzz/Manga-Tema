async function loadProjetos() {
    try {
        // Simulated manga data for testing
        const mangas = [
            {
                id: 1,
                title: 'Manga 1',
                cover_path: '/assets/images/trending/Demonio Imperador.jpg',
                genre: 'Ação',
                total_chapters: 100
            },
            {
                id: 2,
                title: 'Manga 2',
                cover_path: '/assets/images/trending/Até com hacks continuo sendo o mais fraco da seita.png',
                genre: 'Comédia',
                total_chapters: 50
            },
            {
                id: 2,
                title: 'Manga 3',
                cover_path: '/assets/images/trending/Até com hacks continuo sendo o mais fraco da seita.png',
                genre: 'Comédia',
                total_chapters: 50
            },
            {
                id: 2,
                title: 'Manga 4',
                cover_path: '/assets/images/trending/Até com hacks continuo sendo o mais fraco da seita.png',
                genre: 'Comédia',
                total_chapters: 50
            },
            {
                id: 2,
                title: 'Manga 5',
                cover_path: '/assets/images/trending/Até com hacks continuo sendo o mais fraco da seita.png',
                genre: 'Comédia',
                total_chapters: 50
            },
            {
                id: 2,
                title: 'Manga 6',
                cover_path: '/assets/images/trending/Até com hacks continuo sendo o mais fraco da seita.png',
                genre: 'Comédia',
                total_chapters: 50
            }
        ];

        const projetosGrid = document.getElementById('projetos-grid');
        if (!projetosGrid) {
            throw new Error("Elemento 'projetos-grid' não encontrado");
        }

        projetosGrid.innerHTML = '';

        mangas.forEach(manga => {
            const projetoCard = document.createElement('div');
            projetoCard.classList.add('projeto-card');
            projetoCard.innerHTML = `
                <img src="${manga.cover_path}" alt="${manga.title}" loading="lazy">
                <div class="projeto-card-info">
                    <h3>${manga.title}</h3>
                    <p>${manga.genre}</p>
                    <p>${manga.total_chapters} capítulos</p>
                    <a href="manga-details.html?id=${manga.id}" class="read-btn">Ver Detalhes</a>
                </div>
            `;
            projetosGrid.appendChild(projetoCard);
        });
    } catch (error) {
        console.error('Erro ao carregar os projetos:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProjetos);