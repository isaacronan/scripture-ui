<script>
import { createEventDispatcher, onDestroy } from 'svelte';
export let value = 0;
export let max = null;

const MIN = 1;
let input = null;
let delta = 1;
let backoffTimeout = null;

const dispatch = createEventDispatcher();

const backoff = () => {
    clearTimeout(backoffTimeout);
    if (delta > 1) {
        backoffTimeout = setTimeout(() => {
            delta = Math.max(1, delta / 1.2);
            backoff();
        }, 100);
    }
};

const handleDecrement = () => {
    dispatch('change', { value: Math.floor(Math.max(MIN, value - delta)) });
    delta *= 1.5;
    backoff();
};

const handleIncrement = () => {
    dispatch('change', { value: Math.floor(max ? Math.min(max, value + delta) : value + delta) });
    delta *= 1.5;
    backoff();
};

const handleInput = (event) => {
    if (inputValueIsValid(Number(event.target.value))) {
        dispatch('change', { value: Math.floor(event.target.value )});
    }
};

const handleBlur = (event) => {
    if (!inputValueIsValid(Number(event.target.value))) {
        input.value = value;
    }
};

const inputValueIsValid = (inputValue) => {
    return inputValue !== '' && !(max !== null && inputValue > max) && inputValue >= MIN;
};

onDestroy(() => {
    clearTimeout(backoffTimeout);
});
</script>
<div class="form-control">
    <button disabled={value <= MIN} on:click={handleDecrement} class="button decrement"><i class="fas fa-minus" /></button>
    <input type="number" bind:this={input} on:input={handleInput} on:blur={handleBlur} {value}>
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