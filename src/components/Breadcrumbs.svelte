<script>
export let crumbs = [];
</script>
<nav>
    <ul>
        {#each crumbs as crumb}
            <li><a href="{crumb.hash}">{crumb.label}</a></li>
        {/each}
    </ul>
</nav>