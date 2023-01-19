<script>
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import { Trash2Icon } from 'svelte-feather-icons'

	const dispatch = createEventDispatcher()

	export let profile_picture
	export let name
	export let id
	export let email

	const handleRemove = () => dispatch('remove', {id})
</script>

<div class="p-3 sm:p-6 flex items-center gap-2 sm:gap-4 border-t first:border-none" in:fade>
	<img 
		src="{profile_picture}" 
		alt="{name}-{id}" 
		class="h-12 sm:h-16 w-12 sm:w-16 rounded-full border"
	>

	<div class="grow overflow-x-hidden">
		<h2 class="text-lg sm:text-xl truncate">{name}</h2>
		<p class="sm:text-lg text-slate-500 truncate">{email}</p>
	</div>

	<div class="flex justify-end">
		<!-- remove button -->
		<button class="group relative grid place-content-center w-10 h-10 rounded-full text-rose-500 active:scale-95 hover:bg-slate-500/25 transition" on:click={handleRemove}>
			<span class="scale-0 group-hover:scale-100 absolute -left-8 sm:-left-12 px-1 sm:px-2 sm:py-1 sm:text-sm bg-slate-500 text-slate-50 text-xs rounded">hapus</span>
			<span>
				<Trash2Icon size="20" />
			</span>
		</button>
	</div>
</div>