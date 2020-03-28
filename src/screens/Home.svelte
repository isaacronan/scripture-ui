<script>
import { books } from '../utils/store';
import { booksHash, bookHash } from '../utils/routing';
import PatientContainer from '../components/PatientContainer.svelte';
</script>
<article>
    <h1>Subscription</h1>
    <h3>A way to do stuff</h3>
    <section>
        <h2>Search</h2>
        <div>
            <input type="text">
        </div>
    </section>
    <section>
        <h2>Books</h2>
        <div>
            <a href={booksHash}>Detail View</a>
        </div>
        <PatientContainer isWaiting={$books.length === 0}>
            <ul>
                {#each $books as { shortname, booknumber }}
                    <li>
                        <a href={bookHash(booknumber)}>{shortname}</a>
                    </li>
                {/each}
            </ul>
        </PatientContainer>
    </section>
</article>