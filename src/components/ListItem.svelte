<script>
export let isExpanded = false;
export let href = '';
export let title = '';
export let description = '';
</script>
<li>
    {#if description}
        <button on:click />
    {/if}
    <h4>{title}</h4>
    <a {href}>Go</a>
    {#if isExpanded && description}
        <p>{description}</p>
    {/if}
</li>
<style>
li {
    background-color: var(--white);
    border-radius: var(--radius);
    display: block;
    margin: var(--spacing-md) 0;
    padding: var(--spacing-md);
    position: relative;
}

h4 {
    color: var(--dark);
}

button {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
}

a {
    position: absolute;
    right: var(--spacing-md);
    top: calc(var(--spacing-md) + 2.7rem / 2 - 1.8rem / 2);
}

p {
    color: var(--dark);
    margin-top: var(--spacing-md);
}
</style>