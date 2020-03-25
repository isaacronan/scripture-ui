<script>
import { books } from '../utils/store';
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
        <a href="#/books">Detail View</a>
        </div>
        <ul>
            {#each $books as { shortname, booknumber }}
                <li>
                    <a href="#/books/{booknumber}">{shortname}</a>
                </li>
            {/each}
        </ul>
    </section>
</article>