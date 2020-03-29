<script>
import { onMount } from 'svelte';
import { ExpandableItem } from '../utils/models';
export let content = '';
export let showLabel = '';
export let hideLabel = '';

let expandableContent = {};
onMount(() => {
    expandableContent = new ExpandableItem(content);
});

const toggleExpanded = () => {
    expandableContent.toggleExpanded();
    expandableContent = expandableContent;
};
</script>
<div>
    {#if expandableContent && expandableContent.isExpanded}
        <p>{content}</p>
    {/if}
    <div>
        <button on:click={toggleExpanded}>{expandableContent.isExpanded ? hideLabel : showLabel}</button>
    </div>
</div>