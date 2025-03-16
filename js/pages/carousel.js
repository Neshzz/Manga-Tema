document.addEventListener('DOMContentLoaded', async () => {
    const carousel = document.querySelector('.carousel');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const cardWidth = 220;
    let position = 0;
    let autoplayInterval;
    let isTransitioning = false;

    const loadMostViewed = async () => {
        try {
            const response = await fetch('get_views.php');
            const data = await response.json();

            // Criar cards originais
            data.forEach(item => {
                const card = createCard(item);
                carousel.appendChild(card);
            });

            // Clonar primeiro e último cards para transição suave
            const firstClone = createCard(data[0]);
            const lastClone = createCard(data[data.length - 1]);
            firstClone.classList.add('clone');
            lastClone.classList.add('clone');
            
            carousel.appendChild(firstClone);
            carousel.insertBefore(lastClone, carousel.firstChild);

            // Ajustar posição inicial para esconder o clone
            position = cardWidth;
            carousel.style.transform = `translateX(-${position}px)`;

            return data.length;
        } catch (error) {
            console.error('Erro ao carregar as obras mais vistas:', error);
            return 0;
        }
    };

    const createCard = (item) => {
        const card = document.createElement('div');
        card.classList.add('manga-card');
        card.style.minWidth = `${cardWidth}px`;

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        img.style.width = '100%';
        img.style.borderRadius = '4px';

        const title = document.createElement('div');
        title.classList.add('carousel-title');
        title.innerText = item.title;

        card.appendChild(img);
        card.appendChild(title);
        return card;
    };

    const moveCarousel = (direction, totalCards) => {
        if (isTransitioning) return;
        isTransitioning = true;

        const maxScroll = (totalCards + 2) * cardWidth; // +2 para os clones
        const movement = direction === 'next' ? cardWidth : -cardWidth;
        
        position += movement;
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(-${position}px)`;
    };

    const handleTransitionEnd = (totalCards) => {
        const maxScroll = (totalCards + 1) * cardWidth;
        
        carousel.style.transition = 'none';
        
        if (position >= maxScroll) {
            position = cardWidth;
            carousel.style.transform = `translateX(-${position}px)`;
        } else if (position <= 0) {
            position = (totalCards) * cardWidth;
            carousel.style.transform = `translateX(-${position}px)`;
        }
        
        isTransitioning = false;
    };

    const startAutoplay = (totalCards) => {
        stopAutoplay();
        autoplayInterval = setInterval(() => moveCarousel('next', totalCards), 3000);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    const totalCards = await loadMostViewed();

    carousel.addEventListener('transitionend', () => handleTransitionEnd(totalCards));

    nextButton.addEventListener('click', () => {
        moveCarousel('next', totalCards);
        stopAutoplay();
        startAutoplay(totalCards);
    });

    prevButton.addEventListener('click', () => {
        moveCarousel('prev', totalCards);
        stopAutoplay();
        startAutoplay(totalCards);
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', () => startAutoplay(totalCards));

    startAutoplay(totalCards);
});