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
{#each expandableVerses as { item, isExpanded }, index}
    <p>
        <small>{item.versenumber}</small>{item.text}
        {#if item.notes}
            <button on:click={toggleExpanded(index)}>Notes</button>
        {/if}
    </p>
    {#if isExpanded}
        {#each item.notes as note}
            <p>{note}</p>
        {/each}
    {/if}
{/each}