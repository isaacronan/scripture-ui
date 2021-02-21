<script>
import debounce from 'lodash/debounce';
import { ExpandableItem, formatNumber } from '../utils/misc';
import { books, oldBooks, newBooks, getShortName } from '../utils/store';
import { ALL, OLD, NEW, subscriptionNamePattern, TIMEOUT } from '../utils/constants';
import { createSubscription, updateSubscription, deleteSubscription, getChapters, getVerses , getStats} from '../utils/http';
import { dashboardHash } from '../utils/routing';
import NumericInput from '../components/NumericInput.svelte';
import ListItem from '../components/ListItem.svelte';
import Alert from '../components/Alert.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import WordCountPlot from '../components/WordCountPlot.svelte';

export let subscription = null;
export let isEdit = false;

const VERSEDOSAGE = 'VERSEDOSAGE';
const CURRENTCHAPTER = 'CURRENTCHAPTER';
const CURRENTVERSE = 'CURRENTVERSE';

let chapterMax = null;
let verseMax = null;
let stats = null;

let name = '';
let verseDosage = 2;
let isChapterSubscription = true;
let selectedBooknumbers = [];

let currentBook = null;
let currentChapter = null;
let currentVerse = null;

const hydrateForm = () => {
    name = subscription.name;
    verseDosage = subscription.verseDosage;
    isChapterSubscription = subscription.isChapterSubscription;
    selectedBooknumbers = subscription.bookPool;
    if (subscription.currentIssue) {
        currentBook = subscription.currentIssue.currentBook;
        currentChapter = subscription.currentIssue.currentChapter;
        currentVerse = subscription.currentIssue.currentVerse;
    } else {
        currentBook = selectedBooknumbers[0];
        currentChapter = 1;
        currentVerse = 1;
    }
};

$: if (subscription) {
    hydrateForm();
}

$: {
    verseDosage;
    isChapterSubscription;
    selectedBooknumbers;
    currentBook;
    currentChapter;
    currentVerse;
    fetchStats();
}

$: if (!selectedBooknumbers.find(booknumber => booknumber === currentBook)) {
    currentBook = selectedBooknumbers.length ? selectedBooknumbers[0] : null;
}

$: if (currentBook) {
    fetchChapters();
}

$: if (currentChapter) {
    fetchVerses();
}

let expandableBooks = [];

$: saveIsAllowed = subscriptionNamePattern.test(name) && necessaryFieldsAreValid;
$: necessaryFieldsAreValid = createFieldsAreValid && (!isEdit || isEdit && editFieldsAreValid);
$: createFieldsAreValid = verseDosage > 0 && selectedBooknumbers.length;
$: editFieldsAreValid = currentBook && currentChapter && currentVerse;

const handleNumericInputChange = field => (event) => {
    switch (field) {
        case VERSEDOSAGE:
            verseDosage = event.detail.value;
            break;
        case CURRENTCHAPTER:
            currentChapter = event.detail.value;
            break;
        case CURRENTVERSE:
            currentVerse = event.detail.value;
            break;
    }
};

const fetchChapters = debounce(() => {
    if (currentBook) {
        getChapters(currentBook, true).then(data => {
            chapterMax = data.length;
            currentChapter = Math.min(currentChapter, chapterMax);
        });
    }
}, TIMEOUT);

const fetchVerses = debounce(() => {
    if (currentBook && currentChapter) {
        getVerses(currentBook, currentChapter, true).then(data => {
            verseMax = data.length;
            currentVerse = Math.min(currentVerse, verseMax);
        });
    }
}, TIMEOUT);

const fetchStats = debounce(() => {
    if (necessaryFieldsAreValid) {
        const currentIssue = isEdit ? { currentBook, currentChapter, currentVerse } : { currentBook: selectedBooknumbers[0], currentChapter: 1, currentVerse: 1 };
        getStats(verseDosage, isChapterSubscription, selectedBooknumbers, currentIssue).then(data => {
            stats = data;
        });
    } else {
        stats = null;
    }
}, TIMEOUT);

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

const goToDashboard = () => window.location.hash = dashboardHash;

const handleSave = () => {
    if (isEdit) {
        updateSubscription(subscription.id, name, verseDosage, isChapterSubscription, selectedBooknumbers, {
            currentBook,
            currentChapter,
            currentVerse
        }).then(goToDashboard)
    } else {
        createSubscription(name, verseDosage, isChapterSubscription, selectedBooknumbers).then(goToDashboard)
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
    <Breadcrumbs crumbs={[
        { label: 'Dashboard', hash: dashboardHash }
    ]}/>
    <h2>{isEdit ? 'Edit': 'New'} Subscription</h2>
    <PatientContainer isDark={true} isWaiting={isEdit && !subscription || $books.length === 0}>
        <div class="flex-container">
            <div class="name">
                <div>Name</div>
                <input class="form-control" bind:value={name} type="text">
            </div>
            <div class="check-control type-toggle">
                <input id="isChapterSubscription" bind:group={isChapterSubscription} value={true} type="radio" >
                <label for="isChapterSubscription">
                    <i class="far fa-dot-circle"></i>
                    <i class="far fa-circle"></i>
                    Chapters
                </label>
                <input id="isVerseSubscription" bind:group={isChapterSubscription} value={false} type="radio" >
                <label for="isVerseSubscription">
                    <i class="far fa-dot-circle"></i>
                    <i class="far fa-circle"></i>
                    Verses
                </label>
            </div>
            <div class="verses">
                <div>{isChapterSubscription ? 'Chapters' : 'Verses'} per day</div>
                <NumericInput on:change={handleNumericInputChange(VERSEDOSAGE)} value={verseDosage} />
            </div>
        </div>
        <div class="flex-container">
            <div class="stats">
                <h3>Subscription Stats:</h3>
                <div>
                    <div class="stat">{#if stats}{formatNumber(stats.averagewords)}{:else}&mdash;{/if} <small>words per day</small></div>
                    <div class="stat">{#if stats}{formatNumber(stats.issues.length)}{:else}&mdash;{/if} <small>day{(!stats || stats.issues.length !== 1) ? 's' : ''}</small></div>
                </div>
                <WordCountPlot data={stats?.issues} getLabel={(_, i) => `Day ${i + 1}`} isDark={true} />
            </div>
        </div>
        {#if isEdit}
            <div class="flex-container edit">
                <div>
                    <div>Current Book</div>
                    <div class="select form-control">
                        <select bind:value={currentBook} class="form-control">
                            {#each selectedBooknumbers as booknumber (booknumber)}
                                <option value={booknumber}>{$getShortName(booknumber)}</option>
                            {/each}
                        </select>
                        <i class="fas fa-chevron-down" />
                    </div>
                </div>
                <div>
                    <div>Current Chapter</div>
                    <NumericInput on:change={handleNumericInputChange(CURRENTCHAPTER)} max={chapterMax} value={currentChapter} />
                </div>
                {#if !isChapterSubscription}
                    <div>
                        <div>Current Verse</div>
                        <NumericInput on:change={handleNumericInputChange(CURRENTVERSE)} max={verseMax} value={currentVerse} />
                    </div>
                {/if}
            </div>
        {/if}
        <div class="flex-container">
            <div class="presets">
                <button on:click={preset(ALL)} class="button alt">All</button>
                <button on:click={preset()} class="button alt">None</button>
                <button on:click={preset(OLD)} class="button alt">Old Testament</button>
                <button on:click={preset(NEW)} class="button alt">New Testament</button>
            </div>
            <div class="actions">
                {#if isEdit}
                    <button on:click={handleDelete} class="button negative">Delete</button>
                {/if}
                <a class="button alt negative" href={dashboardHash}>Cancel</a>
                <button on:click={handleSave} disabled={!saveIsAllowed} class="button">{isEdit ? 'Save' : 'Create'}</button>
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
                <ListItem showDescription={isExpanded} title={item.shortname} description={item.bookdesc}>
                    <button slot="left" class="icon icon-secondary" on:click={toggleExpanded(index)}>
                        <i class="fas fa-{isExpanded ? 'minus' : 'plus'}-circle"/>
                    </button>
                    <div slot="right" class="check-control icon icon-primary">
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

.edit > div {
    max-width: 100%;
}

input {
    box-sizing: border-box;
}

.select {
    display: inline-block;
    position: relative;
}

.select i {
    align-items: center;
    color: var(--cyan);
    display: flex;
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: var(--spacing-md);
    top: 2px;
}

.actions {
    display: flex;
}

.actions > * {
    flex-grow: 1;
}

.stats h3 {
    margin-right: var(--spacing-sm);
}

.stats > div {
    display: flex;
}

.stat {
    font-size: var(--fs-big);
    font-weight: 300;
    line-height: var(--lh-big);
    margin-right: var(--spacing-md);
}

.select i {
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

.type-toggle i {
    font-size: 2rem;
    padding-right: var(--spacing-sm);
}

.type-toggle label {
    align-items: center;
    display: inline-flex;
    margin-right: var(--spacing-sm);
}

.check-control input,
.check-control .fa-check-circle,
.check-control .fa-dot-circle {
    display: none;
}

.check-control input:checked + label .fa-check-circle {
    display: block;
}

.check-control input:checked + label .fa-dot-circle {
    display: inline-block;
}

.check-control input:checked + label .fa-circle {
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