<script>
	import { LoaderIcon } from 'svelte-feather-icons'
	export let loading = false
</script>

{#if loading}
	<button class="btn italic" disabled>
		<span class="animate-spin">
			<LoaderIcon size="16" />
		</span>
		<span class="ml-2">memuat...</span>
	</button>
{:else}
	<button 
		class="btn hover:bg-slate-500/25" 
		on:click
	>
		<slot>
			tampilkan lagi
		</slot>
	</button>
{/if}