import { writable, derived } from 'svelte/store';

export const books = writable([]);

export const getBookName = derived(books, $books => (booknumber) => {
    const match = $books.find(book => book.booknumber === Number(booknumber));
    return match ? match.contentsname : '';
});

export const getShortName = derived(books, $books => (booknumber) => {
    const match = $books.find(book => book.booknumber === Number(booknumber));
    return match ? match.shortname : '';
});