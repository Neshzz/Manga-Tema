document.addEventListener('DOMContentLoaded', () => {
    const googleLoginButton = document.getElementById('google-login');
    const discordLoginButton = document.getElementById('discord-login');

    googleLoginButton.addEventListener('click', () => {
        window.location.href = 'backend/login.php?provider=google';
    });

    discordLoginButton.addEventListener('click', () => {
        window.location.href = 'backend/login.php?provider=discord';
    });
});

const handleOAuthClick = async (provider) => {
    try {
        const response = await fetch(`backend/${provider}.php?provider=${provider}`);
        const data = await response.json();
        
        if (data.success) {
            window.location.href = data.authUrl;
        } else {
            console.error('OAuth Error:', data.message);
            // Show error to user
        }
    } catch (error) {
        console.error('Request failed:', error);
        // Show error to user
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Get modal elements
    const loginModal = document.getElementById('login-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalButton = document.getElementById('close-modal');
    const loginForm = document.getElementById('login-form');
    
    // Get login trigger button from header
    const loginTrigger = document.getElementById('login-trigger');
    
    // Show modal when login trigger is clicked
    loginTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
    
    // Close modal when close button is clicked
    closeModalButton.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('input[name="email"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
        const csrfToken = loginForm.querySelector('input[name="csrf_token"]').value;
        
        try {
            const response = await fetch('backend/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, csrf_token: csrfToken })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Redirect based on user role
                if (data.role === 'admin') {
                    window.location.href = 'admin/manage-manga.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                alert(data.message || 'Credenciais inválidas');
            }
        } catch (error) {
            console.error('Erro de login:', error);
            alert('Erro de conexão. Tente novamente.');
        }
    });

    // Handle OAuth buttons
    const googleLoginButton = document.getElementById('google-login');
    const discordLoginButton = document.getElementById('discord-login');

    googleLoginButton.addEventListener('click', () => {
        window.location.href = 'backend/login.php?provider=google';
    });

    discordLoginButton.addEventListener('click', () => {
        window.location.href = 'backend/login.php?provider=discord';
    });
});