<script context="module">
	import { writable } from 'svelte/store'

	const show = writable(true)
	const toggle = () => show.update(s => !s)
	const close = () => show.set(false)
</script>

<script>
	import { active } from 'tinro'
	import { MenuIcon, XIcon } from 'svelte-feather-icons'
</script>

{#if $show}
	<div class="bg-slate-500/25 fixed inset-0 lg:hidden" on:click={close}></div>
{/if}
<div class="h-screen w-64 bg-white fixed lg:static lg:translate-x-0 flex flex-col gap-2 p-4 transition" class:-translate-x-64={!$show} >
	<a use:active class="py-3 px-4 rounded transition font-semibold hover:bg-slate-50 active:scale-95 text-slate-400" data-exact href="/" >Home</a>
	<a use:active class="py-3 px-4 rounded transition font-semibold hover:bg-slate-50 active:scale-95 text-slate-400" href="/superuser" >Superuser</a>
	<a use:active class="py-3 px-4 rounded transition font-semibold hover:bg-slate-50 active:scale-95 text-slate-400" href="/produk" >Produk</a>

	<button class="absolute bg-white top-2 -right-10 rounded-r-lg w-12 h-12 flex justify-center items-center lg:hidden" on:click={toggle}>
		{#if $show}
			<XIcon size="16" />
		{:else}
			<MenuIcon size="16" />
		{/if}
	</button>
</div>