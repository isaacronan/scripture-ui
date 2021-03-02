<script>
export let isFailed = false;
export let isWaiting = false;
export let isShort = false;
export let errorMessage = '';
</script>
{#if isFailed || isWaiting}
    <div class:failed={isFailed} class:short={isShort} class="skeleton animate-light-pulse">
        {#if isFailed}
            <div class="failure">
                <i class="fas fa-exclamation-triangle" />
                <h4>{errorMessage}</h4>
            </div>
        {/if}   
    </div>
{:else}
    <slot></slot>
{/if}
<style>
.skeleton {
    align-items: center;
    background-color: var(--smartskeleton);
    border-radius: var(--radius);
    display: flex;
    height: 200px;
    margin-top: var(--spacing-md);
}

.skeleton.short {
    height: 50px;
    max-width: 50%;
    width: 200px;
}

.skeleton.failed {
    animation: none;
    background-color: var(--white);
    border: 1px solid var(--red);
    color: var(--red);
}

.failure {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

h4 {
    margin-top: var(--spacing-sm);
}

.short h4 {
    display: none;
}

i {
    font-size: 2rem;
}
</style>