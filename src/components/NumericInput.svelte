<script>
import { createEventDispatcher } from 'svelte';
export let value = 0;

const dispatch = createEventDispatcher();

const handleDecrement = () => {
    value -= 1;
    dispatch('change', { value });
};

const handleIncrement = () => {
    value += 1;
    dispatch('change', { value });
};

const handleBlur = () => {
    dispatch('change', { value });
};
</script>
<div>
    <button on:click={handleDecrement} class="button decrement"><i class="fas fa-minus" /></button>
    <input type="number" on:blur={handleBlur} bind:value>
    <button on:click={handleIncrement} class="button increment"><i class="fas fa-plus" /></button>
</div>
<style>
div {
    display: flex;
}

button {
    width: 5rem;
}

.decrement {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}

.increment {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}

input {
    border-radius: 0;
    flex-grow: 1;
    max-width: calc(100% - 10rem);
    text-align: center;
}
</style>