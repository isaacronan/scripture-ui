export const getBooks = () => fetch('/api/books').then(res => res.json());
export const getChapters = (booknumber) => fetch(`/api/books/${booknumber}/chapters`).then(res => res.json());
export const getVerses = (booknumber, chapternumber) => fetch(`/api/books/${booknumber}/chapters/${chapternumber}`).then(res => res.json());