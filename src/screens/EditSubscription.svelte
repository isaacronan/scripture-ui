<script>
import { onMount } from 'svelte';
import { subscriptions } from '../utils/store';
import { getSubscriptions } from '../utils/http';
import { editSubscriptionPattern, dashboardHash } from '../utils/routing';
import CreateSubscription from './CreateSubscription.svelte';

let [editId] = editSubscriptionPattern.getParams();
$: subscription = $subscriptions ? $subscriptions.find(({ id }) => id === editId) : null;
$: if ($subscriptions && !subscription) {
    window.location.hash = dashboardHash;
}

const initialize = () => {
    [editId] = editSubscriptionPattern.getParams()
};

onMount(() => {
    if (!$subscriptions) {
        getSubscriptions().then(data => {
            subscriptions.set(data);
        });
    }
});
</script>
<svelte:window on:hashchange={initialize} />
<CreateSubscription isEdit={true} {subscription} />