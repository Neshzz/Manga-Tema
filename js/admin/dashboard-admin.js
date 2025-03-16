document.addEventListener('DOMContentLoaded', () => {
    const dashboardStats = {
        loadStats: async () => {
            try {
                const response = await fetch('/admin/stats');
                const stats = await response.json();
                updateDashboardUI(stats);
            } catch (error) {
                FeedbackManager.error('Erro ao carregar estatísticas');
            }
        },
        
        updateDashboardUI: (stats) => {
            document.getElementById('total-manga').textContent = stats.totalManga;
            document.getElementById('total-users').textContent = stats.totalUsers;
            document.getElementById('total-chapters').textContent = stats.totalChapters;
        }
    };

    dashboardStats.loadStats();
});