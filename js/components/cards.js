import { formatDate } from '../utils/formatters.js';

export function createUpdateCard(manga) {
    return `
        <div class="update-card">
            <div class="manga-cover">
                <img src="${manga.cover_path}" alt="${manga.title}">
                ${manga.isNew ? '<span class="new-badge">New</span>' : ''}
            </div>
            <div class="manga-details">
                <h3 class="manga-title">${manga.title}</h3>
                <div class="manga-genres">${manga.genres.join(' • ')}</div>
                <div class="chapter-list">
                    ${manga.chapters.slice(0, 2).map(chapter => `
                        <div class="chapter-item">
                            <div class="chapter-thumb">
                                <img src="${chapter.thumbnail}" alt="Chapter ${chapter.number}">
                            </div>
                            <div class="chapter-info">
                                <span class="chapter-number">Chapter ${chapter.number}</span>
                                <span class="chapter-date">${formatDate(chapter.date)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

export function createTrendingCard(manga, index) {
    return `
        <div class="trending-card">
            <div class="rank-number">${index + 1}</div>
            <div class="manga-info">
                <img src="${manga.cover_path}" alt="${manga.title}" class="manga-thumb">
                <div class="manga-details">
                    <h3>${manga.title}</h3>
                    <div class="manga-meta">
                        <span class="manga-type">${manga.type}</span>
                        <span class="manga-genres">${manga.genres.join(' • ')}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
} 