document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    loadProfile();

    // Event Listeners
    document.getElementById('edit-profile-btn').addEventListener('click', showEditModal);
    document.getElementById('cancel-edit').addEventListener('click', hideEditModal);
    document.getElementById('edit-form').addEventListener('submit', handleEditProfile);
});

async function loadProfile() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            // Carregar informações básicas
            document.getElementById('username').textContent = data.data.username;
            document.getElementById('email').textContent = data.data.email;
            document.getElementById('member-since').textContent = 
                `Membro desde ${new Date(data.data.createdAt).toLocaleDateString()}`;

            // Carregar favoritos
            renderFavorites(data.data.favorites);

            // Carregar histórico
            renderHistory(data.data.readingHistory);
        } else {
            showFeedback(data.message, 'error');
        }
    } catch (error) {
        showFeedback('Erro ao carregar perfil', 'error');
    }
}

function renderFavorites(favorites) {
    const container = document.getElementById('favorites-grid');
    container.innerHTML = favorites.map(manga => `
        <div class="manga-card">
            <img src="${manga.cover_path}" alt="${manga.title}">
            <h3>${manga.title}</h3>
            <a href="manga-details.html?id=${manga._id}">Ver mais</a>
        </div>
    `).join('');
}

function renderHistory(history) {
    const container = document.getElementById('history-list');
    container.innerHTML = history.map(item => `
        <div class="history-item">
            <img src="${item.manga.cover_path}" alt="${item.manga.title}">
            <div class="history-info">
                <h3>${item.manga.title}</h3>
                <p>Último capítulo lido: ${item.chapter}</p>
                <p>Lido em: ${new Date(item.lastRead).toLocaleString()}</p>
            </div>
        </div>
    `).join('');
}

function showEditModal() {
    const modal = document.getElementById('edit-modal');
    const user = JSON.parse(localStorage.getItem('user'));
    
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-email').value = user.email;
    
    modal.style.display = 'block';
}

function hideEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

async function handleEditProfile(e) {
    e.preventDefault();
    
    const password = document.getElementById('edit-password').value;
    const confirmPassword = document.getElementById('edit-confirm-password').value;
    
    if (password && password !== confirmPassword) {
        showFeedback('As senhas não coincidem', 'error');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                username: document.getElementById('edit-username').value,
                email: document.getElementById('edit-email').value,
                ...(password && { password })
            })
        });

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.data));
            showFeedback('Perfil atualizado com sucesso!', 'success');
            hideEditModal();
            loadProfile();
        } else {
            showFeedback(data.message, 'error');
        }
    } catch (error) {
        showFeedback('Erro ao atualizar perfil', 'error');
    }
}

function showFeedback(message, type) {
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
} 