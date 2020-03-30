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