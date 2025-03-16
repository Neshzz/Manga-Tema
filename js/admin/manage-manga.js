document.addEventListener('DOMContentLoaded', () => {
    // Gerenciar tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Atualizar botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Atualizar painéis
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === tabId) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // Upload de capa
    const coverInput = document.getElementById('cover-input');
    const coverPreview = document.getElementById('cover-preview');
    const uploadOverlay = document.querySelector('.upload-overlay');

    uploadOverlay.addEventListener('click', () => coverInput.click());

    coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                coverPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Upload de capítulo
    const dropZone = document.getElementById('drop-zone');
    const pagesInput = document.getElementById('pages-input');
    const fileList = document.getElementById('file-list');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropZone.addEventListener('drop', handleDrop);
    pagesInput.addEventListener('change', handleFileSelect);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = [...dt.files];
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = [...e.target.files];
        handleFiles(files);
    }

    function handleFiles(files) {
        // Filtrar apenas imagens
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        // Ordenar por nome
        imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));
        
        // Limpar lista anterior
        fileList.innerHTML = '';
        
        // Mostrar arquivos
        imageFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <span class="file-number">${index + 1}</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <button type="button" class="remove-file">×</button>
            `;
            
            item.querySelector('.remove-file').addEventListener('click', () => {
                item.remove();
                validateFiles();
            });
            
            fileList.appendChild(item);
        });
        
        validateFiles();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function validateFiles() {
        const summary = document.getElementById('validation-summary');
        const files = fileList.children.length;
        
        if (files === 0) {
            summary.innerHTML = 'Nenhum arquivo selecionado';
            summary.className = 'validation-summary warning';
        } else {
            summary.innerHTML = `${files} arquivo${files > 1 ? 's' : ''} selecionado${files > 1 ? 's' : ''}`;
            summary.className = 'validation-summary success';
        }
    }

    // Adicionar mangá
    document.getElementById('add-manga-button').addEventListener('click', async () => {
        const form = document.getElementById('manga-form');
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${API_URL}/manga`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                NotificationSystem.success('Mangá adicionado com sucesso!');
                form.reset();
            } else {
                NotificationSystem.error(data.message || 'Erro ao adicionar mangá');
            }
        } catch (error) {
            NotificationSystem.error('Erro de conexão');
        }
    });

    // Upload de capítulo
    document.getElementById('upload-chapter-button').addEventListener('click', async () => {
        const form = document.getElementById('chapter-form');
        const formData = new FormData(form);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/manga/chapter', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                showFeedback('Capítulo enviado com sucesso!', 'success');
                form.reset();
                fileList.innerHTML = '';
                validateFiles();
            } else {
                showFeedback(data.message, 'error');
            }
        } catch (error) {
            showFeedback('Erro ao enviar capítulo', 'error');
        }
    });
});

function validateForm() {
    // Implementação da validação do formulário
    const title = document.getElementById('title').value;
    if (!title) {
        alert('Por favor, preencha o título da obra.');
        return false;
    }
    return true;
}

function showFeedback(message, type) {
    const feedbackElement = document.getElementById('feedback-message');
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback-message ${type}`;
    feedbackElement.style.display = 'block';

    setTimeout(() => {
        feedbackElement.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    const genreSelect = document.getElementById('genre');
    const selectedGenresContainer = document.createElement('div');
    selectedGenresContainer.classList.add('selected-genres');
    genreSelect.parentElement.appendChild(selectedGenresContainer);

    // Função para atualizar as tags de gêneros selecionados
    function updateSelectedGenres() {
        selectedGenresContainer.innerHTML = ''; // Limpa o container
        Array.from(genreSelect.selectedOptions).forEach(option => {
            const genreTag = document.createElement('div');
            genreTag.classList.add('genre-tag');
            genreTag.textContent = option.textContent;

            // Botão para remover o gênero selecionado
            const removeTag = document.createElement('span');
            removeTag.classList.add('remove-tag');
            removeTag.innerHTML = '&times;'; // Ícone de "X"
            removeTag.addEventListener('click', () => {
                option.selected = false;
                updateSelectedGenres();
            });

            genreTag.appendChild(removeTag);
            selectedGenresContainer.appendChild(genreTag);
        });
    }

    // Atualiza as tags quando o campo de seleção muda
    genreSelect.addEventListener('change', updateSelectedGenres);

    // Inicializa as tags com os gêneros já selecionados (se houver)
    updateSelectedGenres();
});