<script>
import { getContext, onMount } from 'svelte';

let sibling = null;
const changeRoute = getContext('changeRoute');
const handleLinkClick = (event) => {
    event.preventDefault();
    changeRoute(event.currentTarget.pathname);
};

onMount(() => {
    sibling.nextElementSibling.addEventListener('click', handleLinkClick);
});
</script>
<span bind:this={sibling} />
<slot></slot>

<style>
    span {
        display: none;
    }
</style>