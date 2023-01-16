<script>
  import { PlusIcon } from 'svelte-feather-icons'
  import Products from './lib/Products.svelte';
  import Header from './lib/Header.svelte'
  import Toaster from './lib/Toaster.svelte'
  import Cart from './lib/Cart.svelte'
</script>



<main class="min-h-screen relative flex flex-col items-center gap-4 pt-12 pb-8">
  <Toaster></Toaster>
  <Cart/>
  <Header/>
  <PlusIcon/> 
  <Products />
</main>



