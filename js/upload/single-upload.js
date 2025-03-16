class SingleUploader {
    constructor() {
        this.currentFile = null;
        this.setupListeners();
    }

    setupListeners() {
        const fileInput = document.getElementById('single-file');
        const uploadBtn = document.getElementById('upload-btn');

        fileInput?.addEventListener('change', this.handleFileSelect.bind(this));
        uploadBtn?.addEventListener('click', this.handleUpload.bind(this));
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.currentFile = file;
            this.previewFile(file);
        } else {
            FeedbackManager.error('Por favor selecione uma imagem válida');
        }
    }

    previewFile(file) {
        const preview = document.getElementById('file-preview');
        if (preview) {
            const reader = new FileReader();
            reader.onload = e => preview.src = e.target.result;
            reader.readAsDataURL(file);
        }
    }

    async handleUpload() {
        if (!this.currentFile) {
            FeedbackManager.error('Nenhum arquivo selecionado');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.currentFile);

        try {
            const response = await fetch('/upload/single', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                FeedbackManager.success('Upload realizado com sucesso!');
            }
        } catch (error) {
            FeedbackManager.error('Erro no upload');
        }
    }
}