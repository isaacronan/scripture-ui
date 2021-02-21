<script>
import { onMount } from 'svelte';
import { getBookName, getBookDescription, currentChapters, currentBooknumber, invalidBooknumberError } from '../utils/store';
import { bookPattern, homeHash, booksHash, chapterHash } from '../utils/routing';
import { getChapters } from '../utils/http';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import Expandable from '../components/Expandable.svelte';
import TextPlot from '../components/TextPlot.svelte';

let [ booknumber ] = bookPattern.getParams();

onMount(() => {
    initialize();
});

const initialize = () => {
    [ booknumber ] = bookPattern.getParams();
    if (booknumber !== $currentBooknumber) {
        currentBooknumber.set(booknumber);
        currentChapters.set([]);
        invalidBooknumberError.set('');
        getChapters($currentBooknumber).then(data => {
            currentChapters.set(data);
        }, (error) => {
            invalidBooknumberError.set(error);
        });
    }
};
</script>
<svelte:window on:hashchange={initialize} />
<article>
    <Breadcrumbs crumbs={[
        { label: 'Home', hash: homeHash },
        { label: 'Books', hash: booksHash }
    ]}/>
    <PatientContainer isShort={true} isFailed={$invalidBooknumberError} isWaiting={!$getBookName($currentBooknumber)}>
        <h2>{$getBookName($currentBooknumber)}</h2>
        {#if $currentChapters.length > 1}
            <TextPlot booknumber={$currentBooknumber} />
        {/if}
        {#if $getBookDescription($currentBooknumber)}
            <Expandable content={$getBookDescription($currentBooknumber)} showLabel="Show Description" hideLabel="Hide Description" />
        {/if}
    </PatientContainer>
    <PatientContainer isFailed={$invalidBooknumberError} errorMessage={$invalidBooknumberError} isWaiting={$currentChapters.length === 0}>
        <ItemList
            items={$currentChapters}
            getTitle={item => `Chapter ${item.chapternumber}`}
            getDescription={item => item.chapterdesc}
            getHref={item => chapterHash($currentBooknumber, item.chapternumber)}
        />
    </PatientContainer>
</article>