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

onMount(() => {
    if (booknumber !== $currentBooknumber) {
        currentBooknumber.set(booknumber);
        currentChapters.set([]);
        getChapters($currentBooknumber).then(data => {
            currentChapters.set(data);
        });
    }
});
</script>
<article>
    <section>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash },
            { label: 'Books', hash: booksHash }
        ]}/>
        <PatientContainer isWaiting={!$getBookName($currentBooknumber)}>
            <h1>{$getBookName($currentBooknumber)}</h1>
            {#if $getBookDescription($currentBooknumber)}
                <Expandable content={$getBookDescription($currentBooknumber)} showLabel="Show Description" hideLabel="Hide Description" />
            {/if}
        </PatientContainer>
        <PatientContainer isWaiting={$currentChapters.length === 0}>
            <ItemList
                items={$currentChapters}
                getTitle={item => `Chapter ${item.chapternumber}`}
                getDescription={item => item.chapterdesc}
                getHref={item => chapterHash($currentBooknumber, item.chapternumber)}
            />
        </PatientContainer>
    </section>
</article>