<script>
import { onMount } from 'svelte';
import { books } from './utils/store';
import { homePattern, booksPattern, bookPattern, chapterPattern } from './utils/routing';
import { getBooks } from './utils/http';
import Home from './screens/Home.svelte';
import Books from './screens/Books.svelte';
import Book from './screens/Book.svelte';
import Chapter from './screens/Chapter.svelte';
import NotFound from './screens/NotFound.svelte';

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
        currentScreen = NotFound;
    }

    window.scrollTo(0, 0);
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

<div class:light={currentScreen === Chapter} class="app">
    <svelte:component this={currentScreen} />
</div>

<style>
.app {
    background-color: var(--dark);
    max-height: 100%;
    overflow-y: auto;
    padding: var(--spacing-md);
    width: 100%;
}

.light {
    background-color: var(--white);
    --smartblue: var(--blue);
    --smartbody: var(--dark);
}
</style>