<!-- Lazy.svelte-->
<script>
    import Loading from './Loading.svelte'
    export let component;
</script>

{#await component.then ? component : component()}
    <slot name="loading">
        <Loading/>
    </slot>
{:then Cmp}
   <svelte:component this={Cmp.default} />
{/await}