<script>
import { ExpandableItem } from '../utils/models';
import { books, oldBooks, newBooks, getShortName } from '../utils/store';
import { ALL, OLD, NEW } from '../utils/constants';
import { createSubscription, updateSubscription, deleteSubscription } from '../utils/http';
import { dashboardHash } from '../utils/routing';
import NumericInput from '../components/NumericInput.svelte';
import ListItem from '../components/ListItem.svelte';
import Alert from '../components/Alert.svelte';
import PatientContainer from '../components/PatientContainer.svelte';

export let subscription = null;
export let isEdit = false;

let name = '';
let verseDosage = 10;
let selectedBooknumbers = [];

const hydrateForm = () => {
    name = subscription.name;
    verseDosage = subscription.verseDosage;
    selectedBooknumbers = subscription.bookPool;
};
$: if (subscription) {
    hydrateForm();
}

let expandableBooks = [];

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

const goToDashboard = () => window.location.href = dashboardHash;

const handleSave = () => {
    if (isEdit) {
        updateSubscription(subscription.id, name, verseDosage, selectedBooknumbers).then(goToDashboard)
    } else {
        createSubscription(name, verseDosage, selectedBooknumbers).then(goToDashboard)
    }
};

const handleDelete = () => {
    deleteSubscription(subscription.id).then(goToDashboard)
}
</script>
<svelte:head>
<style>
:root {
    min-height: 100%;
}
</style>
</svelte:head>
<article>
    <h2>{isEdit ? 'Edit': 'New'} Subscription</h2>
    <PatientContainer isDark={true} isWaiting={isEdit && !subscription}>
        <div class="flex-container">
            <div class="name">
                <div>Name</div>
                <input bind:value={name} type="text">
            </div>
            <div class="verses">
                <div>Verses per day</div>
                <NumericInput on:change={handleVerseDosageChange} value={verseDosage} />
            </div>
        </div>
        <div class="flex-container">
            <div class="presets">
                <button on:click={preset(ALL)} class="button alt">All</button>
                <button on:click={preset()} class="button alt">None</button>
                <button on:click={preset(OLD)} class="button alt">Old Testament</button>
                <button on:click={preset(NEW)} class="button alt">New Testament</button>
            </div>
            <div class="actions">
                {#if isEdit}
                    <button on:click={handleDelete} class="button negative"><i class="fas fa-trash-alt" /></button>
                {/if}
                <a class="button alt negative" href={dashboardHash}>Cancel</a>
                <button on:click={handleSave} disabled={!isValid} class="button">{isEdit ? 'Save' : 'Create'}</button>
            </div>
        </div>
        <div class="selected-books">
            {#if !selectedBooknumbers.length}
                <div>
                    <Alert isError message="No books selected." />
                </div>
            {:else}
                <ul>
                    {#each selectedBooknumbers as booknumber (booknumber)}
                        <li>
                            <button on:click={handleRemove(booknumber)} class="list-button"><i class="fas fa-times" />{$getShortName(booknumber)}</button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </PatientContainer>
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

.flex-container {
    align-items: flex-end;
    display: flex;
    flex-wrap: wrap;
}

.flex-container > div {
    box-sizing: border-box;
    flex-basis: 100%;
    margin-bottom: var(--spacing-md);
}

.flex-container .presets {
    flex-basis: calc(100% + 2 * var(--spacing-sm));
}

.verses {
    max-width: 100%;
}

.name {
    max-width: 100%;
}

input {
    box-sizing: border-box;
    max-width: 100%;
    width: 400px;
}

.actions {
    display: flex;
}

.actions > * {
    flex-grow: 1;
}

.actions i {
    font-size: 2rem;
}

.actions .button + .button {
    margin-left: var(--spacing-sm);
}

.presets {
    display: flex;
    flex-wrap: wrap;
    margin: 0 calc(-1 * var(--spacing-xs)) var(--spacing-md);
    position: relative;
    top: var(--spacing-xs);
}

.presets .button {
    flex-grow: 1;
}

.presets .button {
    margin: var(--spacing-xs);
}

.selected-books ul {
    margin: calc(-1 * var(--spacing-xs));
}

.grid-list {
    margin: var(--spacing-md) 0;;
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

@media screen and (min-width: 768px) {
    .flex-container .presets,
    .flex-container .actions {
        flex-basis: 0;
        flex-grow: 1;
    }

    .actions {
        margin-left: var(--spacing-md);
    }
}
</style>