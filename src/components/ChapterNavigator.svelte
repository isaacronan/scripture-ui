<script>
import { onMount } from 'svelte';
import { getShortName, currentBooknumber, currentChapters } from '../utils/store';
import { chapterPattern, chapterHash } from '../utils/routing';

let chapternumber = chapterPattern.getParams()[1];

onMount(() => {
    initialize();
});

const initialize = () => {
    chapternumber = chapterPattern.getParams()[1];
};

$: nextChapter = $currentChapters.find(chapter => chapter.chapternumber > Number(chapternumber));
$: previousChapter = $currentChapters.filter(chapter => chapter.chapternumber < Number(chapternumber)).pop();
</script>
<svelte:window on:hashchange={initialize} />
<nav>
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
</nav>
<style>
nav {
    position: sticky;
    top: 0;
}

.chapter-navigator {
    background-color: var(--blue);
    display: flex;
    height: var(--lh-normal);
    padding: var(--spacing-md);
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