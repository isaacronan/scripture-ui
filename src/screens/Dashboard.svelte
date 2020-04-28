<script>
import { getSubscriptions } from '../utils/http';
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
        <ul>
            {#each subscriptions as subscription}
                <li>{subscription.name}</li>
            {/each}
        </ul>
    </section>
</article>
<style>
article {
    color: var(--dark);
}
</style>