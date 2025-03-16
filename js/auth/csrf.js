// CSRF protection has been removed. Implement a JavaScript-based solution if necessary.

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
