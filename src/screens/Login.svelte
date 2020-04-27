<script>
import { login } from '../utils/http';
import { accessToken } from '../utils/store';
import { createAccountHash } from '../utils/routing';

let username = '';
let password = '';
let errorMessage = '';

const handleLogin = () => {
    login(username, password).then(({ token, refresh }) => {
        $accessToken = token;
    }, (error) => {
        errorMessage = error;
    });
};
</script>
<article>
    <h2>Login</h2>
    {#if errorMessage}
        <h3>{errorMessage}</h3>
    {/if}
    <form on:submit|preventDefault={handleLogin}>
        <div>
            <label for="username">Username</label>
            <input bind:value={username} id="username" type="text">
        </div>
        <div>
            <label for="password">Password</label>
            <input bind:value={password} id="password" type="password">
        </div>
        <div>
            <button type="submit" class="button" disabled={!username || !password}>Login</button>
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