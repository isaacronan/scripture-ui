<script>
import { homeHash, loginHash } from '../utils/routing';
import { createAccount, login } from '../utils/http';
import Alert from '../components/Alert.svelte';

let username = '';
let password = '';
let passwordConfirm = '';
let serverMessage = '';
let isCreated = false;

$: usernameIsValid = /^\w{3}\w*$/.test(username);
$: passwordIsValid = /^\S{3}\S*$/.test(password) && password === passwordConfirm;

const handleSubmit = () => {
    createAccount(username, password).then(({ message }) => {
        isCreated = true;
        serverMessage = message;
    }, (error) => {
        serverMessage = error;
    });
};

const handleLogin = () => {
    login(username, password).then(() => {
        window.location.href = dashboardHash;
    });
};
</script>
<article>
    <h2>Create Account</h2>
    {#if !isCreated}
        {#if serverMessage}
            <Alert isError message={serverMessage} />
        {/if}
        <form on:submit|preventDefault={handleSubmit}>
            <div>
                <label for="username">Username</label>
                <input on:input={serverMessage = ''} bind:value={username} id="username" type="text">
            </div>
            <div>
                <label for="password">Password</label>
                <input bind:value={password} id="password" type="password">
            </div>
            <div>
                <label for="passwordConfirm">Confirm Password</label>
                <input bind:value={passwordConfirm} id="passwordConfirm" type="password">
            </div>
            <div>
                <button type="submit" disabled={!usernameIsValid || !passwordIsValid} class="button">Create Account</button>
            </div>
        </form>
        <a href={loginHash} class="link">Login</a>
    {:else}
        <Alert message={serverMessage} />
        <div class="next-steps">
            <div>
                <button on:click={handleLogin} class="button">Login</button>
            </div>
            <div>
                <a href={homeHash} class="button alt">Home</a>
            </div>
        </div>
    {/if}
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

form,
.next-steps {
    max-width: 100%;
    width: 400px;
}

a {
    color: var(--cyan);
}
</style>