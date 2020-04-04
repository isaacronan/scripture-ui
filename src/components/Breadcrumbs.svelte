<script>
export let crumbs = [];
</script>
<nav>
    <ul>
        {#each crumbs as crumb}
            <li class="link"><a href="{crumb.hash}">{crumb.label}</a></li>
        {/each}
    </ul>
</nav>
<style>
a {
    color: var(--smartblue);
}
</style>