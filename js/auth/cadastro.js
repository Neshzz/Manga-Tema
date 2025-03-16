document.addEventListener('DOMContentLoaded', () => {
    const googleRegisterButton = document.getElementById('google-register');
    const discordRegisterButton = document.getElementById('discord-register');

    googleRegisterButton.addEventListener('click', () => {
        window.location.href = 'backend/register.php?provider=google';
    });

    discordRegisterButton.addEventListener('click', () => {
        window.location.href = 'backend/register.php?provider=discord';
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