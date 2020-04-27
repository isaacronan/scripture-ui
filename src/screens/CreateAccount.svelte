<script>
import { homeHash, loginHash } from '../utils/routing';
import { createAccount, login } from '../utils/http';
import { accessToken } from '../utils/store';

let username = '';
let password = '';
let passwordConfirm = '';
let errorMessage = '';
let isCreated = false;

$: usernameIsValid = /^\w{3}\w*$/.test(username);
$: passwordIsValid = /^\S{3}\S*$/.test(password) && password === passwordConfirm;

const handleSubmit = () => {
    createAccount(username, password).then(() => {
        isCreated = true;
    }, (error) => {
        errorMessage = error;
    });
};

const handleLogin = () => {
    login(username, password).then(({ token, refresh }) => {
        $accessToken = token;
    });
};
</script>
<article>
    <h2>Create Account</h2>
    {#if errorMessage}
        <h3>{errorMessage}</h3>
    {/if}
    {#if !isCreated}
        <form on:submit|preventDefault={handleSubmit}>
            <div>
                <label for="username">Username</label>
                <input bind:value={username} id="username" type="text">
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
        <h3>Account Created!</h3>
        <div>
            <button on:click={handleLogin} class="button">Login</button>
        </div>
        <div>
            <a href={homeHash} class="button alt">Home</a>
        </div>
    {/if}
</article>
<style>
article {
    align-items: center;
    display: flex;
    flex-direction: column;
}

h2, h3 {
    margin-bottom: var(--spacing-md);
}

div {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--spacing-md);
}

form {
    max-width: 100%;
    width: 400px;
}

a {
    color: var(--cyan);
}
</style>