class Carousel {
    constructor(element) {
        this.carousel = element;
        this.container = element.querySelector('.carousel-container');
        this.items = element.querySelectorAll('.carousel-item');
        this.indicators = element.querySelectorAll('.carousel-indicator');
        
        this.currentIndex = 0;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        // Clone primeiro e último slides para rolagem infinita
        const firstClone = this.items[0].cloneNode(true);
        const lastClone = this.items[this.items.length - 1].cloneNode(true);
        this.container.appendChild(firstClone);
        this.container.prepend(lastClone);
        
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateIndicators();
    }

    setupEventListeners() {
        // Touch events
        this.carousel.addEventListener('touchstart', (e) => this.startDragging(e));
        this.carousel.addEventListener('touchmove', (e) => this.drag(e));
        this.carousel.addEventListener('touchend', () => this.stopDragging());

        // Mouse events
        this.carousel.addEventListener('mousedown', (e) => this.startDragging(e));
        this.carousel.addEventListener('mousemove', (e) => this.drag(e));
        this.carousel.addEventListener('mouseup', () => this.stopDragging());
        this.carousel.addEventListener('mouseleave', () => this.stopDragging());

        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
    }

    startDragging(e) {
        this.isDragging = true;
        this.startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        this.stopAutoPlay();
    }

    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const walk = (x - this.startX) * 2;
        
        this.container.style.transform = `translateX(${-this.currentIndex * 100 + walk}%)`;
    }

    stopDragging() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const movedBy = this.currentX - this.startX;
        
        if (Math.abs(movedBy) > 100) {
            if (movedBy > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            this.goToSlide(this.currentIndex);
        }
        
        this.startAutoPlay();
    }

    nextSlide() {
        this.currentIndex++;
        this.updateSlidePosition();
    }

    prevSlide() {
        this.currentIndex--;
        this.updateSlidePosition();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlidePosition();
    }

    updateSlidePosition(smooth = true) {
        if (smooth) {
            this.container.style.transition = 'transform 0.5s ease-in-out';
        } else {
            this.container.style.transition = 'none';
        }
        
        this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateIndicators();
        
        // Rolagem infinita
        if (this.currentIndex >= this.items.length) {
            setTimeout(() => {
                this.container.style.transition = 'none';
                this.currentIndex = 0;
                this.container.style.transform = `translateX(0)`;
            }, 500);
        } else if (this.currentIndex < 0) {
            setTimeout(() => {
                this.container.style.transition = 'none';
                this.currentIndex = this.items.length - 1;
                this.container.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            }, 500);
        }
    }

    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel(document.querySelector('.featured-carousel'));
}); 