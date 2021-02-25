<script>
import { getSubscriptions } from '../utils/http';
import { editSubscriptionHash, createSubscriptionHash, issueHash, resetHash, deleteHash } from '../utils/routing';
import { subscriptions } from '../utils/store';
import PatientContainer from '../components/PatientContainer.svelte';
import ListItem from '../components/ListItem.svelte';
import Alert from '../components/Alert.svelte';
import { getContext, onMount } from 'svelte';
import Link from '../components/Link.svelte';

const prefetched = getContext('prefetched') || window.__PREFETCHED__;
if (prefetched?.subscriptions) {
    subscriptions.set(prefetched.subscriptions);
}

onMount(() => {
    if (prefetched?.subscriptions) {
        delete prefetched.subscriptions;
    } else {
        subscriptions.set(null);
        getSubscriptions().then(data => {
            subscriptions.set(data);
        });
    }
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
                        <ListItem title={subscription.name}>
                            <div slot="left">
                                <Link>
                                    <a class="icon icon-secondary" href={editSubscriptionHash(subscription.id)}>
                                        <i class="fas fa-cog"/>
                                    </a>
                                </Link>
                            </div>
                            <div slot="right">
                                {#if !subscription.currentIssue}
                                    <small class="icon-primary">Completed</small>
                                {:else}
                                    <Link><a class="icon icon-primary" href={issueHash(subscription.id)}><i class="fas fa-arrow-right"/></a></Link>
                                {/if}
                            </div>
                        </ListItem>
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
                <Link><a href={createSubscriptionHash} class="plain-button"><i class="fas fa-plus" />New Subscription</a></Link>
            </div>
        </PatientContainer>
    </section>
    <section>
        <h2>Account Settings</h2>
        <div class="flex-container">
            <Link><a href={resetHash} class="button alt reset">Reset Password</a></Link>
            <Link><a href={deleteHash} class="button alt negative delete">Delete Account</a></Link>
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

.reset {
    margin-right: var(--spacing-xs);
}

.delete {
    margin-left: var(--spacing-xs);
}

@media screen and (min-width: 768px) {
    .flex-container > * {
        flex-basis: auto;
    }
}
</style>