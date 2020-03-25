<script>
import { onMount } from 'svelte';
import { getShortName } from '../utils/store';
import { chapterPattern } from '../utils/routing';
import { getChapter } from '../utils/http';

let [ booknumber, chapternumber ] = chapterPattern.getParams();
let verses = [];

onMount(() => {
    getChapter(booknumber, chapternumber).then(data => {
        verses = data;
    });
}); 
</script>
<article>
    <section>
        <h1>{$getShortName(booknumber)} {chapternumber}</h1>
        <ul>
            {#each verses as verse}
                <li>
                    {verse.text}
                </li>
            {/each}
        </ul>
    </section>
</article>