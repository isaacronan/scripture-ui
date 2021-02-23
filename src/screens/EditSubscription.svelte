<script>
import { getContext, onMount } from 'svelte';
import { subscriptions } from '../utils/store';
import { getSubscriptions } from '../utils/http';
import { editSubscriptionPattern, dashboardHash } from '../utils/routing';
import CreateSubscription from './CreateSubscription.svelte';

const changeRoute = getContext('changeRoute');

let [editId] = editSubscriptionPattern.getParams();
$: subscription = $subscriptions ? $subscriptions.find(({ id }) => id === editId) : null;
$: if ($subscriptions && !subscription) {
    changeRoute(dashboardHash);
}

onMount(() => {
    if (!$subscriptions) {
        getSubscriptions().then(data => {
            subscriptions.set(data);
        });
    }
});
</script>
<CreateSubscription isEdit={true} {subscription} />