<script>
    import { useProductsFindService } from "./products.store";
    import Product from "./Product.svelte";
    import ProductLoad from "./ProductLoad.svelte";
    import { addToast } from "./Toaster.svelte"

    const { 
        loading, 
        products, 
        error, 
        find: findProducts,  
    } = useProductsFindService()

    let count = 1

    const handleClick = ev => {
        addToast(`hello ${count}`)
        count += 1
    }

    
    findProducts()
</script>

<div class="container mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
{#if $loading}
    {#each [1,2,3,4] as _}
        <ProductLoad/>
    {/each}
{:else}
    {#if $error}
        <div class="col-span-4 p-4 bg-rose-50">
            <p class="text-rose-600 text-lg">{$error}</p>
        </div>
    {/if}

    {#if $products}
        {#each $products as product}
            <Product {product}/>
        {:else}
            <p>no data availabel</p>
        {/each}
    {/if}
{/if}
</div>


<button class="btn btn-primary" on:click={handleClick}>add random toast</button>