// auth.js - Handles OAuth and CSRF functionality

// CSRF Token Handling
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Function to set CSRF token in AJAX requests
function setCsrfToken(xhr) {
    xhr.setRequestHeader('X-CSRF-Token', csrfToken);
}

// Example of using the CSRF token in a fetch request
async function fetchWithCsrf(url, options = {}) {
    options.headers = {
        ...options.headers,
        'X-CSRF-Token': csrfToken
    };
    return fetch(url, options);
}

// Handle OAuth Registration
function handleOAuthRegister(provider) {
    window.location.href = `backend/register.php?provider=${provider}`;
}

// Handle OAuth Login
function handleOAuthLogin(provider) {
    window.location.href = `backend/login.php?provider=${provider}`;
}

// Event listeners for OAuth buttons
document.addEventListener('DOMContentLoaded', () => {
    const googleRegisterButton = document.getElementById('google-register');
    const discordRegisterButton = document.getElementById('discord-register');
    const googleLoginButton = document.getElementById('google-login');
    const discordLoginButton = document.getElementById('discord-login');

    if (googleRegisterButton) {
        googleRegisterButton.addEventListener('click', () => handleOAuthRegister('google'));
    }

    if (discordRegisterButton) {
        discordRegisterButton.addEventListener('click', () => handleOAuthRegister('discord'));
    }

    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', () => handleOAuthLogin('google'));
    }

    if (discordLoginButton) {
        discordLoginButton.addEventListener('click', () => handleOAuthLogin('discord'));
    }
});
