<script>
import { onMount } from 'svelte';
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
    resetPattern
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
import ChapterNavigator from './components/ChapterNavigator.svelte';
import UserNavigator from './components/UserNavigator.svelte';

let currentScreen = null;
$: isLight = currentScreen === Chapter || currentScreen === Issue;
$: isLightAlt = currentScreen === Dashboard || currentScreen === CreateSubscription || currentScreen === EditSubscription || currentScreen === ResetPassword;
$: isUserScreen = currentScreen === Dashboard || currentScreen === CreateSubscription || currentScreen === EditSubscription || currentScreen === Issue || currentScreen === ResetPassword;

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
    } else {
        currentScreen = NotFound;
    }

    window.scrollTo(0, 0);
};

onMount(() => {
    getBooks().then((data) => {
        books.set(data);
    });

    refresh();
});
</script>

<svelte:head>
    <meta content="width=device-width" name="viewport">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
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
}

.light {
    background-color: var(--white);
    --smartblue: var(--blue);
    --smartbody: var(--dark);
}

.light-alt {
    background-color: var(--beige);
    --smartblue: var(--blue);
}
</style>