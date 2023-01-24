<script context="module">
	const states = Object.freeze({
		LIST: 'LIST',
		FORM: 'FORM',
	})
</script>

<script>
	import { 
		RotateCwIcon, 
		PlusSquareIcon, 
		ListIcon, 
		Trash2Icon, 
		EditIcon 
	} from 'svelte-feather-icons'
	import ProductStore from './ProductStore.svelte'
	import ListProducts from './ListProducts.svelte'
	import RemoveProduct from './RemoveProduct.svelte'
	import FormProduct from './FormProduct.svelte'
	import ProductCard from './ProductCard.svelte'
	import Loading from '../../lib/Loading.svelte'
	import Confirm from '../../lib/Confirm.svelte'

	let state = states.LIST

	let open = false
</script>

<ProductStore 
	let:find 
	let:select
	let:push
	let:replace
	let:remove
	let:products
	let:product
	let:loading 
	let:error
>

<RemoveProduct 
	on:removed={ev => {
		remove(ev.detail.id)
		open = false
	}} 
	let:del 
	let:loading
>
	<Confirm 
		{open} 
		{loading}
		on:close={() => open = false} 
		on:confirm={() => del(product.id)}
		text="apa anda yakin ?" 
	/>
</RemoveProduct>

	<div class="p-6 grid gap-6">
		<div class="sticky border-b top-0 p-2 flex gap-2 items-center bg-white">
			{#if state == states.LIST}
				<button class="btn btn-ghost" on:click={find} disabled={loading}>
					<span class:animate-spin={loading}>
						<RotateCwIcon size="16" />
					</span>
					<span class="ml-2">muat ulang</span>
				</button>
				<button class="btn btn-ghost" on:click={() => {
					select()
					state = states.FORM
				}}>
					<PlusSquareIcon size="16" />
					<span class="ml-2">produk baru</span>
				</button>
			{:else}
				<button class="btn btn-ghost" on:click={() => state = states.LIST}>
					<ListIcon size="16" />
					<span class="ml-2">daftar produk</span>
				</button>
			{/if}
			{#if product && state == states.LIST}
				<button class="btn btn-ghost" on:click={() => state = states.FORM}>
					<EditIcon size="16" />
					<span class="ml-2">edit</span>	
				</button>
			{/if}
			{#if product}
				<button class="btn text-rose-500 hover:bg-rose-50" on:click={() => open = true}>
					<Trash2Icon size="16" />
					<span class="ml-2">hapus</span>
				</button>
			{/if}
		</div>
		
		{#if state == states.LIST}
			<ListProducts 
				{loading} 
				{products} 
				selected={product && product.id} 
				on:select={ev => select(ev.detail.id)}
				on:unselect={() => select()} 
			/>
		{/if}

		{#if state == states.FORM}
			<FormProduct 
				{product} 
				on:created={ev => {
					push(ev.detail.product)
					state = states.LIST
				}} 
				on:updated={ev => {
					replace(ev.detail.product)
					state = states.LIST
				}} 
			/>
		{/if}	
	</div>
</ProductStore>
