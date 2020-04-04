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
        <h2>Books</h2>
        <div class="book-controls">
            <span><input id={ALL} type="radio" bind:group={bookSubset} value={ALL}><label for={ALL}>All</label></span>
            <span><input id={OLD} type="radio" bind:group={bookSubset} value={OLD}><label for={OLD}>Old Testament</label></span>
            <span><input id={NEW} type="radio" bind:group={bookSubset} value={NEW}><label for={NEW}>New Testament</label></span>
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
<style>
.book-controls {
    border-radius: var(--radius);
    border: 1px solid var(--cyan);
    display: flex;
    margin-bottom: var(--spacing-md);
}

span {
    width: calc(100% / 3);
}

label {
    color: var(--cyan);
    display: block;
    padding: var(--spacing-sm);
    text-align: center;
}

input:checked + label {
    background-color: var(--cyan);
    color: var(--white);
}

span + span {
    border-left: 1px solid var(--cyan);
    text-align: center;
}

input {
    display: none;
}
</style>