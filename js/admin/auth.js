document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginModal = document.getElementById('login-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalButton = document.getElementById('close-modal');

    // Show modal when "Entrar" button is clicked
    document.querySelector('.settings-dropdown a[href="login.html"]').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        loginModal.style.display = 'block'; // Show the modal
        modalOverlay.style.display = 'block'; // Show the overlay
    });

    // Close modal when close button is clicked
    closeModalButton.addEventListener('click', () => {
        loginModal.style.display = 'none'; // Hide the modal
        modalOverlay.style.display = 'none'; // Hide the overlay
    });

    // Close modal when overlay is clicked
    modalOverlay.addEventListener('click', () => {
        loginModal.style.display = 'none'; // Hide the modal
        modalOverlay.style.display = 'none'; // Hide the overlay
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const credentials = {
            email: loginForm.querySelector('input[type="email"]').value,
            password: loginForm.querySelector('input[type="password"]').value
        };

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                NotificationSystem.error(data.message);
            }
        } catch (error) {
            NotificationSystem.error('Erro de conexão');
        }
    });
});
