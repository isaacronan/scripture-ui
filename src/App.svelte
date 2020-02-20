<style>
h1 {
    color: var(--color);
}
</style>
<script>
    let value = false;

    function toggle() {
        value = !value;
    }
</script>

<h1 on:click={toggle}>{value}</h1>