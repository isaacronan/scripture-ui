<script>
import { getSubscriptions } from '../utils/http';
import { editSubscriptionHash, createSubscriptionHash, issueHash, resetHash, deleteHash } from '../utils/routing';
import { subscriptions } from '../utils/store';
import PatientContainer from '../components/PatientContainer.svelte';
import ListItem from '../components/ListItem.svelte';
import Alert from '../components/Alert.svelte';
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
            {#if $subscriptions.length}
                <ul class="grid-list">
                    {#each $subscriptions as subscription}
                        {#if !subscription.currentIssue}
                            <ListItem primaryHref={editSubscriptionHash(subscription.id)} title={subscription.name} isExpanded={true} description="Open settings to delete or reset.">
                                <div><small>Completed</small></div>
                            </ListItem>
                        {:else}
                            <ListItem primaryHref={editSubscriptionHash(subscription.id)} destinationHref={issueHash(subscription.id)} title={subscription.name} />
                        {/if}
                    {/each}
                </ul>
            {:else}
                <div class="flex-container">
                    <div>
                        <Alert isError message="No subscriptions!" />
                    </div>
                </div>
            {/if}
            <div class="new">
                <a href={createSubscriptionHash} class="plain-button"><i class="fas fa-plus" />New Subscription</a>
            </div>
        </PatientContainer>
    </section>
    <section>
        <h2>Account Settings</h2>
        <div class="flex-container">
            <a href={resetHash} class="button alt">Reset Password</a>
            <a href={deleteHash} class="button alt negative">Delete Account</a>
        </div>
    </section>
</article>
<style>
article {
    color: var(--dark);
}

section + section {
    margin-top: var(--spacing-md);
}

h2 {
    margin-bottom: var(--spacing-sm);
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

small {
    text-transform: uppercase;
}

.flex-container {
    display: flex;
}

.flex-container > * {
    flex-basis: 100%;
}

.flex-container a + a {
    margin-left: var(--spacing-sm);
}

@media screen and (min-width: 768px) {
    .flex-container > * {
        flex-basis: auto;
    }
}
</style>