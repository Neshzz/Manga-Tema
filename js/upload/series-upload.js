class SeriesUploader {
    constructor() {
        this.seriesData = new FormData();
        this.initialize();
    }

    initialize() {
        this.setupForm();
        this.setupImagePreviews();
    }

    setupForm() {
        const form = document.getElementById('series-form');
        form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    setupImagePreviews() {
        const coverInput = document.getElementById('cover-input');
        const bannerInput = document.getElementById('banner-input');

        coverInput?.addEventListener('change', this.previewImage.bind(this, 'cover'));
        bannerInput?.addEventListener('change', this.previewImage.bind(this, 'banner'));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        try {
            const response = await fetch('/series/create', {
                method: 'POST',
                body: new FormData(form)
            });

            if (response.ok) {
                FeedbackManager.success('Série criada com sucesso!');
            }
        } catch (error) {
            FeedbackManager.error('Erro ao criar série');
        }
    }

    previewImage(type, event) {
        const file = event.target.files[0];
        const preview = document.getElementById(`${type}-preview`);
        
        if (file && preview) {
            const reader = new FileReader();
            reader.onload = e => preview.src = e.target.result;
            reader.readAsDataURL(file);
        }
    }
}