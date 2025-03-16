const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://seusite.com/api';

export const api = {
    manga: {
        featured: () => fetch(`${API_URL}/manga/featured`).then(res => res.json()),
        latest: () => fetch(`${API_URL}/manga/latest`).then(res => res.json()),
        popular: () => fetch(`${API_URL}/manga/popular`).then(res => res.json()),
        getById: (id) => fetch(`${API_URL}/manga/${id}`).then(res => res.json()),
        getChapters: (mangaId) => fetch(`${API_URL}/manga/${mangaId}/chapters`).then(res => res.json()),
        create: (data) => fetch(`${API_URL}/manga`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        })
    },
    auth: {
        login: (credentials) => fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        }).then(res => res.json()),
        register: (userData) => fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }).then(res => res.json())
    },
    // Mangás
    getMangaList: () => fetch(`${API_URL}/manga`).then(res => res.json()),
    getChaptersByMangaId: (mangaId) => fetch(`${API_URL}/manga/${mangaId}/chapters`).then(res => res.json()),
    
    // Comentários
    getComments: (mangaId) => fetch(`${API_URL}/comments/${mangaId}`).then(res => res.json()),
    addComment: (mangaId, content) => fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mangaId, content })
    }).then(res => res.json()),

    // Ratings
    addRating: (mangaId, rating) => fetch(`${API_URL}/manga/${mangaId}/rate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating })
    }).then(res => res.json())
}; 