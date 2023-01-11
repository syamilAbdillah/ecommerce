import { createEffect, Show } from 'solid-js'
import { Outlet, useNavigate } from '@solidjs/router'
import Sidebar, {Toggle} from '@/components/Sidebar.jsx'

import { user } from '../components/serviceAuth'


export default function() {
	const navigate = useNavigate()

	createEffect(() => {
	
		if(!user()) {
			navigate('/login', { replace: true })
		}

	})

	return (<>
		<Show when={user()}>
			<div className="flex h-screen">
				<Sidebar/>
				<div className="relative flex-1 min-h-screen px-4 pb-4 pt-16 lg:pt-4 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full">
					<Toggle></Toggle>
					<Outlet/>
				</div>
			</div>
		</Show>
	</>
	)	
}