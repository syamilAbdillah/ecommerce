<script context="module">
	import { writable } from 'svelte/store'
	import { rand } from './randomValue'
	import { types } from './ToasterItem.svelte'

	const store = writable([])

	export function push(text, type = types.SUCCESS) { 
		const toast = {id: rand(), text, type}
		store.update(s => [toast, ...s])
	}

	function remove(id) {
		store.update(s => s.filter(el => el.id != id))
	}
</script>

<script>
	import ToasterItem from './ToasterItem.svelte'
	const handleRemove = ev => remove(ev.detail.id)
</script>

{#if $store.length}
	<div class="fixed top-6 left-0 right-0 z-40 w-72 sm:w-96 mx-auto grid gap-2">
		{#each $store as item,_ (item.id)}
			<ToasterItem {...item} on:remove={handleRemove} />
		{/each}
	</div>
{/if}
