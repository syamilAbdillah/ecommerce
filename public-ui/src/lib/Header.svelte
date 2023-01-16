<script>
	import { ShoppingBagIcon, HomeIcon, SearchIcon } from 'svelte-feather-icons'
	import { open, count } from './Cart.svelte'
</script>

<div class="fixed top-0 right-0 left-0 z-40 bg-white border-b">
	<div class="container mx-auto flex gap-4 items-center justify-between py-4 px-6">
		<button class="flex-0 transition active:scale-95 hover:text-indigo-700">
			<HomeIcon/>
		</button>
		<label class="flex items-center grow border">
			<span class="flex-0 px-3 text-gray-400">
				<SearchIcon/>
			</span>
			<input type="text" placeholder="search..." class="py-3 pr-4 grow placeholder:left-12 placeholder-gray-600 outline-none">
		</label>
		<button class="flex-0 transition active:scale-95 hover:text-indigo-700 flex" on:click={open}>
			<ShoppingBagIcon/>
			<span class="bg-gray-100 rounded-full px-1 text-sm">{$count}</span>
		</button>
	</div>
</div>