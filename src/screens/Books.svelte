<script>
import { books, oldBooks, newBooks } from '../utils/store';
import { homeHash, bookHash } from '../utils/routing';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';

const ALL = 'ALL', OLD = 'OLD', NEW = 'NEW';

let bookSubset = ALL;
let visibleBooks = $books;
$: switch (bookSubset) {
    case ALL:
        visibleBooks = $books; break;
    case OLD:
        visibleBooks = $oldBooks; break;
    case NEW: 
        visibleBooks = $newBooks; break;
    default:
        visibleBooks = $books;
}
</script>
<article>
    <section>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash }
        ]}/>
        <h1>Books</h1>
        <div>
            <label><input type="radio" bind:group={bookSubset} value={ALL}>All</label>
            <label><input type="radio" bind:group={bookSubset} value={OLD}>Old Testament</label>
            <label><input type="radio" bind:group={bookSubset} value={NEW}>New Testament</label>
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