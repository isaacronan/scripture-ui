<script>
import { books, oldBooks, newBooks } from '../utils/store';
import { homeHash, bookHash } from '../utils/routing';
import { ALL, OLD, NEW } from '../utils/constants';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import TextPlot from '../components/TextPlot.svelte';

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
    <Breadcrumbs crumbs={[
        { label: 'Home', hash: homeHash }
    ]}/>
    <h2>Books</h2>
    <TextPlot />
    <div>
        <div class="book-controls">
            <span><input id={ALL} type="radio" bind:group={bookSubset} value={ALL}><label for={ALL}>All</label></span>
            <span><input id={OLD} type="radio" bind:group={bookSubset} value={OLD}><label for={OLD}>Old Testament</label></span>
            <span><input id={NEW} type="radio" bind:group={bookSubset} value={NEW}><label for={NEW}>New Testament</label></span>
        </div>
    </div>
    <PatientContainer isWaiting={$books.length === 0}>
        <ItemList
            items={visibleBooks}
            getTitle={item => `${item.shortname}`}
            getDescription={item => item.bookdesc}
            getHref={item => bookHash(item.booknumber)}
        />
    </PatientContainer>
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
    align-items: center;
    box-sizing: border-box;
    color: var(--cyan);
    display: flex;
    height: 100%;
    justify-content: space-around;
    padding: var(--spacing-sm);
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