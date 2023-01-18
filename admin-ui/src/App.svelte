<script>
    import Toaster, { push } from './lib/Toaster.svelte'
    import Loading from './lib/Loading.svelte'
    import { useAuthenticate, user } from './lib/services.auth'
    import Lazy from './lib/Lazy.svelte'

    const Dashboard = import('./lib/Dashboard.svelte')
    const LoginPage = import('./lib/LoginPage.svelte')

    const {loading, authenticate} = useAuthenticate()
    authenticate()

    $: {
        if($user) {
            console.log($user)
            push(`selamat data kembali ${$user.name}`)
        }
    }
</script>


<Toaster/>

{#if $loading}
    <div class="min-h-screen flex justify-center items-center">
        <Loading/>
    </div>
{:else}
    {#if $user}
        <Lazy component={Dashboard}/>
    {:else}
        <Lazy component={LoginPage}>
            <div class="min-h-screen flex justify-center items-center" slot="loading">
                <Loading/>
            </div>
        </Lazy>
    {/if}
{/if}