<script>
	import ProductCard from './ProductCard.svelte'

	export let loading
	export let products
	export let selected
</script>

<div class="grid">
	{#if loading}
		<p>loading</p>
	{:else}
		{#each products as product, index (product.id)}
			<ProductCard 
				{...product} 
				selected={product.id == selected}
				on:select
				on:unselect
			/>
		{/each}
	{/if}
</div>
<div class="grid place-content-center">
	<button class="btn btn-neutral">button</button>
</div>