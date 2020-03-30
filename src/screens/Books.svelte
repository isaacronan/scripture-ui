<script>
import { books, oldBooks, newBooks } from '../utils/store';
import { homeHash, bookHash } from '../utils/routing';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';

let showOld = true;
let showNew = true;
let visibleBooks = $books;
$: if (showOld && showNew) {
    visibleBooks = $books;
} else if (showOld) {
    visibleBooks = $oldBooks;
} else if (showNew) {
    visibleBooks = $newBooks;
} else {
    visibleBooks = [];
}
</script>
<article>
    <section>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash }
        ]}/>
        <h1>Books</h1>
        <div>
            <label><input bind:checked={showOld} type="checkbox">Old Testament</label>
            <label><input bind:checked={showNew} type="checkbox">New Testament</label>
        </div>
        <PatientContainer isWaiting={$books.length === 0}>
            <ItemList
                items={visibleBooks}
                getTitle={item => `${item.shortname}`}
                getDescription={item => item.bookdesc}
                getHref={item => bookHash(item.booknumber)}
            />
        </PatientContainer>
    </section>
</article>