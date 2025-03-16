// footer.js
async function initFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const response = await fetch('footer.html');
        const text = await response.text();
        const template = document.createElement('template');
        template.innerHTML = text;
        footerPlaceholder.replaceWith(template.content);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initFooter);

