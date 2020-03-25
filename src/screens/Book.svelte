<script>
import { onMount } from 'svelte';
import { getBookName } from '../utils/store';
import { bookPattern } from '../utils/routing';
import { getChapters } from '../utils/http';
import ItemList from '../components/ItemList.svelte';

let [ booknumber ] = bookPattern.getParams();
let chapters = [];

onMount(() => {
    getChapters(booknumber).then(data => {
        chapters = data[0].chapters;
    });
});
</script>
<article>
    <section>
        <h1>{$getBookName(booknumber)}</h1>
        {#if chapters.length}
            <ItemList
                items={chapters}
                getTitle={item => `Chapter ${item.chapternumber}`}
                getDescription={item => item.chapterdesc}
                getHref={item => `#/books/${booknumber}/chapters/${item.chapternumber}`}
            />
        {:else}
            <p>Loading...</p>
        {/if}
    </section>
</article>