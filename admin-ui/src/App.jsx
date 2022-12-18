import { lazy } from 'solid-js'
import { Routes, Route } from '@solidjs/router'
import { findUsers } from './datastore/user.js'

const DashboardLayout = lazy(() => import('./pages/DashboardLayout.jsx'))
const SuperuserPage = lazy(() => import('./pages/Superuser.jsx'))
const ProductPage = lazy(() => import('./pages/Product.jsx'))
const LoginPage = lazy(() => import('./pages/Login.jsx'))
const HomePage = lazy(() => import('./pages/Home.jsx'))

function App() {
  return <Routes>
    <Route path="/" component={DashboardLayout}>
      <Route path="/superuser" component={SuperuserPage} data={findUsers}></Route> 
      <Route path="/produk" component={ProductPage}></Route>
      <Route path="/" component={HomePage}></Route>
    </Route>
    <Route path="/login" component={LoginPage}></Route>
  </Routes>
}

export default App
