<script>
export let isExpanded = false;
export let primaryHref = '';
export let destinationHref = '';
export let title = '';
export let description = '';
</script>
<li>
    {#if primaryHref}
        <a class="plain-button primary" href={primaryHref}>
            <i class="fas fa-cog"/>
        </a>
    {:else if description}
        <button class="plain-button primary" on:click>
            <i class="fas fa-{isExpanded ? 'minus' : 'plus'}-circle"/>
        </button>
    {/if}
    <h4>{title}</h4>
    <a class="link destination" href={destinationHref}><i class="fas fa-arrow-right"/></a>
    {#if isExpanded && description}
        <p>{description}</p>
    {/if}
</li>
<style>
li {
    background-color: var(--white);
    border-radius: var(--radius);
    height: fit-content;
    padding: var(--spacing-md);
    position: relative;
}

h4 {
    color: var(--dark);
    margin-left: calc(2rem + var(--spacing-md));
}

.primary {
    color: var(--light);
    font-size: 2rem;
    left: var(--spacing-md);
    position: absolute;
    top: calc(var(--spacing-md) + var(--lh-big) / 2 - var(--lh-normal) / 2 - 1px);
}

.destination {
    color: var(--cyan);
    font-size: 2rem;
    position: absolute;
    right: var(--spacing-md);
    top: calc(var(--spacing-md) + var(--lh-big) / 2 - var(--lh-normal) / 2 - 1px);
}

p {
    color: var(--dark);
    margin-top: var(--spacing-md);
}
</style>