<script>
import { onMount, setContext } from 'svelte';
import { accessToken, books, TOKEN_DNE } from './utils/store';
import { routeChangeEvent, getCurrentScreen } from './utils/routing';
import { getBooks, refresh } from './utils/http';
import Chapter from './screens/Chapter.svelte';
import Dashboard from './screens/Dashboard.svelte';
import CreateSubscription from './screens/CreateSubscription.svelte';
import EditSubscription from './screens/EditSubscription.svelte';
import Issue from './screens/Issue.svelte';
import ResetPassword from './screens/ResetPassword.svelte';
import DeleteAccount from './screens/DeleteAccount.svelte';
import UserNavigator from './components/UserNavigator.svelte';

export let prefetched = null;
export let initialRoute = null;
setContext('prefetched', prefetched);
setContext('initialRoute', initialRoute);

if (prefetched?.books) {
    books.set(prefetched.books);
}

if (prefetched?.token || prefetched?.token === TOKEN_DNE) {
    accessToken.set(prefetched.token);
}

let currentScreen = getCurrentScreen(initialRoute);
$: isLight = currentScreen === Chapter || currentScreen === Issue;
$: isLightAlt = currentScreen === Dashboard || currentScreen === CreateSubscription || currentScreen === EditSubscription || currentScreen === ResetPassword || currentScreen === DeleteAccount;

const changeRoute = (route) => {
    if (route !== window.location.pathname) {
        if (route) {
            window.history.pushState({}, '', route);
        }
        window.dispatchEvent(routeChangeEvent);
    }
};

setContext('changeRoute', changeRoute);

const syncScreenWithRoute = () => {
    currentScreen = getCurrentScreen();
    window.scrollTo(0, 0);
};

onMount(() => {
    if (window.__PREFETCHED__?.books) {
        books.set(window.__PREFETCHED__.books);
        delete window.__PREFETCHED__.books;
    } else {
        getBooks().then((data) => {
            books.set(data);
        });
    }

    refresh().catch(() => {});
});
</script>

<svelte:head>
    <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="mask-icon" color="#650505" href="/pinned-tab-icon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</svelte:head>
<svelte:window on:popstate={() => changeRoute()} on:routechange={syncScreenWithRoute} />

<div class:light={isLight} class:light-alt={isLightAlt} class="app">
    <UserNavigator isLight={isLight || isLightAlt} />
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