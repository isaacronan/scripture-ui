<script>
import { onMount } from 'svelte';
import { getShortName, getChapterDescription, currentBooknumber, currentChapters } from '../utils/store';
import { chapterPattern, homeHash, booksHash, bookHash } from '../utils/routing';
import { getChapters, getVerses } from '../utils/http';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import VerseList from '../components/VerseList.svelte';
import Expandable from '../components/Expandable.svelte';

let [ booknumber, chapternumber ] = chapterPattern.getParams();
let verses = [];

onMount(() => {
    if (booknumber !== $currentBooknumber) {
        currentBooknumber.set(booknumber);
        currentChapters.set([]);
        getChapters($currentBooknumber).then(data => {
            currentChapters.set(data);
        });
    }

    getVerses($currentBooknumber, chapternumber).then(data => {
        verses = data;
    });
});
</script>
<article>
    <section>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash },
            { label: 'Books', hash: booksHash },
            { label: $getShortName($currentBooknumber), hash: bookHash($currentBooknumber) }
        ]}/>
        <PatientContainer isWaiting={!$getShortName($currentBooknumber)}>
            <h1>{$getShortName($currentBooknumber)} {chapternumber}</h1>
            {#if $getChapterDescription(chapternumber)}
                <Expandable content={$getChapterDescription(chapternumber)} showLabel="Show Description" hideLabel="Hide Description" />
            {/if}
        </PatientContainer>
        <PatientContainer isWaiting={verses.length === 0}>
            <VerseList {verses} />
        </PatientContainer>
    </section>
</article>