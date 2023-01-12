<script>
    import { useProductsFindService } from "./products.store";
    import Product from "./Product.svelte";
    import ProductLoad from "./ProductLoad.svelte";

    const { loading, products, error, find: findProducts  } = useProductsFindService()
    findProducts()
</script>

<div class="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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