document.addEventListener('DOMContentLoaded', async () => {
    const mangaId = new URLSearchParams(window.location.search).get('mangaId');

    // Mock data for demonstration
    const mangaInfo = {
        title: "Mock Manga Title",
        total_views: 1000,
        total_reactions: 150,
        total_chapters: 20
    };

    // Update the UI with mock data
    document.querySelector('.manga-title').textContent = mangaInfo.title;
    document.querySelector('.manga-views').textContent = `${mangaInfo.total_views} Visualizações`;
    document.querySelector('.manga-reactions').textContent = `${mangaInfo.total_reactions} Reações`;
    document.querySelector('.manga-chapters').textContent = `${mangaInfo.total_chapters} Capítulos`;

    // Simulate updating views (mocked)
    console.log(`Updated views for manga ID: ${mangaId}`);
});

document.getElementById('reaction-button').addEventListener('click', async () => {
    const mangaId = new URLSearchParams(window.location.search).get('mangaId');

    // Simulate updating reactions (mocked)
    console.log(`Updated reactions for manga ID: ${mangaId}`);
});
