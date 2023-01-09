import { Show } from "solid-js"
import { FiChevronRight } from 'solid-icons/fi'
import Table from "../components/Table"
import Avatar from "../components/Avatar"
import { useNavigate, useRouteData } from "@solidjs/router"
import { usePaginate } from '../components/usePaginate'
import { Paginate } from '../components/Paginate'
import { CreatePageButton } from '../components/Buttons'


export default function() {
	const data = useRouteData()
	const navigate = useNavigate()
	const paginate = usePaginate()

	const selected = id => e => {
		if(e.detail == 2) {
			navigate(`/superuser/${id}`)
		}
	}

	return (<>
		<CreatePageButton href="/superuser/tambah">superuser baru</CreatePageButton>
		<Show when={!data.loading}>
			<Show when={data?.().error}>
				<p>{data().error}</p>
			</Show>

			<Show when={data?.().users && data?.().total}>
				<p>total : {data().total}</p>
				<Table data={data().users} columns={['#', 'profile', 'nama', 'email', '...']}>
					{(user, index)=> <tr key={user.id} onClick={selected(user.id)}>
						<td>{(index() + 1) + paginate.skip()}</td>
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

				<Paginate
					onNext={paginate.next}
					onPrev={paginate.prev}
					isNextDisabled={(paginate.skip() + data().users.length) >= data().total}
					isPrevDisabled={paginate.page() < 2}
				/>
			</Show>
		</Show>

		<Show when={data.loading}>
			<p>loading....</p>
		</Show>
	</>)
}