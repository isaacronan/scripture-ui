<script>
import { dashboardHash, homeHash } from '../utils/routing';
import { deleteAccount, removeTokens } from '../utils/http';
import Alert from '../components/Alert.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';

let currentPassword = '';
let serverMessage = '';
let isDeleted = false;

$: currentPasswordIsValid = /^\w{3}\w*$/.test(currentPassword);

const handleSubmit = () => {
    deleteAccount(currentPassword).then(({ message }) => {
        removeTokens();
        isDeleted = true;
        serverMessage = message;
    }, (error) => {
        serverMessage = error;
    });
};
</script>
<svelte:head>
<style>
:root {
    min-height: 100%;
}
</style>
</svelte:head>
<article>
    <div class="breadcrumbs">
        {#if !isDeleted}
            <Breadcrumbs crumbs={[
                { label: 'Dashboard', hash: dashboardHash }
            ]}/>
        {:else}
            <Breadcrumbs crumbs={[
                { label: 'Home', hash: homeHash }
            ]}/>
        {/if}
    </div>
    <h2>Delete Account</h2>
    {#if !isDeleted}
        {#if serverMessage}
            <div class="spacing-bottom">
                <Alert isError message={serverMessage} />
            </div>
        {/if}
        <form class="form-control" on:submit|preventDefault={handleSubmit}>
            <div>
                <label for="currentPassword">Current Password</label>
                <input on:input={serverMessage = ''} bind:value={currentPassword} id="currentPassword" type="password">
            </div>
            <div>
                <button type="submit" disabled={!currentPasswordIsValid} class="button negative">Delete Account</button>
            </div>
        </form>
    {:else}
        <div class="spacing-bottom">
            <Alert message={serverMessage} />
        </div>
        <div class="next-steps form-control">
            <div>
                <a href={homeHash} class="button">Home</a>
            </div>
        </div>
    {/if}
</article>
<style>
.breadcrumbs {
    align-self: flex-start;
}

article {
    align-items: center;
    color: var(--dark);
    display: flex;
    flex-direction: column;
}

h2 {
    margin-bottom: var(--spacing-md);
}

div {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--spacing-md);
}
</style>