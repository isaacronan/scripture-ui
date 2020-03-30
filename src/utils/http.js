const checkStatusAndRespond = (res) => {
    if (res.status !== 200) {
        return Promise.reject();
    }
    return res.json();
};

export const getBooks = () => fetch('/api/books').then(checkStatusAndRespond);
export const getChapters = (booknumber) => fetch(`/api/books/${booknumber}/chapters`).then(checkStatusAndRespond);
export const getVerses = (booknumber, chapternumber) => fetch(`/api/books/${booknumber}/chapters/${chapternumber}`).then(checkStatusAndRespond);