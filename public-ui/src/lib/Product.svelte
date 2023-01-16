<script>

    import { fade } from "svelte/transition";
    import { ShoppingCartIcon } from 'svelte-feather-icons'
    import { toCurrency } from './toCurrency'
    import { addToast } from './Toaster.svelte'
    import { addToCart } from './Cart.svelte'

    /**
     * @typedef Product
     * @property {string} name
     * @property {string} image
     * @property {number} price
     * @property {string} id
     */

    /** @type Product */
    export let product 

    function handleClickCard(ev) {
        addToast('card clicked')
    }

    const handleClickButton = p => ev =>  {
        ev.stopPropagation()
        addToCart(product, 1)
    }
</script>


<div class="border overflow-hidden cursor-pointer hover:shadow-lg transition relative" transition:fade on:click={handleClickCard}>
    <img class="aspect-square object-cover" src="{product.image}" alt="{product.name} {product.id}">
    <div class="p-4 grid gap-4">
        <div>
            <h1 class="text-xl text-gray-800 truncate">{product.name}</h1>
            <p class="font-light text-gray-600">Rp {toCurrency(product.price)}</p>
        </div>
        <button class="btn btn-primary" on:click={handleClickButton(product)}>add to chart</button>
    </div>

</div>