<script>
import ListItem from './ListItem.svelte';
import { onMount } from 'svelte';
import { ExpandableItem } from '../utils/models'

export let items = [];
export let getTitle = () => '';
export let getHref = () => '';
export let getDescription = () => '';

let expandableItems = [];
onMount(() => {
    expandableItems = items.map(item => new ExpandableItem(item));
});

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
    <button on:click={setExpandedAll(true)}>Expand All</button>
    <button on:click={setExpandedAll(false)}>Collapse All</button>
</div>
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