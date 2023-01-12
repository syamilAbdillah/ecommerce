<script>

    import { fade } from "svelte/transition";

    /**
     * @typedef Product
     * @property {string} name
     * @property {string} image
     * @property {number} price
     * @property {string} id
     */

    /** @type Product */
    export let product 
</script>


<div class="border rounded overflow-hidden cursor-pointer" in:fade>
    <img class="aspect-square bg-gray-100" src="{product.image}" alt="{product.name} {product.id}">
    <div class="p-4">
        <h1 class="text-2xl font-normal truncate">{product.name}</h1>
        <p>Rp. {product.price}</p>
    </div>
</div>