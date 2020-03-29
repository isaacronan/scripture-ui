<script>
import { onMount } from 'svelte';
import { getBookName, getBookDescription } from '../utils/store';
import { bookPattern, homeHash, booksHash, chapterHash } from '../utils/routing';
import { getChapters } from '../utils/http';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import Expandable from '../components/Expandable.svelte';

let [ booknumber ] = bookPattern.getParams();
let chapters = [];

onMount(() => {
    getChapters(booknumber).then(data => {
        chapters = data;
    });
});
</script>
<article>
    <section>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash },
            { label: 'Books', hash: booksHash }
        ]}/>
        <PatientContainer isWaiting={!$getBookName(booknumber)}>
            <h1>{$getBookName(booknumber)}</h1>
            <Expandable content={$getBookDescription(booknumber)} showLabel="Show Description" hideLabel="Hide Description" />
        </PatientContainer>
        <PatientContainer isWaiting={chapters.length === 0}>
            <ItemList
                items={chapters}
                getTitle={item => `Chapter ${item.chapternumber}`}
                getDescription={item => item.chapterdesc}
                getHref={item => chapterHash(booknumber, item.chapternumber)}
            />
        </PatientContainer>
    </section>
</article>