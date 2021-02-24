<script>
import { getContext, onDestroy, onMount } from 'svelte';

let sibling = null;
let element = null;
const changeRoute = getContext('changeRoute');
const handleLinkClick = (event) => {
    event.preventDefault();
    changeRoute(event.currentTarget.pathname);
};

onMount(() => {
    element = sibling.nextElementSibling;
    element.addEventListener('click', handleLinkClick);
    sibling.remove();
});

onDestroy(() => {
    element?.before(sibling);
});
</script>
<span bind:this={sibling} />
<slot></slot>

<style>
    span {
        display: none;
    }
</style>