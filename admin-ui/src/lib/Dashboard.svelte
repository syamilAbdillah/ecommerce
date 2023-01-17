<script>
	import Sidebar from './Sidebar.svelte'
</script>

<main class="min-h-screen bg-slate-100 flex text-slate-700">
	<Sidebar/>
	<div class="grow min-h-screen overflow-y-auto overflow-x-hidden container mx-auto">
		<slot></slot>
	</div>
</main>