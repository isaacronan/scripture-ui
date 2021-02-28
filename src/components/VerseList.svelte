<script>
import { SCREENWIDTH } from '../utils/constants';
import { ExpandableItem } from '../utils/misc';
import { chapterHash } from '../utils/routing';
import { getShortName } from '../utils/store';
import Link from './Link.svelte';
export let verses = [];
export let showChapterTitles = false;

let container = null;
let expandableVerses = [];
const hydrateExpandableVerses = () => expandableVerses = verses.map(verse => new ExpandableItem(verse));
$: {
    verses;
    hydrateExpandableVerses();
}

const toggleExpanded = (index) => () => {
    expandableVerses[index].toggleExpanded();
    expandableVerses = expandableVerses;    
};

const handleWheel = (event) => {
    if (window.innerWidth >= SCREENWIDTH) {
        event.preventDefault();
        container.scrollBy(event.deltaY, 0);
    }
};
</script>
<div on:wheel={handleWheel} bind:this={container} class="container">
    <div class="columns">
        <div>
            {#each expandableVerses as { item, isExpanded }, index}
                <div class:non-breaking={index === expandableVerses.length - 1}>
                    <div class="non-breaking">
                        {#if (index === 0 || item.versenumber === 1) && showChapterTitles}
                            <h3>
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
                        <p>
                            <small>{item.versenumber}</small> {item.text}
                            {#if item.notes}
                                <button class="plain-button" on:click={toggleExpanded(index)}><small>{isExpanded ? 'Hide' : 'Notes'}</small></button>
                            {/if}
                        </p>
                    </div>
                    {#if isExpanded}
                        {#each item.notes as note}
                            <p class="note">{note}</p>
                        {/each}
                    {/if}
                    {#if index === expandableVerses.length - 1}
                        <slot name="actionButton"></slot>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>
<style>
.container {
    display: flex;
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