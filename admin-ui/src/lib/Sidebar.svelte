<script>
	import { active, router } from 'tinro'
	import { ChevronLeftIcon } from 'svelte-feather-icons'
	import ProfileCard from './ProfileCard.svelte'

	let show = false
	const close = () => show = false
	const toggle = () => show = !show

	$: $router && close()
</script>

<div 
	class="bg-slate-500/25 fixed inset-0 lg:hidden"
	class:hidden={!show}
	on:click={close}
></div>
<div class="h-screen w-64 bg-white fixed lg:static lg:translate-x-0 flex flex-col gap-2 p-4 transition" class:-translate-x-64={!show} >
	<div class="mb-6">
		<ProfileCard/>
	</div>
	<a use:active class="py-3 px-4 rounded transition font-medium hover:bg-slate-50 active:scale-95 text-slate-400" data-exact href="/" >Home</a>
	<a use:active class="py-3 px-4 rounded transition font-medium hover:bg-slate-50 active:scale-95 text-slate-400" href="/superuser" >Superuser</a>
	<a use:active class="py-3 px-4 rounded transition font-medium hover:bg-slate-50 active:scale-95 text-slate-400" href="/produk" >Produk</a>

	<button class="absolute bg-white top-2 -right-10 rounded-r-lg w-12 h-12 flex justify-center items-center lg:hidden" on:click={toggle}>
		<div class="transition" class:rotate-180={!show}>
			<ChevronLeftIcon size="16"/>
		</div>
	</button>
</div>