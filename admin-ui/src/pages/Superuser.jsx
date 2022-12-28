import { Show } from "solid-js"
import { FiChevronRight, FiPlusSquare } from 'solid-icons/fi'
import userStore, {findUsers} from "../datastore/user"
import Table from "../components/Table"
import Avatar from "../components/Avatar"
import { A, useNavigate, useRouteData, useSearchParams } from "@solidjs/router"


export default function() {
	const data = useRouteData()
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	
	const selected = id => e => {
		if(e.detail == 2) {
			navigate(`/superuser/${id}`)
		}
	}

	const prev = e => setSearchParams({
		page: searchParams.page? Number(searchParams.page) -1: 1
	})

	const next = e => {
		console.log(searchParams.page)
		setSearchParams({
			page: searchParams.page? Number(searchParams.page) + 1: 2
		})
	}

	return (<>
		<A href="/superuser/tambah" inactiveClass="btn btn-neutral mb-4" onClick={findUsers}>
			<span>superuser baru</span>
			<FiPlusSquare></FiPlusSquare>
		</A>
		<Show when={!data.loading}>
			<Show when={data?.().error}>
				<p>{data().error}</p>
			</Show>

			<Show when={data?.().users && data?.().total}>
				<p>total : {data().total}</p>
				<Table data={data().users} columns={['#', 'profile', 'name', 'email', '...']}>
					{(user, index)=> <tr key={user.id} onClick={selected(user.id)}>
						<td>{(index() + 1) + (searchParams.page ? ((searchParams.take ? Number(searchParams.take): data().users.length) * (Number(searchParams.page) - 1)): 0)}</td>
						<td>
							<Avatar src={user.profile_picture} alt={user.id + '-' + user.name} />
						</td>
						<td>{user.name}</td>
						<td>{user.email}</td>
						<td>
							<FiChevronRight/>
						</td>
					</tr>}
				</Table>

				<div className="flex justify-between py-4">
					<button 
						className="btn btn-neutral" 
						onClick={prev}
						disabled={!searchParams.page?.length || (Number(searchParams.page) < 2)}
					>prev</button>
					<button 
						className="btn btn-neutral" 
						onClick={next}
						disabled={data().total <= (searchParams.take ? Number(searchParams.take): data().users.length) * (searchParams.page || 1)}
					>next</button>
				</div>
			</Show>
		</Show>

		<Show when={data.loading}>
			<p>loading....</p>
		</Show>
	</>)
}