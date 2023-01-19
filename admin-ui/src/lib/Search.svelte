<script>
	import { createEventDispatcher } from 'svelte'
	import { SearchIcon } from 'svelte-feather-icons'
	
	export let placeholder = 'cari berdasarkan nama'
	
	let value = ''
	const dispatch = createEventDispatcher()
	const onSearch = () => dispatch('search', {value})
</script>

<form on:submit|preventDefault={onSearch}>
	<label class="flex items-center rounded border focus:w-64 overflow-x-hidden transition cursor-text">
		<span class="w-12 h-12 grid place-content-center cursor-pointer text-slate-500">
			<SearchIcon size="20" />
		</span>

		<input 
			bind:value type="text" 
			class="outline-none w-full" 
			{placeholder}
		>
	</label>
</form>