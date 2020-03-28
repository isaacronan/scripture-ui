<script>
import { onMount } from 'svelte';
import { getBookName } from '../utils/store';
import { bookPattern, homeHash, booksHash, chapterHash } from '../utils/routing';
import { getChapters } from '../utils/http';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';

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
        <h1>{$getBookName(booknumber)}</h1>
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