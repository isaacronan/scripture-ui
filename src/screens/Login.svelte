<script>
import { login } from '../utils/http';
import { createAccountHash, dashboardHash, homeHash } from '../utils/routing';
import Alert from '../components/Alert.svelte';

let username = '';
let password = '';
let errorMessage = '';

const handleLogin = () => {
    login(username, password).then(() => {
        window.location.href = dashboardHash;
    }, (error) => {
        errorMessage = error;
    });
};
</script>
<article>
    <h2>Login</h2>
    {#if errorMessage}
        <div class="spacing-bottom">
            <Alert isError message={errorMessage} />
        </div>
    {/if}
    <form class="form-control" on:submit|preventDefault={handleLogin}>
        <div>
            <label for="username">Username</label>
            <input on:input={errorMessage = ''} bind:value={username} id="username" type="text">
        </div>
        <div>
            <label for="password">Password</label>
            <input on:input={errorMessage = ''} bind:value={password} id="password" type="password">
        </div>
        <div>
            <button type="submit" class="button" disabled={!username || !password}>Login</button>
        </div>
        <div>
            <a href={homeHash} class="button alt">Home</a>
        </div>
    </form>
    <a href={createAccountHash} class="link">Create an account</a>
</article>
<style>
article {
    align-items: center;
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

a {
    color: var(--cyan);
}
</style>