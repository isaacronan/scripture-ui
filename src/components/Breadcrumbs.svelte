<script>
export let crumbs = [];
</script>
<nav>
    <ul>
        {#each crumbs as crumb}
            <li>
                <a class="link" href="{crumb.hash}"><i class="fas fa-chevron-left" />{crumb.label}</a>
            </li>
        {/each}
    </ul>
</nav>
<style>
a {
    color: var(--smartblue);
}

i {
    padding-right: var(--spacing-sm);
}

li + li {
    margin-left: var(--spacing-md);
}
</style>