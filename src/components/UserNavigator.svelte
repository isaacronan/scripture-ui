<script>
import {
    dashboardHash,
    homeHash,
    loginHash,
    loginPattern,
    dashboardPattern,
    createSubscriptionPattern,
    editSubscriptionPattern,
    issuePattern,
    resetPattern,
    deletePattern,
} from '../utils/routing';
import { logout, removeTokens } from '../utils/http';
import { accessToken, TOKEN_DNE } from '../utils/store';
import Link from './Link.svelte';
import { getContext } from 'svelte';

export let isLight = false;

const changeRoute = getContext('changeRoute');

const handleLogout = () => {
    logout().then(removeTokens, removeTokens);
    changeRoute(homeHash);
};

const getIsUserScreen = (defaultRoute = '') => !![dashboardPattern, createSubscriptionPattern, editSubscriptionPattern, issuePattern, resetPattern, deletePattern]
    .find(pattern => pattern.isMatch(defaultRoute));

const handleRouteChange = () => {
    isUserScreen = getIsUserScreen()
    isLoginScreen = loginPattern.isMatch();
};

let isUserScreen = getIsUserScreen(getContext('initialRoute'));
let isLoginScreen = loginPattern.isMatch(getContext('initialRoute'));
</script>
<svelte:window on:routechange={handleRouteChange} />
<nav class:light={isLight}>
    <div class="user-navigator">
        <div class="left">
            {#if $accessToken}
                <Link>
                    <a class="plain-button" href={isUserScreen ? homeHash : dashboardHash}>
                        <i class="fas fa-home" />
                        {isUserScreen ? 'Home' : 'Dashboard'}
                    </a>
                </Link>
            {/if}
        </div>
        <div class="center">
            <a href="/"><img alt="logo" height="20" src="/logo_light.svg"></a>
        </div>
        <div class="right">
            {#if $accessToken}
                <button on:click={handleLogout} class="plain-button">
                    Log Out
                    <i class="fas fa-sign-out-alt" />
                </button>
            {:else if $accessToken === TOKEN_DNE && !isLoginScreen}
                <Link>
                    <a href={loginHash} class="plain-button">
                        Log In
                        <i class="fas fa-sign-in-alt" />
                    </a>
                </Link>
            {/if}
        </div>
    </div>
</nav>
<style>
.user-navigator {
    align-items: center;
    background-color: var(--dark);
    display: flex;
    padding:
        var(--spacing-md)
        calc(var(--spacing-md) + env(safe-area-inset-right, 0))
        var(--spacing-md)
        calc(var(--spacing-md) + env(safe-area-inset-left, 0));
}

.user-navigator > div {
    display: flex;
    flex-basis: calc(100% / 3);
    flex-direction: column;
    flex-grow: 1;
}

.left {
    align-items: flex-start;
}

.center {
    align-items: center;
}

.center a {
    display: flex;
}

.right {
    align-items: flex-end;
}

.light .user-navigator {
    background-color: var(--blue);
}

i {
    padding-right: var(--spacing-sm);
}

.right i {
    padding-left: var(--spacing-sm);
    padding-right: 0;
}
a,
button {
    color: var(--white);
}
</style>