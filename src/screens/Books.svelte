<script>
import { books } from '../utils/store';
import ItemList from '../components/ItemList.svelte';
</script>
<article>
    <section>
        <h1>Books</h1>
        {#if $books.length}
            <ItemList
                items={$books}
                getTitle={item => `${item.shortname}`}
                getDescription={item => item.bookdesc}
                getHref={item => `#/books/${item.booknumber}`}
            />
        {:else}
            <p>Loading...</p>
        {/if}
    </section>
</article>