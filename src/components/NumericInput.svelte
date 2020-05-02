<script>
import { createEventDispatcher } from 'svelte';
export let value = 0;
export let min = 1;
export let max = 10;

const dispatch = createEventDispatcher();

const handleDecrement = () => {
    dispatch('change', { value: value - 1 });
};

const handleIncrement = () => {
    dispatch('change', { value: value + 1 });
};

const handleInput = (event) => {
    if (event.target.value !== '') {
        dispatch('change', { value: Math.floor(event.target.value )});
    }
};
</script>
<div>
    <button disabled={value <= min} on:click={handleDecrement} class="button decrement"><i class="fas fa-minus" /></button>
    <input type="number" on:input={handleInput} {value}>
    <button disabled={max !== null && value >= max} on:click={handleIncrement} class="button increment"><i class="fas fa-plus" /></button>
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