<script>
import { onMount, getContext } from 'svelte';
import { getShortName } from '../utils/store';
import { issuePattern, dashboardHash } from '../utils/routing';
import { getSubscription, updateSubscription } from '../utils/http';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import VerseList from '../components/VerseList.svelte';

const changeRoute = getContext('changeRoute');

let [ id ] = issuePattern.getParams(getContext('initialRoute'));
let subscription = null;
let verses = [];
let isCompleted = false;

onMount(() => {
    initialize();
});

const initialize = () => {
    [ id ] = issuePattern.getParams();
    subscription = null;
    verses = [];
    isCompleted = false;

    getSubscription(id).then(data => {
        subscription = data;
        subscription.books.forEach(book => {
            book.chapters.forEach(chapter => {
                chapter.verses.forEach((verse, index) => {
                    verses.push({
                        ...verse,
                        ...index === 0 ? {
                            title: `${$getShortName(book.booknumber)} ${chapter.chapternumber}`,
                            isContinued: chapter.verses[0].versenumber !== 1
                        } : {}
                    });
                })
            });
        });
    }, () => {
        changeRoute(dashboardHash);
    });
};

const goToDashboard = () => changeRoute(dashboardHash);

const handleIssueUpdate = () => {
    updateSubscription(
        id,
        subscription.name,
        subscription.verseDosage,
        subscription.isChapterSubscription,
        subscription.bookPool,
        subscription.nextIssue
    ).then(() => isCompleted = true);
};
</script>
<svelte:head>
<style>
    :root {
        height: 100%;
    }
</style>
</svelte:head>
<article>
    <Breadcrumbs crumbs={[
        { label: 'Dashboard', hash: dashboardHash }
    ]}/>
    <PatientContainer isShort={true} isWaiting={!subscription}>
        <h2>{subscription.name}</h2>
    </PatientContainer>
    <PatientContainer isWaiting={!subscription}>
        <VerseList {verses}>
            <div slot="actionButton">
                {#if !isCompleted}
                    <button on:click={handleIssueUpdate} class="button action bottom-spacing">Complete</button>
                {:else}
                    <button on:click={goToDashboard} class="button alt action">Dashboard</button>
                {/if}
                <button on:click={initialize} class:hidden={!isCompleted || !subscription.nextIssue} class="button action">Next Issue</button>
            </div>
        </VerseList>
    </PatientContainer>
</article>
<style>
h2 {
    color: var(--dark);
}

.action {
    margin-bottom: var(--spacing-sm);
    width: 100%;
}

.hidden {
    visibility: hidden;
}
</style>