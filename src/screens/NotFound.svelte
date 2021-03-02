<script>
import { homeHash } from '../utils/routing';
import Link from '../components/Link.svelte';
</script>
<article>
    <img alt="broken" height="100" src="/broken_red.svg">
    <h1>Page Not Found</h1>
    <Link><a class="link" href={homeHash}>Home</a></Link>
</article>
<style>
h1,
a {
    align-self: center;
}

img {
    margin-top: var(--spacing-lg);
}

h1 {
    margin: var(--spacing-md) 0;
}

a {
    color: var(--cyan);
}
</style>