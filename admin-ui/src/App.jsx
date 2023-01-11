import { lazy, onMount, Show } from 'solid-js'
import { Routes, Route } from '@solidjs/router'
import { Toaster } from './components/Toaster'

const DashboardLayout = lazy(() => import('./pages/DashboardLayout.jsx'))

const SuperuserPage = lazy(() => import('./pages/Superuser.jsx'))
import SuperuserData from './pages/SuperuserData'
const SuperuserDetailPage = lazy(() => import('./pages/SuperuserDetail.jsx'))
import SuperuserDetailData from './pages/SuperuserDetailData'
const SuperuserCreatePage = lazy(() => import('./pages/SuperuserCreate.jsx'))

const ProductPage = lazy(() => import('./pages/Product.jsx'))
import { productData } from './pages/ProductData'
const ProductCreatePage = lazy(() => import('./pages/ProductCreate'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetail'))
import { productDetailData } from './pages/ProductDetailData'
import { useAuthenticateService } from './components/serviceAuth'

const HomePage = lazy(() => import('./pages/Home.jsx'))
const LoginPage = lazy(() => import('./pages/Login'))

function App() {
	const authServ = useAuthenticateService()

	onMount(() => authServ.authenticate())

	return <>
		<Toaster/>
		<Show when={authServ.loading()}>
			<div className="flex justify-center w-auto py-12">
				<span className="text-2xl">authenticating....</span>
			</div>
		</Show>
		<Show when={!authServ.loading()}>
			<Routes>
				<Route path="/" component={DashboardLayout}>
					<Route 
						path="/superuser"
					>
						<Route 
							path="/tambah" 
							component={SuperuserCreatePage}
						></Route>
						<Route
							path="/:id"
							component={SuperuserDetailPage}
							data={SuperuserDetailData}
						></Route>
						<Route 
							path="/" 
							component={SuperuserPage} 
							data={SuperuserData}
						></Route>
					</Route> 
					<Route path="/produk">
						<Route 
							path="/tambah" 
							component={ProductCreatePage} 
						></Route>
						<Route 
							path="/:id" 
							component={ProductDetailPage} 
							data={productDetailData}
						></Route>
						<Route 
							path="/" 
							component={ProductPage} 
							data={productData}
						></Route>
					</Route>
					<Route path="/" component={HomePage}></Route>
				</Route>
				<Route path="/login" component={LoginPage}/>
			</Routes>
		</Show>
	</>
}

export default App
