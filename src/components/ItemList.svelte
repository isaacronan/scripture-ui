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
    <ul>
        {#each expandableItems as { item, isExpanded }, index}
            <ListItem
                on:click={toggleExpanded(index)}
                {isExpanded}
                href={getHref(item)}
                title={getTitle(item)}
                description={getDescription(item)}
            />
        {/each}
    </ul>
</div>
<style>
ul {
    display: grid;
    grid-gap: var(--spacing-md);
    grid-template-columns: 1fr;
    margin-bottom: var(--spacing-md);
    margin-top: var(--spacing-sm);
}

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

@media screen and (min-width: 768px) {
    ul {
        grid-template-columns: 1fr 1fr;
    }
}

@media screen and (min-width: 1024px) {
    ul {
        grid-template-columns: 1fr 1fr 1fr;
    }
}
</style>