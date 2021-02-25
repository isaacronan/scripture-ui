<script>
import { getContext, onMount } from 'svelte';
import { getShortName, getChapterDescription, currentBooknumber, currentChapters, invalidBooknumberError } from '../utils/store';
import { chapterPattern, homeHash, booksHash, bookHash } from '../utils/routing';
import { getChapters, getVerses } from '../utils/http';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import VerseList from '../components/VerseList.svelte';
import Expandable from '../components/Expandable.svelte';
import ChapterNavigator from '../components/ChapterNavigator.svelte';

let [ booknumber, chapternumber ] = chapterPattern.getParams(getContext('initialRoute'));
let verses = [];
let invalidChapternumberError = '';

const prefetched = getContext('prefetched') || window.__PREFETCHED__;
if (prefetched?.verses && prefetched?.chapters) {
    currentBooknumber.set(booknumber);
    currentChapters.set(prefetched.chapters);
    verses = prefetched.verses;
}

onMount(() => {
    initialize();
});

const initialize = () => {
    if (prefetched?.verses && prefetched?.chapters) {
        delete prefetched.chapters;
        delete prefetched.verses;
    } else if (chapterPattern.isMatch()) {
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
    }
};
</script>
<svelte:window on:routechange={initialize} />
<svelte:head>
{#if verses.length === 0}
    <style>
        :root {
            height: 100%;
        }
    </style>
{/if}
<style>
@media screen and (min-width: 768px) {
    :root {
        height: 100%;
    }
}
</style>
</svelte:head>
<article>
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
    <ChapterNavigator />
    <PatientContainer isFailed={$invalidBooknumberError || invalidChapternumberError} errorMessage={$invalidBooknumberError || invalidChapternumberError} isWaiting={verses.length === 0}>
        <VerseList {verses} />
    </PatientContainer>
</article>
<style>
h2 {
    color: var(--dark);
}

article {
    overflow-y: unset;
}

@media screen and (min-width: 768px) {
    article {
        overflow-y: auto;
    }
}
</style>