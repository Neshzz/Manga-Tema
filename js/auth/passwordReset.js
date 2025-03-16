// Formulário de solicitação
document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (response.ok) {
    NotificationSystem.success('Verifique seu email para instruções');
  }
});

// Formulário de redefinição
document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const token = window.location.pathname.split('/').pop();
  
  const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  
  const data = await response.json();
  if (response.ok) {
    NotificationSystem.success('Senha alterada com sucesso!');
    window.location.href = '/login';
  }
}); 