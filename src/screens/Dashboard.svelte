<script>
import { getSubscriptions } from '../utils/http';
import { editSubscriptionHash, createSubscriptionHash, issueHash, resetHash, deleteHash } from '../utils/routing';
import { subscriptions } from '../utils/store';
import PatientContainer from '../components/PatientContainer.svelte';
import ListItem from '../components/ListItem.svelte';
import { onMount } from 'svelte';

onMount(() => {
    subscriptions.set(null);
    getSubscriptions().then(data => {
        subscriptions.set(data);
    });
});
</script>
<svelte:head>
<style>
:root {
    min-height: 100%;
}
</style>
</svelte:head>
<article>
    <section>
        <h2>Subscriptions</h2>
        <PatientContainer isDark={true} isWaiting={!$subscriptions}>
            <ul class="grid-list">
                {#each $subscriptions as subscription}
                    <ListItem primaryHref={editSubscriptionHash(subscription.id)} destinationHref={issueHash(subscription.id)} title={subscription.name} />
                {/each}
            </ul>
            <div class="new">
                <a href={createSubscriptionHash} class="plain-button"><i class="fas fa-plus" />New Subscription</a>
            </div>
        </PatientContainer>
    </section>
    <section>
        <h2>Account Settings</h2>
        <a href={resetHash} class="button alt">Reset Password</a>
        <a href={deleteHash} class="button alt negative">Delete Account</a>
    </section>
</article>
<style>
article {
    color: var(--dark);
}

.new {
    margin: var(--spacing-md) 0 0 var(--spacing-md);
}

.new a {
    align-items: center;
    color: var(--cyan);
    display: flex;
}

.new i {
    font-size: 2rem;
    margin-right: var(--spacing-md);
}
</style>