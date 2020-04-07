<script>
import { onMount } from 'svelte';
import { getShortName, getChapterDescription, currentBooknumber, currentChapters } from '../utils/store';
import { chapterPattern, homeHash, booksHash, bookHash, chapterHash } from '../utils/routing';
import { getChapters, getVerses } from '../utils/http';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import VerseList from '../components/VerseList.svelte';
import Expandable from '../components/Expandable.svelte';

let [ booknumber, chapternumber ] = chapterPattern.getParams();
let verses = [];
let invalidBooknumber = false;
let invalidChapternumber = false;

onMount(() => {
    initialize();
});

const initialize = () => {
    [ booknumber, chapternumber ] = chapterPattern.getParams();
    verses = [];
    invalidChapternumber = false;
    if (booknumber !== $currentBooknumber) {
        currentBooknumber.set(booknumber);
        currentChapters.set([]);
        invalidBooknumber = false;
        getChapters($currentBooknumber).then(data => {
            currentChapters.set(data);
        }, () => {
            invalidBooknumber = true;
        });
    }

    getVerses($currentBooknumber, chapternumber).then(data => {
        verses = data;
    }, () => {
        invalidChapternumber = true;
    });
};

$: nextChapter = $currentChapters.find(chapter => chapter.chapternumber > Number(chapternumber));
$: previousChapter = $currentChapters.filter(chapter => chapter.chapternumber < Number(chapternumber)).pop();
</script>
<svelte:window on:hashchange={initialize} />
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
        <PatientContainer isFailed={invalidBooknumber} isWaiting={!$getShortName($currentBooknumber)}>
            <h2>{$getShortName($currentBooknumber)} {chapternumber}</h2>
            {#if $getChapterDescription(chapternumber)}
                <Expandable content={$getChapterDescription(chapternumber)} showLabel="Show Description" hideLabel="Hide Description" />
            {/if}
        </PatientContainer>
        <PatientContainer isFailed={invalidBooknumber || invalidChapternumber} isWaiting={verses.length === 0}>
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
    min-height: 1.8rem;
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