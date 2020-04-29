import { accessToken } from './store';
import { get } from 'svelte/store';

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

const refresh = () => {
    const refreshPattern = /refresh=(\w+)/;
    const usernamePattern = /username=(\w+)/;
    if (!refreshPattern.test(document.cookie) || !usernamePattern.test(document.cookie)) {
        return Promise.reject();
    }

    const refresh = refreshPattern.exec(document.cookie)[1];
    const username = usernamePattern.exec(document.cookie)[1];
    return fetch(constructPostRequest('/api/user/refresh', {
        refresh,
        username
    })).then(checkStatusAndRespond).then(storeTokens(username));
};

export const login = (username, password) => fetch(constructPostRequest('/api/user/login', {
    username,
    password
})).then(checkStatusAndRespond).then(storeTokens(username));

export const getSubscriptions = () => fetchWithAuth(new Request('/api/subscriptions'));

const fetchWithAuth = (request) => {
    const fetchRequestWithAuth = token => fetch(request, {
        headers: {
            'X-Authorization': `Bearer ${token}`
        }
    });
    const retrieveToken = get(accessToken) ? Promise.resolve(get(accessToken)) : refresh();
    return retrieveToken.then(token => fetchRequestWithAuth(token)).then(response => {
        if (response.status === 401) {
            return refresh().then(token => fetchRequestWithAuth(token));
        }
        return response;
    }).then(checkStatusAndRespond);
};

const constructPostRequest = (url, body) => new Request(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
});

const storeTokens = username => ({ token, refresh }) => {
    accessToken.set(token);
    document.cookie = `refresh=${refresh}`;
    document.cookie = `username=${username}`;
    return token;
};