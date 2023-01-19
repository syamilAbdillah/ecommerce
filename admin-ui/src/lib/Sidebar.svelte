<script>
	import { active, router } from 'tinro'
	import { ChevronLeftIcon, HomeIcon, UserIcon, PackageIcon } from 'svelte-feather-icons'
	import ProfileCard from './ProfileCard.svelte'
	import SidebarLink from './SidebarLink.svelte'

	let show = false
	const close = () => show = false
	const toggle = () => show = !show

	$: $router && close()
</script>

<div 
	class="bg-slate-500/25 fixed inset-0 z-50 lg:hidden"
	class:hidden={!show}
	on:click={close}
	on:keypress={close}
></div>
<div class="min-h-screen w-64 bg-slate-600 fixed z-50 lg:static lg:translate-x-0 transition" class:-translate-x-64={!show} >
	<div class="lg:sticky top-0 flex flex-col gap-2 p-4 ">
		<div class="mb-6">
			<ProfileCard/>
		</div>
		<SidebarLink href="/" exact>
			<HomeIcon size="16"/>
			<span class="ml-4">Home</span>
		</SidebarLink>
		<SidebarLink href="/superuser">
			<UserIcon size="16" />
			<span class="ml-4">Superuser</span>
		</SidebarLink>
		<SidebarLink href="/produk">
			<PackageIcon size="16" />
			<span class="ml-4">Produk</span>
		</SidebarLink>

		<button class="absolute text-slate-50 bg-slate-600 bottom-0 -right-12 rounded-tr-lg w-12 h-12 grid place-content-center lg:hidden" on:click={toggle}>
			<div class="transition" class:rotate-180={!show}>
				<ChevronLeftIcon size="20"/>
			</div>
		</button>
	</div>
</div>