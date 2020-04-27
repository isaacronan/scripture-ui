<script>
import { onMount } from 'svelte';
import { books } from './utils/store';
import { homePattern, booksPattern, bookPattern, chapterPattern, createAccountPattern, loginPattern } from './utils/routing';
import { getBooks } from './utils/http';
import Home from './screens/Home.svelte';
import Books from './screens/Books.svelte';
import Book from './screens/Book.svelte';
import Chapter from './screens/Chapter.svelte';
import NotFound from './screens/NotFound.svelte';
import CreateAccount from './screens/CreateAccount.svelte';
import Login from './screens/Login.svelte';
import ChapterNavigator from './components/ChapterNavigator.svelte';

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
    } else if(createAccountPattern.isMatch()) {
        currentScreen = CreateAccount;
    } else if(loginPattern.isMatch()) {
        currentScreen = Login;
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
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
</svelte:head>
<svelte:window on:popstate={updateRoute} on:load={updateRoute} on:hashchange={updateRoute} />

<div class:light={currentScreen === Chapter} class="app">
    {#if currentScreen === Chapter}
        <ChapterNavigator />
    {/if}
    <svelte:component this={currentScreen} />
</div>

<style>
.app {
    background-color: var(--dark);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: var(--maxwidth);
    width: 100%;
}

.light {
    background-color: var(--white);
    --smartblue: var(--blue);
    --smartbody: var(--dark);
}
</style>