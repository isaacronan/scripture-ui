<script>
import { onMount } from 'svelte';
import { getBookName, getBookDescription, currentChapters, currentBooknumber } from '../utils/store';
import { bookPattern, homeHash, booksHash, chapterHash } from '../utils/routing';
import { getChapters } from '../utils/http';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import Expandable from '../components/Expandable.svelte';

let [ booknumber ] = bookPattern.getParams();
let invalidBooknumber = false;

onMount(() => {
    initialize();
});

const initialize = () => {
    [ booknumber ] = bookPattern.getParams();
    if (booknumber !== $currentBooknumber) {
        currentBooknumber.set(booknumber);
        currentChapters.set([]);
        invalidBooknumber = false;
        getChapters($currentBooknumber).then(data => {
            currentChapters.set(data);
        }, () => {
            invalidBooknumber = true;
        });
    }
};
</script>
<svelte:window on:hashchange={initialize} />
<article>
    <section>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash },
            { label: 'Books', hash: booksHash }
        ]}/>
        <PatientContainer isFailed={invalidBooknumber} isWaiting={!$getBookName($currentBooknumber)}>
            <h1>{$getBookName($currentBooknumber)}</h1>
            {#if $getBookDescription($currentBooknumber)}
                <Expandable content={$getBookDescription($currentBooknumber)} showLabel="Show Description" hideLabel="Hide Description" />
            {/if}
        </PatientContainer>
        <PatientContainer isFailed={invalidBooknumber} isWaiting={$currentChapters.length === 0}>
            <ItemList
                items={$currentChapters}
                getTitle={item => `Chapter ${item.chapternumber}`}
                getDescription={item => item.chapterdesc}
                getHref={item => chapterHash($currentBooknumber, item.chapternumber)}
            />
        </PatientContainer>
    </section>
</article>