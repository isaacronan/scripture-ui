<script>
import { getSubscriptions } from '../utils/http';
import { editSubscriptionHash } from '../utils/routing';
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
                    <ListItem primaryHref={editSubscriptionHash(subscription.id)} destinationHref="#" title={subscription.name} />
                {/each}
            </ul>
        </PatientContainer>
    </section>
</article>
<style>
article {
    color: var(--dark);
}
</style>