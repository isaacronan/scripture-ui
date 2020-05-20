<script>
import { createEventDispatcher} from 'svelte';
import { SCREENWIDTH } from '../utils/constants';
import { ExpandableItem } from '../utils/models';
export let verses = [];
export let actionButtonLabel = '';

let container = null;
let expandableVerses = [];
const hydrateExpandableVerses = () => expandableVerses = verses.map(verse => new ExpandableItem(verse));
$: {
    verses;
    hydrateExpandableVerses();
}

const dispatch = createEventDispatcher();

const handleAction = () => {
    dispatch('action');
};

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
                        {#if item.title}
                            <h3>
                                {item.title}
                                {#if item.isContinued}
                                    <small>cont'd</small>
                                {/if}
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
                    {#if actionButtonLabel && index === expandableVerses.length - 1}
                        <button on:click={handleAction} class="button alt action">{actionButtonLabel}</button>
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

p button {
    color: var(--blue);
}

.note {
    margin: var(--spacing-md) var(--spacing-lg);
}

.action {
    width: 100%;
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