<script>
export let showDescription = false;
export let title = '';
export let description = '';
</script>
<li>
    <div class="left">
        <slot name="left"></slot>
    </div>
    <h4>{title}</h4>
    <div class="right">
        <slot name="right"></slot>
    </div>
    
    {#if showDescription && description}
        <p>{description}</p>
    {/if}
</li>
<style>
li {
    background-color: var(--white);
    border: 1px solid var(--light);
    border-radius: var(--radius);
    height: fit-content;
    padding: var(--spacing-md);
    position: relative;
}

h4 {
    color: var(--dark);
    margin-left: calc(2rem + var(--spacing-md));
}

.left {
    left: var(--spacing-md);
    position: absolute;
    top: calc(var(--spacing-md) + var(--lh-big) / 2 - var(--lh-normal) / 2 - 1px);
}

.right {
    position: absolute;
    right: var(--spacing-md);
    top: calc(var(--spacing-md) + var(--lh-big) / 2 - var(--lh-normal) / 2 - 1px);
}

p {
    color: var(--dark);
    margin-top: var(--spacing-md);
}
</style>