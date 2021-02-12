<script>
export let message = '';
export let isError = false;
</script>
<div class="alert" class:error={isError}>
    <i class="fas fa-{isError ? 'exclamation-triangle' : 'check'}" />
    <h4>{message}</h4>
</div>
<style>
    .alert {
        align-items: center;
        background-color: var(--white);
        border: 2px solid var(--green);
        border-radius: var(--radius);
        color: var(--green);
        display: flex;
        padding: var(--spacing-md);
    }

    .alert.error {
        border-color: var(--red);
        color: var(--red);
    }

    i {
        font-size: 2rem;
        margin-right: var(--spacing-md);
    }
</style>