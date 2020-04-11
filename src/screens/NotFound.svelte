<script>
import { homeHash } from '../utils/routing';
</script>
<article>
    <h1>Page not found!</h1>
    <a class="link" href={homeHash}>Home</a>
</article>
<style>
h1,
a {
    align-self: center;
}

h1 {
    margin-bottom: var(--spacing-sm);
    margin-top: var(--spacing-lg);
}

a {
    color: var(--cyan);
}
</style>