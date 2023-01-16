<script context="module">
	import { writable } from 'svelte/store'
	const uid = () => Math.ceil(Math.random() * 10e8)+ '-' + Date.now()


	const messsages = writable([])

	export const addToast = msg => {
		messsages.update(m => [{text: msg, id: uid()}, ...m])
	}

</script>

<script>
	import ToasterItem from './ToasterItem.svelte'

	const handleRemove = ev => {
		messsages.update(
			msgs => msgs.filter(msg => msg.id != ev.detail.id)
		)
	}
</script>



<div class="fixed top-4 mx-auto w-96 z-50 flex flex-col gap-2 p-4" class:hidden={$messsages.length < 1}>
	{#each $messsages as msg, index (msg.id)}
		<ToasterItem {...msg} on:remove={handleRemove}></ToasterItem>
	{/each}
</div>