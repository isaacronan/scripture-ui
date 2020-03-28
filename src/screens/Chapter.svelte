<script>
import { onMount } from 'svelte';
import { getShortName } from '../utils/store';
import { chapterPattern, homeHash, booksHash, bookHash } from '../utils/routing';
import { getChapter } from '../utils/http';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';

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
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash },
            { label: 'Books', hash: booksHash },
            { label: $getShortName(booknumber), hash: bookHash(booknumber) }
        ]}/>
        <h1>{$getShortName(booknumber)} {chapternumber}</h1>
        <PatientContainer isWaiting={verses.length === 0}>
            {#each verses as verse}
                <p>
                    <small>{verse.versenumber}</small>
                    {verse.text}
                </p>
            {/each}
        </PatientContainer>
    </section>
</article>