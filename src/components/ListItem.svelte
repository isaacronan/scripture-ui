<script>
export let isExpanded = false;
export let href = '';
export let title = '';
export let description = '';
</script>
<li>
    <button on:click>{isExpanded ? '-' : '+'}</button>
    <a {href}>{title}</a>
    {#if isExpanded}
        <p>{description}</p>
    {/if}
</li>