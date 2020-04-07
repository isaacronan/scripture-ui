<script>
export let isFailed = false;
export let isWaiting = false;
export let isDark = false;
export let isShort = false;
</script>
{#if isFailed}
    <div>Error!</div>
{:else if isWaiting}
    <div class:dark={isDark} class:short={isShort} class="skeleton" />
{:else}
    <slot></slot>
{/if}
<style>
.skeleton {
    --skeletoncolor: var(--light);
    animation: pulse 1s linear 0s infinite alternate-reverse;
    background: linear-gradient(var(--skeletoncolor), var(--skeletoncolor));
    border-radius: var(--radius);
    height: 200px;
    margin-top: var(--spacing-md);
}

.skeleton.dark {
    --skeletoncolor: var(--dark);
}

.skeleton.short {
    height: 50px;
    max-width: 50%;
    width: 200px;
}

@keyframes pulse {
    from {
        opacity: 0.4;
    }

    to {
        opacity: 0.2;
    }
}
</style>