<script>
import { onMount } from 'svelte';
import { subscriptions } from '../utils/store';
import { getSubscriptions } from '../utils/http';
import { editSubscriptionPattern } from '../utils/routing';
import CreateSubscription from './CreateSubscription.svelte';

const [editId] = editSubscriptionPattern.getParams();
$: subscription = $subscriptions ? $subscriptions.find(({ id }) => id === editId) : null;

onMount(() => {
    if (!$subscriptions) {
        getSubscriptions().then(data => {
            subscriptions.set(data);
        });
    }
});
</script>
<CreateSubscription isEdit={true} {subscription} />