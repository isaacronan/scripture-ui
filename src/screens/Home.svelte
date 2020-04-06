<script>
import { books } from '../utils/store';
import { booksHash, bookHash } from '../utils/routing';
import PatientContainer from '../components/PatientContainer.svelte';
import QuickSearch from '../components/QuickSearch.svelte';
</script>
<article>
    <h1>Subscription</h1>
    <h3>A way to do stuff</h3>
    <section>
        <h2>Quick Search</h2>
        <div class="quick-search">
            <QuickSearch />
        </div>
    </section>
    <section>
        <h2>Books</h2>
        <div>
            <a class="link" href={booksHash}>Detail View</a>
        </div>
        <PatientContainer isWaiting={$books.length === 0}>
            <ul>
                {#each $books as { shortname, booknumber }}
                    <li>
                        <a  class="list-button" href={bookHash(booknumber)}>{shortname}</a>
                    </li>
                {/each}
            </ul>
        </PatientContainer>
    </section>
</article>
<style>
h1, h3 {
    color: var(--cyan);
    text-align: center;
}

h1 {
    margin-bottom: var(--spacing-sm);
    margin-top: var(--spacing-lg);
}

h3 {
    margin-bottom: var(--spacing-lg);
}

section {
    background-color: var(--beige);
    border-radius: var(--radius);
    color: var(--dark);
    padding: var(--spacing-lg);
    text-align: center;
}

section + section {
    margin-top: var(--spacing-md);
}

section:last-of-type {
    margin-bottom: var(--spacing-md);
}

.link {
    color: var(--blue);
    margin-bottom: var(--spacing-md);
}

.quick-search {
    margin-top: var(--spacing-md);
}
</style>