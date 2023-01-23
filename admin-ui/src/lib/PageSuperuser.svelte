<script>
	import { fade } from 'svelte/transition'
	import { PlusCircleIcon } from 'svelte-feather-icons'
	import { useUserFind, useUserRemove } from './services.user'
	import LoadMoreButton from './LoadMoreButton.svelte'
	import SuperuserCard from './SuperuserCard.svelte'
	import Search from './Search.svelte'
	import ErrorCard from './ErrorCard.svelte'
	import Confirm from './Confirm.svelte'
	import { pushDanger, pushSuccess } from './Toaster.svelte'

	const {find, next: append, loading, error, users, total} = useUserFind()
	
	let take = 4
	let page = 1

	const next = () => {
		if($users.length >= $total) return

		page += 1
		append(take, page)
	}

	const handleSearch = ev => alert('search value is ' + ev.detail.value)
	
	const { loading: rmLoading, error: rmError, user: removed, remove } = useUserRemove()

	let selectedId
	let confirmOpen = false
	
	const handleClose = () => {
		if($rmLoading) return
		confirmOpen = false
	}
	const handleOpen = ev =>{ 
		selectedId = ev.detail.id
		confirmOpen = true
	}
	const handleConfirm = async () => remove(selectedId)

	find(take, page)

	$: {
		if($rmError) {
			confirmOpen = false
			selectedId = undefined
			pushDanger('gagal menghapus user, tolong ulangi')
		}
		if($removed && confirmOpen) {
			confirmOpen = false
			selectedId = undefined
			pushSuccess('berhasil menghapus user -> ' + $removed?.email)
			page = 1
			find(take, page)
		}
	}
</script>

<Confirm 
	on:close={handleClose} 
	on:confirm={handleConfirm} 
	open={confirmOpen} 
	text="apa anda yakin ?"
	loading={$rmLoading}
/>

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
				on:remove={handleOpen} 
			/>
		{/each}

		{#if $users.length < $total}
			<div class="grid place-content-center py-3">
				<LoadMoreButton loading={$loading} on:click={next} />
			</div>
		{/if}
	</div>

{/if}