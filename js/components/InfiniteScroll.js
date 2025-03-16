class InfiniteScroll {
    constructor(options) {
        this.options = {
            container: null,           // Elemento que contém os itens
            loadingElement: null,      // Elemento de loading
            threshold: 100,            // Distância do fim para carregar mais
            pageSize: 20,              // Itens por página
            currentPage: 1,            // Página atual
            loading: false,            // Estado de carregamento
            hasMore: true,             // Se há mais itens para carregar
            onLoadMore: null,          // Callback para carregar mais itens
            ...options
        };

        this.init();
    }

    init() {
        // Criar elemento de loading se não existir
        if (!this.options.loadingElement) {
            this.options.loadingElement = document.createElement('div');
            this.options.loadingElement.className = 'infinite-scroll-loading';
            this.options.loadingElement.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            `;
            this.options.container.appendChild(this.options.loadingElement);
        }

        // Configurar observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                root: null,
                rootMargin: `${this.options.threshold}px`,
                threshold: 0.1
            }
        );

        this.observer.observe(this.options.loadingElement);

        // Adicionar listener para scroll (fallback)
        window.addEventListener('scroll', () => this.handleScroll());
    }

    async handleIntersection(entries) {
        if (entries[0].isIntersecting) {
            await this.loadMore();
        }
    }

    handleScroll() {
        if (this.shouldLoadMore()) {
            this.loadMore();
        }
    }

    shouldLoadMore() {
        if (this.options.loading || !this.options.hasMore) return false;

        const container = this.options.container;
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = container.offsetTop + container.offsetHeight - this.options.threshold;

        return scrollPosition >= threshold;
    }

    async loadMore() {
        if (this.options.loading || !this.options.hasMore) return;

        this.options.loading = true;
        this.showLoading();

        try {
            const items = await this.options.onLoadMore(this.options.currentPage);
            
            if (items && items.length > 0) {
                this.options.currentPage++;
                this.options.hasMore = items.length >= this.options.pageSize;
            } else {
                this.options.hasMore = false;
            }
        } catch (error) {
            console.error('Error loading more items:', error);
            NotificationSystem.error('Erro ao carregar mais itens');
        } finally {
            this.options.loading = false;
            this.hideLoading();
        }
    }

    showLoading() {
        this.options.loadingElement.classList.add('show');
    }

    hideLoading() {
        this.options.loadingElement.classList.remove('show');
    }

    reset() {
        this.options.currentPage = 1;
        this.options.hasMore = true;
        this.options.loading = false;
    }

    destroy() {
        this.observer.disconnect();
        window.removeEventListener('scroll', this.handleScroll);
    }
}

export default InfiniteScroll; 