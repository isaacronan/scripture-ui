<script>
import { ExpandableItem } from '../utils/misc';
export let content = '';
export let showLabel = '';
export let hideLabel = '';

let expandableContent = {};
const hydrateExpandableContent = () => expandableContent = new ExpandableItem(content);
$: {
    content;
    hydrateExpandableContent();
}

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
        <button class="plain-button" on:click={toggleExpanded}>{expandableContent.isExpanded ? hideLabel : showLabel}</button>
    </div>
</div>
<style>
button {
    color: var(--smartblue);
    margin-bottom: var(--spacing-lg);
}

p {
    color: var(--smartbody);
    margin-bottom: var(--spacing-sm);
}
</style>