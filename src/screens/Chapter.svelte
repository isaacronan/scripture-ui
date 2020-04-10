<script>
import { onMount } from 'svelte';
import { getShortName, getChapterDescription, currentBooknumber, currentChapters, invalidBooknumberError } from '../utils/store';
import { chapterPattern, homeHash, booksHash, bookHash, chapterHash } from '../utils/routing';
import { getChapters, getVerses } from '../utils/http';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import VerseList from '../components/VerseList.svelte';
import Expandable from '../components/Expandable.svelte';

let [ booknumber, chapternumber ] = chapterPattern.getParams();
let verses = [];
let invalidChapternumberError = '';

onMount(() => {
    initialize();
});

const initialize = () => {
    [ booknumber, chapternumber ] = chapterPattern.getParams();
    verses = [];
    invalidChapternumberError = '';
    if (booknumber !== $currentBooknumber) {
        currentBooknumber.set(booknumber);
        currentChapters.set([]);
        invalidBooknumberError.set('');
        getChapters($currentBooknumber).then(data => {
            currentChapters.set(data);
        }, (error) => {
            invalidBooknumberError.set(error);
        });
    }

    getVerses($currentBooknumber, chapternumber).then(data => {
        verses = data;
    }, (error) => {
        invalidChapternumberError = error;
    });
};

$: nextChapter = $currentChapters.find(chapter => chapter.chapternumber > Number(chapternumber));
$: previousChapter = $currentChapters.filter(chapter => chapter.chapternumber < Number(chapternumber)).pop();
</script>
<svelte:window on:hashchange={initialize} />
<svelte:head>
<style>
    :root {
        height: 100%;
    }
</style>
</svelte:head>
<article>
        <div>
            <div class="chapter-navigator">
                {#if previousChapter}
                    <a class="plain-button" href={chapterHash($currentBooknumber, previousChapter.chapternumber)}>
                        <i class="fas fa-arrow-left" />
                        {$getShortName($currentBooknumber)} {previousChapter.chapternumber}
                    </a>
                {/if}
                {#if nextChapter}
                    <div class="next-chapter">
                        <a class="plain-button" href={chapterHash($currentBooknumber, nextChapter.chapternumber)}>
                            {$getShortName($currentBooknumber)} {nextChapter.chapternumber}
                            <i class="fas fa-arrow-right" />
                        </a>
                    </div>
                {/if}
            </div>
        </div>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash },
            { label: 'Books', hash: booksHash },
            { label: $getShortName($currentBooknumber), hash: bookHash($currentBooknumber) }
        ]}/>
        <PatientContainer isShort={true} isFailed={$invalidBooknumberError} isWaiting={!$getShortName($currentBooknumber)}>
            <h2>{$getShortName($currentBooknumber)} {chapternumber}</h2>
            {#if $getChapterDescription(chapternumber)}
                <Expandable content={$getChapterDescription(chapternumber)} showLabel="Show Description" hideLabel="Hide Description" />
            {/if}
        </PatientContainer>
        <PatientContainer isFailed={$invalidBooknumberError || invalidChapternumberError} errorMessage={$invalidBooknumberError || invalidChapternumberError} isWaiting={verses.length === 0}>
            <VerseList {verses} />
        </PatientContainer>
</article>
<style>
h2 {
    color: var(--dark);
}

.chapter-navigator {
    background-color: var(--blue);
    display: flex;
    margin-bottom: var(--spacing-md);
    margin-left: calc(-1 * var(--spacing-md));
    margin-top: calc(-1 * var(--spacing-md));
    min-height: var(--lh-normal);
    padding: var(--spacing-md);
    width: 100%;
}

i {
    padding-right: var(--spacing-sm);
}

.next-chapter i {
    padding-left: var(--spacing-sm);
    padding-right: 0;
}

.next-chapter {
    flex-grow: 1;
    text-align: right;
}

a {
    color: var(--white);
}
</style>