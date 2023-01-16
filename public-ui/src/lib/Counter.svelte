<script> 
    import { createEventDispatcher } from 'svelte'
    import { PlusIcon, MinusIcon } from 'svelte-feather-icons'
    import { clickOutside } from './directives'

    export let value = 1
    export let min = 1

    let show = false

    const open = () => show = true
    const close = () => show = false

    const inc = () => value++
    const dec = () => value--

    const dispatch = createEventDispatcher()

    $: dispatch('change', {value})
</script>


{#if !show}
    <button class="p-1 px-3 border" on:click={open}>{value}</button>
{:else}
    <div class="flex items-center" use:clickOutside on:click_outside={close}>
        <button class="p-2 border" on:click={inc}>
            <PlusIcon size="16" />
        </button>
        <label class="border p-1 w-12">
            <input 
                type="number" 
                {min}
                bind:value 
                class="outline-none"
            >
        </label>
        <button class="p-2 border" on:click={dec}>
            <MinusIcon size="16" />
        </button>
    </div>
{/if}
