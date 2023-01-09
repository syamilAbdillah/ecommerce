import { lazy } from 'solid-js'
import { Routes, Route } from '@solidjs/router'

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

const LoginPage = lazy(() => import('./pages/Login.jsx'))
const HomePage = lazy(() => import('./pages/Home.jsx'))

function App() {
	return <Routes>
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
		<Route path="/login" component={LoginPage}></Route>
	</Routes>
}

export default App
