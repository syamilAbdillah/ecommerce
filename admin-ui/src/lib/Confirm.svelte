<script>
	import { createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import WithLoading from './ButtonWithLoading.svelte'
	
	const dispatch = createEventDispatcher()

	export let open
	export let text
	export let loading = false

	const handleClose = () => dispatch('close')
	const handleConfirm = () => dispatch('confirm')
</script>

{#if open}
	<div class="fixed inset-0 z-40 p-6 grid place-content-center rounded" in:fly={{y: -60}} out:fly={{y: -60}}>
		<div class="absolute inset-0 bg-slate-500/25" on:click={handleClose} on:keypress={handleClose}></div>
		<div class="w-full sm:w-96 relative z-40 bg-white grid">
			<div class="p-6">
				<p>{text}</p>
			</div>
			<div class="bg-gray-50 p-6 flex justify-end items-center gap-2">
				{#if !loading}
					<button class="btn hover:bg-slate-500/25" on:click={handleClose}>batalkan</button>
				{/if}
				<WithLoading {loading}>
					<button class="btn bg-rose-500 text-white" on:click={handleConfirm} slot="button">konfirmasi</button>
				</WithLoading>
			</div>
		</div>
	</div>
{/if}