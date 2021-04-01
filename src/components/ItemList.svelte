<script>
import ListItem from './ListItem.svelte';
import { ExpandableItem } from '../utils/misc'
import Link from './Link.svelte';

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
    <button class="bulk-button plain-button" on:click={setExpandedAll(true)}>Expand All</button>
    <button class="bulk-button plain-button" on:click={setExpandedAll(false)}>Collapse All</button>
</div>
<div>
    <ul class="grid-list">
        {#each expandableItems as { item, isExpanded }, index}
            <ListItem
                showDescription={isExpanded}
                title={getTitle(item)}
                description={getDescription(item)}
            >
                <button slot="left" class="icon icon-secondary" on:click={toggleExpanded(index)}>
                    <i class="fas fa-{isExpanded ? 'minus' : 'plus'}-circle"/>
                </button>
                <Link slot="right"><a class="icon icon-primary" href={getHref(item)}><i class="fas fa-arrow-right"/></a></Link>
            </ListItem>
        {/each}
    </ul>
</div>
<style>
.bulk-button {
    color: var(--cyan);
}

.bulk-button + .bulk-button {
    border-left: 1px solid var(--cyan);
    margin-left: var(--spacing-sm);
    padding-left: var(--spacing-sm);
}

ul {
    margin-bottom: var(--spacing-md);
    margin-top: var(--spacing-sm);
}
</style>