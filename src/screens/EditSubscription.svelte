<script>
import { getContext, onMount } from 'svelte';
import { subscriptions } from '../utils/store';
import { getSubscriptions } from '../utils/http';
import { editSubscriptionPattern, dashboardHash } from '../utils/routing';
import CreateSubscription from './CreateSubscription.svelte';

const changeRoute = getContext('changeRoute');

let [editId] = editSubscriptionPattern.getParams(getContext('initialRoute'));
let subscription = null;

const prefetched = getContext('prefetched') || window.__PREFETCHED__;
if (prefetched?.subscriptions) {
    subscriptions.set(prefetched.subscriptions);
    subscription = $subscriptions.find(({ id }) => id === editId);
}

const checkSubscription = () => {
    if ($subscriptions && !subscription) {
        changeRoute(dashboardHash);
    }
}

onMount(() => {
    if (prefetched?.subscriptions) {
        delete prefetched.subscriptions;
    } else if (!$subscriptions) {
        getSubscriptions().then(data => {
            subscriptions.set(data);
            subscription = $subscriptions.find(({ id }) => id === editId);
            checkSubscription();
        });
    } else {
        subscription = $subscriptions.find(({ id }) => id === editId);
    }

    checkSubscription();
});
</script>
<CreateSubscription isEdit={true} {subscription} />