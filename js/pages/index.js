import { api } from '../config/api.js';
import { createUpdateCard, createTrendingCard } from '../components/cards.js';

// Constantes e Configurações
const API_URL = 'http://127.0.0.1:5000/api';

// Funções de Renderização
function renderFeatured(mangas) {
    const container = document.querySelector('.carousel-container');
    const dotsContainer = document.querySelector('.carousel-dots');

    container.innerHTML = mangas.map((manga, index) => `
        <div class="carousel-item" data-index="${index}">
            <img src="${manga.cover_path}" alt="${manga.title}">
            <div class="manga-info">
                <h3>${manga.title}</h3>
                <div class="manga-meta">
                    <span class="manga-type">${manga.type}</span>
                    <span class="manga-genres">${manga.genres.join(' • ')}</span>
                </div>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = mangas.map((_, index) => `
        <div class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
    `).join('');

    initializeCarousel();
}

function renderUpdates(mangas) {
    const container = document.querySelector('.latest-updates .manga-grid');
    container.innerHTML = mangas.map(manga => createUpdateCard(manga)).join('');
}

function renderPopular(mangas) {
    const container = document.querySelector('.popular-section .manga-grid');
    container.innerHTML = mangas.map((manga, index) => createTrendingCard(manga, index)).join('');
}

// Controles do Carrossel
function initializeCarousel() {
    const container = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentIndex = 0;

    function updateCarousel(index) {
        const itemWidth = container.querySelector('.carousel-item').offsetWidth + 20;
        container.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth'
        });
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    prevBtn?.addEventListener('click', () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : dots.length - 1;
        updateCarousel(newIndex);
    });

    nextBtn?.addEventListener('click', () => {
        const newIndex = currentIndex < dots.length - 1 ? currentIndex + 1 : 0;
        updateCarousel(newIndex);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            updateCarousel(index);
        });
    });
}

// Carregamento Inicial
async function loadHomePage() {
    try {
        const [featuredData, updatesData, popularData] = await Promise.all([
            api.manga.featured(),
            api.manga.latest(),
            api.manga.popular()
        ]);

        renderFeatured(featuredData.data);
        renderUpdates(updatesData.data);
        renderPopular(popularData.data);
    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', loadHomePage); 