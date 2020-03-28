<script>
export let isWaiting = false;
</script>
<div>
    {#if isWaiting}
        <div>Loading...</div>
    {:else}
        <slot></slot>
    {/if}
</div>