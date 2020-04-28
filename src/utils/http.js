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
    return fetch('/api/user/refresh', {
        method: 'POST',
        body: JSON.stringify({
            refresh,
            username
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(checkStatusAndRespond).then(({ token, refresh }) => {
        accessToken.set(token);
        document.cookie = `refresh=${refresh}`;
        document.cookie = `username=${username}`;
        return token;
    });
};

export const login = (username, password) => fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({
        username,
        password
    }),
    headers: {
        'Content-Type': 'application/json'
    }
}).then(checkStatusAndRespond).then(({ token, refresh }) => {
    accessToken.set(token);
    document.cookie = `refresh=${refresh}`;
    document.cookie = `username=${username}`;
    return;
});

export const getSubscriptions = () => withAuth(new Request('/api/subscriptions'));

export const withAuth = async (request) => {
    if (!get(accessToken)) {
        await refresh();
    }

    const response = await fetch(request, {
        headers: {
            'X-Authorization': `Bearer ${get(accessToken)}`
        }
    });
    
    if (response.status === 401) {
        return refresh().then(() => fetch(request, {
            headers: {
                'X-Authorization': `Bearer ${get(accessToken)}`
            }
        })).then(checkStatusAndRespond);
    }

    return checkStatusAndRespond(response);
};