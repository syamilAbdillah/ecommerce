<script context="module">
	export const types = Object.freeze({
		SUCCESS: 'SUCCESS',
		DANGER: 'DANGER',
	}) 
</script>

<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import { CheckIcon, XIcon, AlertCircleIcon } from 'svelte-feather-icons'

	export let type = types.SUCCESS
	export let text = ''
	export let id
	export let duration = 1250

	const dispatch = createEventDispatcher()
	const remove = () => dispatch('remove', {id})

	onMount(() => {
		const timeout = setTimeout(remove, duration)
		return () => clearTimeout(timeout)
	})
</script>

<div 
	class="flex items-center bg-white rounded overflow-hidden" 
	in:fly={{y: -20}} 
	out:fly={{x: 20}}
>
	<div 
		class="w-16 h-16 text-white grid place-content-center" 
		class:bg-emerald-500={type == types.SUCCESS}
		class:bg-rose-500={type == type.DANGER}
	>
		{#if type == types.DANGER}
			<AlertCircleIcon size="20" />
		{:else}
			<CheckIcon size="20" />
		{/if}
	</div>
	<div class="grow px-4 py-2 overflow-hidden">
		<p class="text-sm text-slate-600">{text}</p>
	</div>
	<button class="w-16 h-16 grid place-content-center active:scale-95 hover:bg-gray-50 transition" on:click={remove}>
		<XIcon size="20" />
	</button>
</div>