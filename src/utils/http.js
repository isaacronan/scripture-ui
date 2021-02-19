import { accessToken, TOKEN_DNE, subscriptions } from './store';
import { loginHash } from './routing';
import { get } from 'svelte/store';

const checkStatusAndRespond = (res) => {
    if (res.status !== 200) {
        return res.json().then(json => Promise.reject(json.error));
    }
    return res.json();
};

export const getBooks = () => fetch('/api/books').then(checkStatusAndRespond);
export const getChapters = (booknumber, numberOnly = false) => fetch(`/api/books/${booknumber}/chapters${numberOnly ? '?numberOnly=true' : ''}`).then(checkStatusAndRespond);
export const getVerses = (booknumber, chapternumber, numberOnly = false) => fetch(`/api/books/${booknumber}/chapters/${chapternumber}${numberOnly ? '?numberOnly=true' : ''}`).then(checkStatusAndRespond);

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

let pendingRefresh = null;
export const refresh =  () => {
    if (!pendingRefresh) {
        pendingRefresh = _refresh();
    }
    return pendingRefresh.then((...data) => {
        pendingRefresh = null;
        return Promise.resolve(...data);
    }, (...data) => {
        accessToken.set(TOKEN_DNE);
        pendingRefresh = null;
        return Promise.reject(...data);
    });
};

const _refresh = () => {
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
    const fetchRequestWithAuth = token => {
        const headers = new Headers(request.headers);
        headers.append('Authorization', `Bearer ${token}`);
        return fetch(request.clone(), { headers })
    }
    const retrieveToken = get(accessToken) ? Promise.resolve(get(accessToken)) : refresh();
    return retrieveToken.then(token => fetchRequestWithAuth(token)).then(response => {
        if (response.status === 401) {
            return refresh().then(token => fetchRequestWithAuth(token));
        }
        return response;
    }).then(checkStatusAndRespond, () => {
        const { origin, pathname } = window.location;
        window.location.replace(`${origin}${pathname}${loginHash}`);
    });
};

const constructPostRequest = (url, body) => new Request(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
});

const constructPutRequest = (url, body) => new Request(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
});

const constructDeleteRequest = (url) => new Request(url, {
    method: 'DELETE'
});

const storeTokens = username => ({ token, refresh }) => {
    accessToken.set(token);
    document.cookie = `refresh=${refresh}`;
    document.cookie = `username=${username}`;
    return token;
};

export const removeTokens = () => {
    accessToken.set(TOKEN_DNE);
    subscriptions.set(null);
    document.cookie = `refresh=; expires=${new Date(0).toUTCString()}`;
    document.cookie = `username=; expires=${new Date(0).toUTCString()}`;
};

export const createSubscription = (name, verseDosage, isChapterSubscription, bookPool) => fetchWithAuth(constructPostRequest('/api/subscriptions', {
    name,
    verseDosage,
    isChapterSubscription,
    bookPool
}));

export const updateSubscription = (id, name, verseDosage, isChapterSubscription, bookPool, currentIssue) => fetchWithAuth(constructPutRequest(`/api/subscriptions/${id}`, {
    name,
    verseDosage,
    isChapterSubscription,
    bookPool,
    currentIssue
}));

export const deleteSubscription = (id) => fetchWithAuth(constructDeleteRequest(`/api/subscriptions/${id}`));

export const logout = () => {
    const refreshPattern = /refresh=(\w+)/;
    const refresh = refreshPattern.test(document.cookie) ? refreshPattern.exec(document.cookie)[1] : null;
    return fetchWithAuth(constructPostRequest('/api/user/logout', { refresh }));
};

export const getSubscription = (id) => fetchWithAuth(new Request(`/api/subscriptions/${id}`));

export const resetPassword = (currentPassword, newPassword) => fetchWithAuth(constructPutRequest('/api/user/password', {
    currentPassword,
    newPassword
}));

export const deleteAccount = (password) => fetchWithAuth(constructPostRequest('/api/user/delete', {
    password
}));

export const getStats = (verseDosage, isChapterSubscription, bookPool, currentIssue) => fetch(constructPostRequest('/stats/subscription', {
    verseDosage,
    isChapterSubscription,
    bookPool,
    currentIssue
})).then(checkStatusAndRespond);