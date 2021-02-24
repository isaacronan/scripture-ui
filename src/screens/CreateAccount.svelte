<script>
import { homeHash, loginHash, dashboardHash } from '../utils/routing';
import { createAccount, login } from '../utils/http';
import { usernamePattern, passwordPattern } from '../utils/constants';
import Alert from '../components/Alert.svelte';
import Link from '../components/Link.svelte';
import { getContext } from 'svelte';

const changeRoute = getContext('changeRoute');

let username = '';
let password = '';
let passwordConfirm = '';
let serverMessage = '';
let isCreated = false;

$: usernameIsValid = usernamePattern.test(username);
$: passwordIsValid = passwordPattern.test(password) && password === passwordConfirm;

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
        changeRoute(dashboardHash);
    });
};
</script>
<article>
    <h2>Create Account</h2>
    {#if !isCreated}
        {#if serverMessage}
            <div class="spacing-bottom">
                <Alert isError message={serverMessage} />
            </div>
        {/if}
        <form class="form-control" on:submit|preventDefault={handleSubmit}>
            <div>
                <label for="username">Username</label>
                <input on:input={serverMessage = ''} bind:value={username} id="username" type="text">
            </div>
            <div>
                <label for="password">Password</label>
                <input on:input={serverMessage = ''} bind:value={password} id="password" type="password">
            </div>
            <div>
                <label for="passwordConfirm">Confirm Password</label>
                <input on:input={serverMessage = ''} bind:value={passwordConfirm} id="passwordConfirm" type="password">
            </div>
            <div>
                <button type="submit" disabled={!usernameIsValid || !passwordIsValid} class="button">Create Account</button>
            </div>
            <div>
                <Link><a href={homeHash} class="button alt">Home</a></Link>
            </div>
        </form>
        <Link><a href={loginHash} class="link">Login</a></Link>
    {:else}
        <div class="spacing-bottom">
            <Alert message={serverMessage} />
        </div>
        <div class="next-steps form-control">
            <div>
                <button on:click={handleLogin} class="button">Login</button>
            </div>
            <div>
                <Link><a href={homeHash} class="button alt">Home</a></Link>
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

a {
    color: var(--cyan);
}
</style>