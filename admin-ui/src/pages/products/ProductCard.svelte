<script>
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { toCurrency } from '../../lib/utils'
	import { CheckSquareIcon, MinusSquareIcon } from 'svelte-feather-icons'

	const dispatch = createEventDispatcher()

	export let image
	export let id 
	export let name
	export let price
	export let created_at

	export let selected = false

	const onSelect = () => dispatch('select', {id})
	const onUnselect = () => dispatch('unselect', {id})

	$: formatedPrice = toCurrency(price)
</script>

<div class="p-3 sm:p-6 flex items-center gap-2 sm:gap-4 border-t first:border-none" class:bg-slate-50={selected} in:fade>
	<img 
		src="{image}" 
		alt="{name}-{id}" 
		class="h-12 sm:h-16 w-12 sm:w-16 rounded border"
	>

	<div class="grow overflow-x-hidden">
		<h2 class="text-lg sm:text-xl truncate">{name}</h2>
		<p class="sm:text-lg text-slate-500 truncate">Rp. {formatedPrice}</p>
		<p class="text-xs font-thin">{new Date(created_at)}</p>
	</div>

	<div class="flex justify-end">
		{#if selected}
			<button class="btn hover:bg-slate-500/25 text-slate-500" on:click={onUnselect}>
				<CheckSquareIcon size="16" />
				<span class="ml-2">terpilih</span>
			</button>
		{:else}
			<button class="btn btn-neutral" on:click={onSelect}>
				<MinusSquareIcon size="16" />
				<span class="ml-2">pilih</span>
			</button>
		{/if}
	</div>
</div>