<script>
	export let label
	export let error
	export let value = ''
	export let type = 'text'
	export let required
	export let placeholder = label

	const handleInput = ev => {
		value = ev.target.value
	}
</script>

<label class="block w-full bg-gray-50 px-4 py-2 rounded">
	{#if label}
		<p class="text-sm font-medium text-slate-500 mb-2">{label}</p>
	{/if}
	<input {required} {placeholder} {type} {value} on:input={handleInput} class="outline-none bg-inherit">
	{#if error}
		<p class="text-xs text-rose-500">{error}</p>
	{/if}
</label>