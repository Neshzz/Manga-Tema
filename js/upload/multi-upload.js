class MultiUploadManager {
    constructor() {
        this.uploads = new Map();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const dropZone = document.getElementById('multi-upload-zone');
        
        dropZone?.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone?.addEventListener('drop', this.handleDrop.bind(this));
    }

    async handleDrop(e) {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        await this.processFiles(files);
    }

    async processFiles(files) {
        const validFiles = files.filter(file => 
            file.type.startsWith('image/'));
        
        if (validFiles.length === 0) {
            FeedbackManager.error('Nenhum arquivo de imagem válido encontrado');
            return;
        }

        // Process files...
        await this.uploadFiles(validFiles);
    }

    async uploadFiles(files) {
        const formData = new FormData();
        files.forEach(file => formData.append('files[]', file));

        try {
            const response = await fetch('/upload/batch', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                FeedbackManager.success('Upload concluído com sucesso!');
            }
        } catch (error) {
            FeedbackManager.error('Erro no upload');
        }
    }
}