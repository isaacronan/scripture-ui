<script>
import { getSubscriptions } from '../utils/http';
import ListItem from '../components/ListItem.svelte';
import { onMount } from 'svelte';

let subscriptions = [];

onMount(() => {
    getSubscriptions().then(data => {
        subscriptions = data;
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
        <ul class="grid-list">
            {#each subscriptions as subscription}
                <ListItem primaryHref="#" destinationHref="#" title={subscription.name} />
            {/each}
        </ul>
    </section>
</article>
<style>
article {
    color: var(--dark);
}
</style>