const checkStatusAndRespond = (res) => {
    if (res.status !== 200) {
        return res.json().then(json => Promise.reject(json.error));
    }
    return res.json();
};

export const getBooks = () => fetch('/api/books').then(checkStatusAndRespond);
export const getChapters = (booknumber) => fetch(`/api/books/${booknumber}/chapters`).then(checkStatusAndRespond);
export const getVerses = (booknumber, chapternumber) => fetch(`/api/books/${booknumber}/chapters/${chapternumber}`).then(checkStatusAndRespond);

export const createAccount = (username, password) => fetch('/api/user/create', {
    method: 'POST',
    body: JSON.stringify({
        username,
        password
    }),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(checkStatusAndRespond);

export const login = (username, password) => fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({
        username,
        password
    }),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(checkStatusAndRespond);