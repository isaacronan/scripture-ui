<script>
import { ExpandableItem } from '../utils/models';
import { books, oldBooks, newBooks, getShortName } from '../utils/store';
import { ALL, OLD, NEW } from '../utils/constants';
import NumericInput from '../components/NumericInput.svelte';
import ListItem from '../components/ListItem.svelte';
import Alert from '../components/Alert.svelte';
import PatientContainer from '../components/PatientContainer.svelte';

let name = '';
let verseDosage = 10;
let expandableBooks = [];
let selectedBooknumbers = [];

$: isValid = name && verseDosage > 0 && selectedBooknumbers.length;

const handleVerseDosageChange = (event) => {
    verseDosage = event.detail.value;
};

const hydrateExpandableBooks = () => expandableBooks = $books.map(book => new ExpandableItem(book));
$: {
    $books;
    hydrateExpandableBooks();
}

const toggleExpanded = (index) => () => {
    expandableBooks[index].toggleExpanded();
    expandableBooks = expandableBooks;    
};

const handleRemove = booknumber => () => {
    selectedBooknumbers = selectedBooknumbers.filter(selectedBooknumber => booknumber !== selectedBooknumber);
};

const preset = type => () => {
    switch (type) {
        case ALL:
            selectedBooknumbers = $books.map(({ booknumber }) => booknumber); break;
        case OLD:
            selectedBooknumbers = $oldBooks.map(({ booknumber }) => booknumber); break;
        case NEW:
            selectedBooknumbers = $newBooks.map(({ booknumber }) => booknumber); break;
        default:
            selectedBooknumbers = [];
    }
};
</script>
<svelte:head>
<style>
:root {
    min-height: 100%;
}
</style>
</svelte:head>
<article>
    <h2>New Subscription</h2>
    <div class="form">
        <div>
            <div for="name">Name</div>
            <input bind:value={name} id="name" type="text">
        </div>
        <div>
            <div>Verses per day</div>
            <NumericInput on:change={handleVerseDosageChange} value={verseDosage} />
        </div>
        <div class="actions">
            <button class="button alt negative">Cancel</button>
            <button disabled={!isValid} class="button">Create</button>
        </div>
        <div>
            <div>Presets</div>
            <div class="presets">
                <button on:click={preset(ALL)} class="button alt">All</button>
                <button on:click={preset()} class="button alt">None</button>
                <button on:click={preset(OLD)} class="button alt">Old Testament</button>
                <button on:click={preset(NEW)} class="button alt">New Testament</button>
            </div>
        </div>
    </div>
    {#if !selectedBooknumbers.length}
        <Alert isError message="No books selected." />
    {:else}
        <ul class="selected-books">
            {#each selectedBooknumbers as booknumber (booknumber)}
                <li>
                    <button on:click={handleRemove(booknumber)} class="list-button"><i class="fas fa-times" />{$getShortName(booknumber)}</button>
                </li>
            {/each}
        </ul>
    {/if}
    <PatientContainer isDark={true} isWaiting={$books.length === 0}>
        <ul class="grid-list">
            {#each expandableBooks as { item, isExpanded }, index}
                <ListItem on:click={toggleExpanded(index)} {isExpanded} title={item.shortname} description={item.bookdesc}>
                    <div class="book-check">
                        <input id="book-{item.booknumber}" value={item.booknumber} bind:group={selectedBooknumbers} type="checkbox">
                        <label for="book-{item.booknumber}">
                            <i class="far fa-check-circle"></i>
                            <i class="far fa-circle"></i>
                        </label>
                    </div>
                </ListItem>
            {/each}
        </ul>
    </PatientContainer>
    
</article>
<style>
article {
    color: var(--dark);
}

.form > div {
    margin-bottom: var(--spacing-md);
}
input {
    box-sizing: border-box;
    width: 100%;
}

.actions {
    align-items: flex-end;
    display: flex;
}

.actions button {
    flex-basis: 50%;
}

.actions button:first-child {
    margin-right: var(--spacing-xs);
}

.actions button:last-child {
    margin-left: var(--spacing-xs);
}

.presets {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: var(--spacing-md);
}

.presets .button {
    flex-grow: 1;
    margin: 0 var(--spacing-sm) var(--spacing-sm) 0;
}

.selected-books {
    left: calc(-1 * var(--spacing-xs));
    margin-bottom: var(--spacing-md);
    position: relative;
}

.fa-times {
    margin-right: var(--spacing-sm);
}

.book-check input,
.book-check .fa-check-circle {
    display: none;
}

.book-check input:checked + label .fa-check-circle {
    display: block;
}

.book-check input:checked + label .fa-circle {
    display: none;
}
</style>