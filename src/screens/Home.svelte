<script>
import { books } from '../utils/store';
import { booksHash, bookHash } from '../utils/routing';
import PatientContainer from '../components/PatientContainer.svelte';
import QuickSearch from '../components/QuickSearch.svelte';
</script>
<article>
    <h1>Scripture</h1>
    <h3>A digital transcription of the <span>Douay-Rheims</span> translation</h3>
    <section>
        <h2>Quick Search</h2>
        <QuickSearch />
    </section>
    <section>
        <h2>Books</h2>
        <div>
            <a class="link" href={booksHash}>Detail View</a>
        </div>
        <PatientContainer isDark={true} isWaiting={$books.length === 0}>
            <ul>
                {#each $books as { shortname, booknumber }}
                    <li>
                        <a class="list-button" href={bookHash(booknumber)}>{shortname}</a>
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
    margin: var(--spacing-sm) 0;
}

h3 {
    margin-bottom: var(--spacing-lg);
}

h3 span {
    white-space: nowrap;
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
</style>