import { Outlet } from '@solidjs/router'
import Sidebar, {Toggle} from '@/components/Sidebar.jsx'

export default function() {
	return (
		<div className="flex min-h-screen">
			<Sidebar/>
			<div className="relative flex-1 min-h-screen px-4 pb-4 pt-16 lg:pt-4 bg-gray-100">
				<Toggle></Toggle>
				<Outlet/>
	    	</div>
		</div>
	)	
}