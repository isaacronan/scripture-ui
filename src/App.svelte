<script>
import { onMount } from 'svelte';
import { books } from './utils/store';
import { homePattern, booksPattern, bookPattern, chapterPattern } from './utils/routing';
import { getBooks } from './utils/http';
import Home from './screens/Home.svelte';
import Books from './screens/Books.svelte';
import Book from './screens/Book.svelte';
import Chapter from './screens/Chapter.svelte';

let currentScreen = null;
const updateRoute = () => {
    if (homePattern.isMatch()) {
        currentScreen = Home;
    } else if (booksPattern.isMatch()) {
        currentScreen = Books   ;
    } else if (bookPattern.isMatch()) {
        currentScreen = Book;
    } else if(chapterPattern.isMatch()) {
        currentScreen = Chapter;
    } else {
        currentScreen = null;
    }
};

onMount(() => {
    getBooks().then((data) => {
        books.set(data);
    });
});
</script>

<svelte:head>
    <meta content="width=device-width" name="viewport">
</svelte:head>
<svelte:window on:popstate={updateRoute} on:load={updateRoute} on:hashchange={updateRoute} />

<svelte:component this={currentScreen} />
