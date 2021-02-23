<script>
import { onMount, setContext } from 'svelte';
import { books } from './utils/store';
import {
    homePattern,
    booksPattern,
    bookPattern,
    chapterPattern,
    createAccountPattern,
    loginPattern,
    dashboardPattern,
    createSubscriptionPattern,
    editSubscriptionPattern,
    issuePattern,
    resetPattern,
    deletePattern
} from './utils/routing';
import { getBooks, refresh } from './utils/http';
import Home from './screens/Home.svelte';
import Books from './screens/Books.svelte';
import Book from './screens/Book.svelte';
import Chapter from './screens/Chapter.svelte';
import NotFound from './screens/NotFound.svelte';
import CreateAccount from './screens/CreateAccount.svelte';
import Login from './screens/Login.svelte';
import Dashboard from './screens/Dashboard.svelte';
import CreateSubscription from './screens/CreateSubscription.svelte';
import EditSubscription from './screens/EditSubscription.svelte';
import Issue from './screens/Issue.svelte';
import ResetPassword from './screens/ResetPassword.svelte';
import DeleteAccount from './screens/DeleteAccount.svelte';
import UserNavigator from './components/UserNavigator.svelte';

export let prefetched = null;
// setContext('prefetched', prefetched || window.__PREFETCHED__);
if (prefetched) {
    books.set(prefetched.books);
}

let currentScreen = Home;
$: isLight = currentScreen === Chapter || currentScreen === Issue;
$: isLightAlt = currentScreen === Dashboard || currentScreen === CreateSubscription || currentScreen === EditSubscription || currentScreen === ResetPassword || currentScreen === DeleteAccount;
$: isUserScreen = currentScreen === Dashboard || currentScreen === CreateSubscription || currentScreen === EditSubscription || currentScreen === Issue || currentScreen === ResetPassword || currentScreen === DeleteAccount;

const updateRoute = () => {
    if (homePattern.isMatch()) {
        currentScreen = Home;
    } else if (booksPattern.isMatch()) {
        currentScreen = Books;
    } else if (bookPattern.isMatch()) {
        currentScreen = Book;
    } else if(chapterPattern.isMatch()) {
        currentScreen = Chapter;
    } else if(createAccountPattern.isMatch()) {
        currentScreen = CreateAccount;
    } else if(loginPattern.isMatch()) {
        currentScreen = Login;
    } else if(dashboardPattern.isMatch()) {
        currentScreen = Dashboard;
    } else if(createSubscriptionPattern.isMatch()) {
        currentScreen = CreateSubscription;
    } else if(editSubscriptionPattern.isMatch()) {
        currentScreen = EditSubscription;
    } else if(issuePattern.isMatch()) {
        currentScreen = Issue;
    } else if(resetPattern.isMatch()) {
        currentScreen = ResetPassword;
    } else if(deletePattern.isMatch()) {
        currentScreen = DeleteAccount;
    } else {
        currentScreen = NotFound;
    }

    window.scrollTo(0, 0);
};

onMount(() => {
    if (window.__PREFETCHED__) {
        books.set(window.__PREFETCHED__.books);
    } else {
        getBooks().then((data) => {
            books.set(data);
        });
    }

    refresh().then(() => {
        console.log('used refresh token');
    }, () => {
        console.log('no refresh token found');
    });
});
</script>

<svelte:head>
    <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="mask-icon" color="#650505" href="/pinned-tab-icon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</svelte:head>
<svelte:window on:popstate={updateRoute} on:load={updateRoute} on:hashchange={updateRoute} />

<div class:light={isLight} class:light-alt={isLightAlt} class="app">
    <UserNavigator isLight={isLight || isLightAlt} isUserScreen={isUserScreen} />
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
    padding-bottom: env(safe-area-inset-bottom, 0);
}

.light {
    background-color: var(--white);
    --smartblue: var(--blue);
    --smartbody: var(--dark);
}

.light-alt {
    background-color: var(--lighter);
    --smartblue: var(--blue);
}
</style>