import { writable, derived } from 'svelte/store';

const bookIsOld = ({ booknumber }) => booknumber < 47

export const books = writable([]);

export const oldBooks = derived(books, $books => {
    return $books.filter(book => bookIsOld(book));
});

export const newBooks = derived(books, $books => {
    return $books.filter(book => !bookIsOld(book));
});

export const getBookName = derived(books, $books => (booknumber) => {
    const match = $books.find(book => book.booknumber === Number(booknumber));
    return match ? match.contentsname : '';
});

export const getShortName = derived(books, $books => (booknumber) => {
    const match = $books.find(book => book.booknumber === Number(booknumber));
    return match ? match.shortname : '';
});

export const getBookDescription = derived(books, $books => (booknumber) => {
    const match = $books.find(book => book.booknumber === Number(booknumber));
    return match ? match.bookdesc : '';
});

export const invalidBooknumberError = writable(null);
export const currentBooknumber = writable(null);
export const currentChapters = writable([]);

export const getChapterDescription = derived(currentChapters, $currentChapters => (chapternumber) => {
    const match = $currentChapters.find(chapter => chapter.chapternumber === Number(chapternumber));
    return match ? match.chapterdesc : '';
});