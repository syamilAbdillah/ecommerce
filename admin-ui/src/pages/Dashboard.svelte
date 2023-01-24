<script>
    import { Route } from 'tinro'
    import DashboardLayout from '../lib/DashboardLayout.svelte'
    import Lazy from '../lib/Lazy.svelte'
</script>

<DashboardLayout>
    <Route path="/">
        <p>home index</p>
    </Route>
    <Route path="/superuser/*">
        <Route path="/">
            <Lazy 
                component={
                    () => import('../lib/PageSuperuser.svelte')
                } 
            />
        </Route>
        <Route path="/tambah">
            <Lazy 
                component={
                    () => import('../lib/PageSuperuserCreate.svelte')
                } 
            />
        </Route>
    </Route>
    <Route path="/produk">
        <Lazy
            component={
                () => import('./products/PageProduct.svelte')
            }
        />
    </Route>
</DashboardLayout>