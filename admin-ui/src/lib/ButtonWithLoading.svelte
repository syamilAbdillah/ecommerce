<script>
	import { LoaderIcon } from 'svelte-feather-icons'
	export let loading = false
	export let text = 'memuat...'
</script>

{#if $$slots.button}
	{#if loading}
		<button class="btn italic" disabled>
			<span class="animate-spin">
				<LoaderIcon size="16" />
			</span>
			<span class="ml-2">{text}</span>
		</button>
	{:else}
		<slot name="button"></slot>
	{/if}
{/if}