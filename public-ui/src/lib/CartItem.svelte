<script>
	import { Trash2Icon } from 'svelte-feather-icons'
	import { toCurrency } from './toCurrency'
	import { updateQty, removeItem } from './Cart.svelte'
	import Counter from './Counter.svelte'

	/** 
	 * 
	 * @type {{
	 * 	name: string; 
	 * 	id: string; 
	 * 	image: string; 
	 * 	price: number; 
	 * 	qty: number;
	 * }} 
	 * 
	 * */
	export let item
	const handleChange = ev => {
		updateQty(item.id, ev.detail.value)
	}

	const handleRemove = () =>  removeItem(item.id)
</script>

<div class="flex gap-2 items-center py-3 border-y first:border-t-0 last:border-b-0">
	<img src="{item.image}" alt="{item.name}-{item.id}" class="w-16 h-16 object-cover">
	<div class="grow">
		<h2 class="text-xl truncate">{item.name}</h2>
		<p class="font-thin">Rp. {toCurrency(item.price)}</p>
	</div>
	<div class="flex-0 flex">
		<Counter value={item.qty} min={1} on:change={handleChange}/>
	</div>
	<div class="flex-0">
		<button class="p-2 border text-rose-600" on:click={handleRemove}>
			<Trash2Icon size="16" />
		</button>
	</div>
</div>