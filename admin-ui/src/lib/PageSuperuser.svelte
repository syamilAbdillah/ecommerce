<script>
	import { fade } from 'svelte/transition'
	import { PlusCircleIcon } from 'svelte-feather-icons'
	import { useUserFind } from './services.user'
	import LoadMoreButton from './LoadMoreButton.svelte'
	import SuperuserCard from './SuperuserCard.svelte'
	import Search from './Search.svelte'
	import ErrorCard from './ErrorCard.svelte'

	const {find, loading, error, users, total} = useUserFind()
	
	let take = 4
	let page = 1
	
	const next = () => {
		if($users.length >= $total) return

		page += 1
		find(take, page)
	}

	const handleRemove = ev => alert('removing user ' + ev.detail.id)
	const handleSearch = ev => alert('search value is ' + ev.detail.value)

	find(take, page)
</script>


<div class="grid gap-4 pb-4 pt-8 px-4">
	<div class="flex justify-end">
		<a href="/superuser/tambah" role="button" class="btn hover:bg-slate-500/25">
			<PlusCircleIcon size="20" />
			<span class="ml-2">tambah data</span>
		</a>
	</div>

	<Search 
		on:search={handleSearch} 
		placeholder="cari berdasarkan nama user ..."
	/>
</div>

{#if !$loading && $error}
	<ErrorCard>{$error}</ErrorCard>
{/if}

{#if !$error}
	<div class="grid p-4">
		{#each $users as user, index (user.id)}
			<SuperuserCard 
				profile_picture={user.profile_picture}
				name={user.name}
				email={user.email}
				id={user.id}
				on:remove={handleRemove} 
			/>
		{/each}

		{#if $users.length < $total}
			<div class="grid place-content-center py-3">
				<LoadMoreButton loading={$loading} on:click={next} />
			</div>
		{/if}
	</div>

{/if}