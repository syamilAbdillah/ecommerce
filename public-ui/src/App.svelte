<script>
  import { PlusIcon } from 'svelte-feather-icons'
  import Products from './lib/Products.svelte';
  import Counter from './lib/Counter.svelte';

  let show = false

</script>

<main class="min-h-screen flex flex-col items-center gap-4 py-8 px-4">
  <h1 class="text-2xl font-semibold">Vite + Svelte</h1>

  <PlusIcon/> 

  <button class="btn btn-neutral" on:click={() => show = !show}> products toggle</button>

  {#if show}
    <Products />
  {:else}
    <Counter/>
  {/if}


</main>
