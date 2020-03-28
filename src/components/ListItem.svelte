<script>
export let isExpanded = false;
export let href = '';
export let title = '';
export let description = '';
</script>
<li>
    {#if description}
        <button on:click>{isExpanded ? '-' : '+'}</button>
    {/if}
    <a {href}>{title}</a>
    {#if isExpanded && description}
        <p>{description}</p>
    {/if}
</li>