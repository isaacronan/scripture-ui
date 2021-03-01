<script>
import { SCREENWIDTH } from '../utils/constants';
import { ExpandableItem } from '../utils/misc';
import { chapterHash } from '../utils/routing';
import { getShortName } from '../utils/store';
import Link from './Link.svelte';
export let verses = [];
export let showChapterTitles = false;

let isFlagMode = false;
let isFavoriteMode = false;
let startIndex = null;
let endIndex = null;
let container = null;
let expandableVerses = [];
const hydrateExpandableVerses = () => expandableVerses = verses.map(verse => new ExpandableItem(verse));
$: {
    verses;
    hydrateExpandableVerses();
}

$: infoText = (() => {
    if (startIndex !== null) {
        return 'Confirm or cancel.'
    }

    if (isFlagMode) {
        return 'Select verse to report an error.'
    }

    if (isFavoriteMode) {
        return 'Select verses to add to favorites.'
    }
})();

const toggleExpanded = (index) => (event) => {
    event.stopPropagation();
    expandableVerses[index].toggleExpanded();
    expandableVerses = expandableVerses;    
};

const handleWheel = (event) => {
    if (window.innerWidth >= SCREENWIDTH) {
        event.preventDefault();
        container.scrollBy(event.deltaY, 0);
    }
};

const handleVerseClick = (index) => () => {
    if (isFlagMode) {
        if (startIndex === null) {
            startIndex = index;
        } else {
            startIndex = null;
        }
    }

    if (isFavoriteMode) {
        if (startIndex === null) {
            startIndex = index;
        } else if (index < startIndex || !(verses[index].booknumber === verses[startIndex].booknumber && verses[index].chapternumber === verses[startIndex].chapternumber)) {
            startIndex = null;
            endIndex = null;
        } else if(endIndex === null) {
            endIndex = index;
        } else {
            startIndex = null;
            endIndex = null;
        }
    }

};

const handleConfirmClick = () => {
    if (isFlagMode) {
        console.log(verses[startIndex]);
    }

    if (isFavoriteMode) {
        console.log(verses.slice(startIndex, (endIndex || startIndex) + 1));
    }

    cancel();
};

const cancel = () => {
    isFavoriteMode = false;
    isFlagMode = false;
    startIndex = null;
    endIndex = null;
};

$: getIsFaint = (index) => {
    const isStartIndex = startIndex !== null && index === startIndex;
    const isInRange = startIndex !== null && endIndex !== null && index >= startIndex && index <= endIndex;

    if (startIndex === null || isStartIndex) {
        return false;
    }

    if (isFavoriteMode && isInRange) {
        return false;
    }

    return true;
};
</script>
<div on:wheel={handleWheel} bind:this={container} class="container">
    <div class:click-mode={isFlagMode || isFavoriteMode} class="columns">
        <div>
            {#each expandableVerses as { item, isExpanded }, index}
                <div class:non-breaking={index === expandableVerses.length - 1}>
                    <div class="non-breaking">
                        {#if (index === 0 || item.versenumber === 1) && showChapterTitles}
                            <h3 class:faint={getIsFaint(index)}>
                                {$getShortName(item.booknumber)} {item.chapternumber}
                                {#if index === 0 && item.versenumber !== 1}
                                    <small>cont'd</small>
                                {/if}
                                <Link>
                                    <a href={chapterHash(item.booknumber, item.chapternumber)} target="_blank">
                                        <i class="fas fa-external-link-alt icon-primary" />
                                    </a>
                                </Link>
                            </h3>
                        {/if}
                        <p on:click={(isFlagMode || isFavoriteMode) ? handleVerseClick(index) : null} class:faint={getIsFaint(index)}>
                            <small>{item.versenumber}</small> {item.text}
                            {#if item.notes}
                                <button class="plain-button" on:click={toggleExpanded(index)}><small>{isExpanded ? 'Hide' : 'Notes'}</small></button>
                            {/if}
                        </p>
                    </div>
                    {#if isExpanded}
                        {#each item.notes as note}
                            <p on:click={(isFlagMode || isFavoriteMode) ? handleVerseClick(index) : null} class:faint={getIsFaint(index)} class="note">{note}</p>
                        {/each}
                    {/if}
                    {#if index === expandableVerses.length - 1}
                        <div class="action-button">
                            <slot name="actionButton"></slot>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
    <div class="controls">
        <div class="control-buttons">
            {#if isFavoriteMode || isFlagMode}
                <button disabled={startIndex === null} on:click={handleConfirmClick} class="control-button"><i class="fas fa-check" /></button>
                <button on:click={cancel} class="control-button"><i class="fas fa-times" /></button>
            {:else}
                <button on:click={() => isFlagMode = true} class="control-button"><i class="far fa-flag" /></button>
                <button on:click={() => isFavoriteMode = true} class="control-button"><i class="far fa-star" /></button>
            {/if}
        </div>
        {#if isFavoriteMode || isFlagMode}
            <div class="control-info">{infoText}</div>
        {/if}
    </div>
</div>
<style>
.container {
    display: flex;
    padding-bottom: calc(var(--spacing-md) + 4rem);
    position: relative;
}

.controls {
    align-items: center;
    bottom: 0;
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
}

.control-buttons {
    position: fixed;
    bottom: var(--spacing-md);
}

.click-mode .action-button {
    visibility: hidden;
}

.control-info {
    animation-name: pulse;
    animation-duration: 800ms;
    animation-iteration-count: infinite;
    animation-direction: alternate;

    background-color: var(--white);
    border: 2px solid var(--dark);
    color: var(--dark);
    padding: var(--spacing-xs) var(--spacing-sm);
    position: fixed;
    bottom: calc(var(--lh-normal) + 4rem);
}

@keyframes pulse {
    0% {
        opacity: 0;
    }

    80% {
        opacity: 1;
    }
}

.faint {
    opacity: 0.4;
}

.non-breaking {
    break-inside: avoid;
}

p,
h3 {
    color: var(--dark);
    margin: var(--spacing-sm) 0;
}

h3 {
    align-items: baseline;
    display: flex;
}

h3 small {
    margin-left: var(--spacing-sm);
}

a {
    align-self: center;
    font-size: var(--fs-normal);
    margin-left: var(--spacing-sm);
}

p button {
    color: var(--blue);
}

.note {
    margin: var(--spacing-md) var(--spacing-lg);
}

@media screen and (min-width: 768px) {
    .container {
        box-sizing: border-box;
        left: calc(-1 * var(--spacing-md));
        overflow-y: hidden;
        padding-left: var(--spacing-md);
        position: relative;
        top: calc(var(--spacing-md));
        width: calc(100% + 2 * var(--spacing-md));
    }

    .columns {
        column-width: 300px;
    }

    .columns > div {
        padding-right: var(--spacing-md)
    }
}
</style>