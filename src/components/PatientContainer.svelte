<script>
export let isFailed = false;
export let isWaiting = false;
</script>
{#if isFailed}
    <div>Error!</div>
{:else if isWaiting}
    <div>Loading...</div>
{:else}
    <slot></slot>
{/if}