document.addEventListener('DOMContentLoaded', () => {
    const mangaId = new URLSearchParams(window.location.search).get('id');
    loadComments(mangaId);

    document.getElementById('comment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentInput = document.getElementById('comment-input').value;

        try {
            const response = await fetch('backend/add-comment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `manga_id=${mangaId}&content=${encodeURIComponent(commentInput)}`
            });

            const result = await response.json();
            if (result.success) {
                loadComments(mangaId); // Recarregar comentários após adicionar
                document.getElementById('comment-input').value = ''; // Limpar o campo de entrada
            } else {
                alert('Erro: ' + result.message);
            }
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
        }
    });
});

async function loadComments(mangaId) {
    try {
        const response = await fetch(`backend/get-comments.php?manga_id=${mangaId}`);
        const comments = await response.json();

        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = ''; // Limpar comentários anteriores

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <strong>${comment.username}</strong>
                <p>${comment.content}</p>
                <small>${new Date(comment.created_at).toLocaleString()}</small>
            `;
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}