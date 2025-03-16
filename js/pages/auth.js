document.addEventListener('DOMContentLoaded', () => {
    // Gerenciar tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Atualizar botões
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Atualizar formulários
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tab}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Login
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: document.getElementById('login-email').value,
                    password: document.getElementById('login-password').value
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Salvar token
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                showFeedback('Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                showFeedback(data.message, 'error');
            }
        } catch (error) {
            showFeedback('Erro ao fazer login', 'error');
        }
    });

    // Registro
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            showFeedback('As senhas não coincidem', 'error');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: document.getElementById('register-username').value,
                    email: document.getElementById('register-email').value,
                    password
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Salvar token
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                showFeedback('Registro realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                showFeedback(data.message, 'error');
            }
        } catch (error) {
            showFeedback('Erro ao fazer registro', 'error');
        }
    });
});

// Função para mostrar feedback
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
} 