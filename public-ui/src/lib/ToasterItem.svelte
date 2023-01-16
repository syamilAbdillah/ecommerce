<script>
	import { onMount, createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'

	export let text = '<-- should be a text -->'
	export let id

	const dispatch = createEventDispatcher()

	function handleClick() {
		dispatch('remove', {id})
	}

	onMount(() => {

		const timeout = setTimeout(function() {
			dispatch('remove', {id})
		}, 1000)

		return () => {
			clearTimeout(timeout)
		}
	})

</script>


<div class="p-4 bg-white rounded-md cursor-pointer" on:click={handleClick} in:fly={{ y: -20 }} out:fly={{ x: 20 }}>{text}</div>