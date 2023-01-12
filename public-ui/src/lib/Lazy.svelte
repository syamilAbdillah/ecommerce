<!-- Lazy.svelte-->
<script>
    export let component;
</script>

{#await component.then ? component : component()}
    <p>Loading component...</p>
{:then Cmp}
   <svelte:component this={Cmp.default} />
{/await}