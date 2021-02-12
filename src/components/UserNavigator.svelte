<script>
import { dashboardHash, homeHash, loginHash } from '../utils/routing';
import { logout, removeTokens } from '../utils/http';
import { accessToken, TOKEN_DNE } from '../utils/store';

export let isUserScreen = false;
export let isLight = false;

const handleLogout = () => {
    logout();
    removeTokens();
    window.location.hash = homeHash;
};
</script>
<nav class:light={isLight}>
    <div class="user-navigator">
        {#if $accessToken}
            <a class="plain-button" href={isUserScreen ? homeHash : dashboardHash}>
                <i class="fas fa-home" />
                {isUserScreen ? 'Home' : 'Dashboard'}
            </a>
        {/if}
        <div class="logout">
            {#if $accessToken}
                <button on:click={handleLogout} class="plain-button">
                    Log Out
                    <i class="fas fa-sign-out-alt" />
                </button>
            {:else if $accessToken === TOKEN_DNE}
                <a href={loginHash} class="plain-button">
                    Log In
                    <i class="fas fa-sign-in-alt" />
                </a>
            {/if}
        </div>
    </div>
</nav>
<style>
.user-navigator {
    background-color: var(--dark);
    display: flex;
    height: var(--lh-normal);
    padding: var(--spacing-md);
}

.light .user-navigator {
    background-color: var(--blue);
}

i {
    padding-right: var(--spacing-sm);
}

.logout i {
    padding-left: var(--spacing-sm);
    padding-right: 0;
}

.logout {
    flex-grow: 1;
    text-align: right;
}

a,
button {
    color: var(--white);
}
</style>