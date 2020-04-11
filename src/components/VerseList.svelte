<script>
import { SCREENWIDTH } from '../utils/constants';
import { ExpandableItem } from '../utils/models';
export let verses = [];

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
        <div class="shifted">
            {#each expandableVerses as { item, isExpanded }, index}
                <p>
                    <small>{item.versenumber}</small> {item.text}
                    {#if item.notes}
                        <button class="plain-button" on:click={toggleExpanded(index)}><small>{isExpanded ? 'Hide' : 'Notes'}</small></button>
                    {/if}
                </p>
                {#if isExpanded}
                    {#each item.notes as note}
                        <p class="note">{note}</p>
                    {/each}
                {/if}
            {/each}
        </div>
    </div>
</div>
<style>
.container {
    display: flex;
}

.shifted {
    padding-bottom: var(--spacing-md);
}

p {
    color: var(--dark);
    margin: var(--spacing-sm) 0;
}

button {
    color: var(--blue);
}

.note {
    margin: var(--spacing-md) var(--spacing-lg);
}

@media screen and (min-width: 768px) {
    .container {
        left: calc(-1 * var(--spacing-md));
        overflow-y: hidden;
        position: relative;
        top: calc(var(--spacing-md));
        width: calc(100% + 2 * var(--spacing-md));
    }

    .columns {
        column-width: 300px;
        padding-left: var(--spacing-md);
    }

    .shifted {
        padding-bottom: 0;
        padding-right: var(--spacing-md)
    }
}
</style>