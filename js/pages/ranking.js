
// Carregar ranking
async function loadRanking() {
 try {
     const response = await fetch('backend/get-ranking.php');
     const mangas = await response.json();

     const rankingGrid = document.getElementById('ranking-grid');
     rankingGrid.innerHTML = '';

     mangas.forEach(manga => {
         const rankingCard = document.createElement('div');
         rankingCard.classList.add('ranking-card');
         rankingCard.innerHTML = `
             <div class="ranking-position">${manga.position}</div>
             <div class="ranking-image-container">
                 <img src="${manga.cover_path}" alt="${manga.title}">
                 <div class="ranking-overlay">
                     <div class="ranking-stats">
                         <div class="ranking-stat">
                             <span>📖 ${manga.chapters} capítulos</span>
                         </div>
                         <div class="ranking-stat">
                             <span>👥 ${manga.readers} leitores</span>
                         </div>
                     </div>
                 </div>
             </div>
             <div class="ranking-card-info">
                 <h3 class="ranking-title-text">${manga.title}</h3>
                 <div class="ranking-genre">${manga.genre}</div>
                 <div class="ranking-score">
                     <span>Avaliação:</span>
                     <span class="ranking-score-value">${manga.score}</span>
                 </div>
             </div>
         `;
         rankingGrid.appendChild(rankingCard);
     });
 } catch (error) {
     console.error('Erro ao carregar ranking:', error);
 }
}