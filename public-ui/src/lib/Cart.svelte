<script context="module">
	import { writable, derived } from 'svelte/store'

	const carts = writable([])
	const show = writable(false)

	export const addToCart = (product, qty) => {
		carts.update(prev => {
			let exist

			const curr = prev.map(c => {
				if(c.id == product.id) {
					exist = c
					c.qty += qty
				}

				return c 
			})

			return exist ? curr: [{...product, qty}, ...curr]
		})
	}

	export const open = () => show.set(true)
	export const close = () => show.set(false)
	const toggle = () => {
		show.update(s => !s)
	}

	export const count = derived(carts, $carts => $carts.length)
	export const updateQty = (id, qty) => carts.update(prev => prev.map(cart => {
		if(cart.id == id) {
			cart.qty = qty > 1 ? qty: 1 
		}

		return cart
	}))

	export const removeItem = (id) => {
		carts.update(prev => prev.filter(cart => cart.id != id))
	} 
</script>

<script>
	import { XIcon } from 'svelte-feather-icons'
	import { toCurrency } from './toCurrency'
	import CartItem from './CartItem.svelte'
</script>

<div 
	on:click={close}
	class="fixed z-50 inset-0 bg-gray-500/25"
	class:hidden={!$show}
></div>
<div 
	class="fixed z-50 inset-y-0 right-0 w-full lg:max-w-lg p-6 bg-white transition translate-x-0 overflow-y-auto"
	class:translate-x-[512px]={!$show}
>
	<button on:click={close} class="hover:text-rose-600">
		<XIcon/>
	</button>

	<div class="flex flex-col mt-6">
		{#each $carts as item, index}
			<CartItem {item} />
		{/each}
	</div>
</div>