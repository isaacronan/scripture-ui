<script>
import ListItem from './ListItem.svelte';
import { ExpandableItem } from '../utils/models'

export let items = [];
export let getTitle = () => '';
export let getHref = () => '';
export let getDescription = () => '';

let expandableItems = [];
const hydrateExpandableItems = () => expandableItems = items.map(item => new ExpandableItem(item));
$: {
    items;
    hydrateExpandableItems();
}

const toggleExpanded = (index) => () => {
    expandableItems[index].toggleExpanded();
    expandableItems = expandableItems;    
};

const setExpandedAll = (isExpanded) => () => {
    expandableItems.forEach(item => item.setExpanded(isExpanded));
    expandableItems = expandableItems;
};
</script>

<div>
    <button class="plain-button" on:click={setExpandedAll(true)}>Expand All</button>
    <button class="plain-button" on:click={setExpandedAll(false)}>Collapse All</button>
</div>
<div>
    <ul class="grid-list">
        {#each expandableItems as { item, isExpanded }, index}
            <ListItem
                on:click={toggleExpanded(index)}
                {isExpanded}
                destinationHref={getHref(item)}
                title={getTitle(item)}
                description={getDescription(item)}
            />
        {/each}
    </ul>
</div>
<style>
button {
    color: var(--cyan);
}

button + button {
    position: relative;
}

button + button::before {
    background-color: var(--cyan);
    content: '';
    height: calc(100%);
    left: calc(-1 * var(--spacing-md) / 2 - 1px);
    position: absolute;
    top: 0;
    width: 1px;
}
</style>