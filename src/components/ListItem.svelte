<script>
export let isExpanded = false;
export let href = '';
export let title = '';
export let description = '';
</script>
<li>
    {#if description}
        <button on:click>
            <i class="fas fa-{isExpanded ? 'minus' : 'plus'}-circle"/>
        </button>
    {/if}
    <h4>{title}</h4>
    <a {href}><i class="fas fa-arrow-right"/></a>
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
    margin-left: calc(2rem + var(--spacing-md));
}

button {
    color: var(--light);
    font-size: 2rem;
    left: var(--spacing-md);
    position: absolute;
    top: calc(var(--spacing-md) + 2.7rem / 2 - 1.8rem / 2 - 1px);
}

a {
    color: var(--cyan);
    font-size: 2rem;
    position: absolute;
    right: var(--spacing-md);
    top: calc(var(--spacing-md) + 2.7rem / 2 - 1.8rem / 2);
}

p {
    color: var(--dark);
    margin-top: var(--spacing-md);
}
</style>