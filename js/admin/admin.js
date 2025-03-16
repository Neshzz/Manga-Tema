document.addEventListener('DOMContentLoaded', () => {
    const addMangaForm = document.getElementById('add-manga-form');

    addMangaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addMangaForm);

        try {
            const response = await fetch(`${API_URL}/upload/chapter`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert('Mangá adicionado com sucesso!');
                loadMangaList(); // Reload manga list
            } else {
                alert('Erro: ' + result.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro no envio');
        }
    });

    // Function to load manga list
    async function loadMangaList() {
        const mangaListContainer = document.getElementById('manga-list');

        try {
            const response = await fetch('/get-manga-list.php');
            const mangas = await response.json();

            mangaListContainer.innerHTML = ''; // Clear previous list

            mangas.forEach(manga => {
                const mangaCard = document.createElement('div');
                mangaCard.classList.add('manga-card');
                mangaCard.innerHTML = `
                    <img src="${manga.cover_path}" alt="${manga.title}">
                    <h3>${manga.title}</h3>
                    <p>${manga.description}</p>
                    <div class="manga-actions">
                        <button onclick="addChapter(${manga.id})">Adicionar Capítulo</button>
                        <button onclick="manageManga(${manga.id})">Gerenciar</button>
                    </div>
                `;
                mangaListContainer.appendChild(mangaCard);
            });
        } catch (error) {
            console.error('Erro ao carregar mangás:', error);
        }
    }

    document.getElementById('chapter-pages').addEventListener('change', (event) => {
        const files = event.target.files;

        // Organize files by folder
        const folderStructure = {};
        
        for (let file of files) {
            const path = file.webkitRelativePath;
            const parts = path.split('/');
            const folderName = parts[0];
            
            if (!folderStructure[folderName]) {
                folderStructure[folderName] = [];
            }
            
            folderStructure[folderName].push(file);
        }
        
        // Validate files and identify chapters based on folder name
        Object.keys(folderStructure).forEach(folderName => {
            const chapterMatch = folderName.match(/cap[ítulo]?\s*(\d+)/i);
            if (chapterMatch) {
                const chapterNumber = chapterMatch[1];
                console.log(`Capítulo ${chapterNumber}:`, folderStructure[folderName]);
            } else {
                alert(`Erro: O nome da pasta "${folderName}" não contém um número de capítulo válido.`);
            }
        });
    });
});
