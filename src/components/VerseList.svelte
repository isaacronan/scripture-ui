<script>
import { ExpandableItem } from '../utils/models';
export let verses = [];

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
</script>
<div class="container">
    <div class="columns">
        {#each expandableVerses as { item, isExpanded }, index}
            <p>
                <small>{item.versenumber}</small> {item.text}
                {#if item.notes}
                    <button class="link" on:click={toggleExpanded(index)}>Notes</button>
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
<style>
.container {
    display: flex;
    overflow-x: auto;
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

@media screen and (min-width: 600px) {
    .container {
        overflow-y: hidden;
    }

    .columns {
        column-width: 300px;
    }
}
</style>