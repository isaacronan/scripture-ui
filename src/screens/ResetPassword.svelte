<script>
import { dashboardHash } from '../utils/routing';
import { resetPassword } from '../utils/http';
import { passwordPattern } from '../utils/constants';
import Alert from '../components/Alert.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import Link from '../components/Link.svelte';
import EncryptionInfo from '../components/EncryptionInfo.svelte';

let currentPassword = '';
let newPassword = '';
let newPasswordConfirm = '';
let serverMessage = '';
let isReset = false;

$: currentPasswordIsValid = passwordPattern.test(currentPassword);
$: passwordIsValid = passwordPattern.test(newPassword) && newPassword === newPasswordConfirm;

const handleSubmit = () => {
    resetPassword(currentPassword, newPassword).then(({ message }) => {
        isReset = true;
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
        <Breadcrumbs crumbs={[
            { label: 'Dashboard', hash: dashboardHash }
        ]}/>
    </div>
    <h2>Reset Password</h2>
    {#if !isReset}
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
                <label for="newPassword">New Password</label>
                <input on:input={serverMessage = ''} bind:value={newPassword} id="newPassword" type="password">
            </div>
            <div>
                <label for="newPasswordConfirm">Confirm New Password</label>
                <input on:input={serverMessage = ''} bind:value={newPasswordConfirm} id="newPasswordConfirm" type="password">
            </div>
            <div>
                <button type="submit" disabled={!currentPasswordIsValid || !passwordIsValid} class="button">Reset Password</button>
            </div>
        </form>
        <EncryptionInfo />
    {:else}
        <div class="spacing-bottom">
            <Alert message={serverMessage} />
        </div>
        <div class="next-steps form-control">
            <div>
                <Link><a href={dashboardHash} class="button">Dashboard</a></Link>
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