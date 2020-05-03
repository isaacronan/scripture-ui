<script>
import { onMount } from 'svelte';
import { getShortName } from '../utils/store';
import { issuePattern, homeHash, dashboardHash } from '../utils/routing';
import { getSubscription, updateSubscription } from '../utils/http';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
import VerseList from '../components/VerseList.svelte';

let [ id ] = issuePattern.getParams();
let subscription = null;
let verses = [];

onMount(() => {
    initialize();
});

const initialize = () => {
    [ id ] = issuePattern.getParams();
    subscription = null;
    verses = [];

    getSubscription(id).then(data => {
        subscription = data;
        subscription.books.forEach(book => {
            book.chapters.forEach(chapter => {
                verses.push({
                    title: `${$getShortName(book.booknumber)} ${chapter.chapternumber}`,
                    isContinued: chapter.verses[0].versenumber !== 1
                });
                verses.push(...chapter.verses);
            });
        });
    }, () => {
        window.location.hash = dashboardHash;
    });
};

const handleIssueUpdate = () => {
    updateSubscription(
        id,
        subscription.name,
        subscription.verseDosage,
        subscription.bookPool,
        subscription.nextIssue
    ).then(() => window.location.hash = dashboardHash);
};
</script>
<svelte:window on:hashchange={initialize} />
<svelte:head>
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
        { label: 'Dashboard', hash: dashboardHash }
    ]}/>
    <PatientContainer isShort={true} isWaiting={!subscription}>
        <h2>{subscription.name}</h2>
    </PatientContainer>
    <PatientContainer isWaiting={!subscription}>
        <VerseList on:action={handleIssueUpdate} actionButtonLabel="Complete" {verses} />
    </PatientContainer>
</article>
<style>
h2 {
    color: var(--dark);
}
</style>