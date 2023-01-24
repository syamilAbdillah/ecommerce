<script>
	import Lazy from './Lazy.svelte'
</script>

<main class="min-h-screen bg-white flex text-slate-700">
	<Lazy component={import('./Sidebar.svelte')}>
		<div class="w-64 h-screen bg-gray-50 animate-pulse flex items-center" slot="loading">
		</div>
	</Lazy>
	<div class="grow min-h-screen container mx-auto">
		<slot></slot>
	</div>
</main>