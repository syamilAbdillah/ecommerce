<script>
	import { fade } from 'svelte/transition'
	import { LoaderIcon, Trash2Icon, PlusCircleIcon, SearchIcon } from 'svelte-feather-icons'
	import { useUserFind } from './services.user'

	const {find, loading, error, users, total} = useUserFind()
	
	let take = 4
	let page = 1
	const next = () => {
		if($users.length >= $total) return

		page += 1
		find(take, page)
	}

	find(take, page)
</script>


{#if !$loading && $error}
	<div class="grid place-content-center mx-4 my-12 py-12 px-6 bg-rose-50 text-rose-600 rounded">
		<p>{$error}</p>
	</div>
{/if}
<div class="grid gap-4 pb-4 pt-8 px-4">
	<div class="flex justify-end">
		<a href="/superuser/tambah" role="button" class="btn btn-neutral">
			<PlusCircleIcon size="20" />
			<span class="ml-2">tambah data</span>
		</a>
	</div>

	<form on:submit|preventDefault={() => alert('search ...')}>
		<label class="flex items-center rounded border focus:w-64 overflow-x-hidden transition cursor-text">
			<span class="w-12 h-12 grid place-content-center cursor-pointer text-slate-500">
				<SearchIcon size="20" />
			</span>
			<input type="text" class="outline-none w-full" placeholder="cari nama user">
		</label>
	</form>
</div>

{#if !$error}
	<div class="grid p-4">
		{#each $users as user, index (user.id)}
			<div class="p-3 sm:p-6 flex items-center gap-2 sm:gap-4 border-t first:border-none" in:fade>
				<img 
					src="{user.profile_picture}" 
					alt="{user.name}-{user.id}" 
					class="h-12 sm:h-16 w-12 sm:w-16 rounded-full border"
				>
				<div class="grow overflow-x-hidden">
					<h2 class="text-lg sm:text-xl truncate">{user.name}</h2>
					<p class="sm:text-lg text-slate-500 truncate">{user.email}</p>
				</div>
				<div class="flex justify-end">
					<button class="group relative grid place-content-center w-10 h-10 rounded-full text-rose-500 active:scale-95 hover:bg-slate-500/25 transition">
						<span class="scale-0 group-hover:scale-100 absolute -left-8 sm:-left-12 px-1 sm:px-2 sm:py-1 sm:text-sm bg-slate-500 text-slate-50 text-xs rounded">hapus</span>
						<span>
							<Trash2Icon size="20" />
						</span>
					</button>
				</div>
			</div>
		{/each}


		<div class="grid place-content-center py-3">
			{#if $loading}
				<button class="btn italic" disabled>
					<span class="animate-spin">
						<LoaderIcon size="16" />
					</span>
					<span class="ml-2">loading...</span>
				</button>
			{:else}
				<button 
					class="btn hover:bg-slate-500/25" 
					on:click={next} 
					disabled={$users.length >= $total}
				>
					tampilkan lagi
				</button>
			{/if}
		</div>
	</div>

{/if}