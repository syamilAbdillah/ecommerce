import { Show } from "solid-js"
import { FiChevronRight, FiPlusSquare } from 'solid-icons/fi'
import userStore, {findUsers} from "../datastore/user"
import Table from "../components/Table"
import Avatar from "../components/Avatar"
import { A } from "@solidjs/router"


export default function() {
	return (<>
		<A href="/superuser/tambah" inactiveClass="btn btn-neutral mb-4" onClick={findUsers}>
			<span>superuser baru</span>
			<FiPlusSquare></FiPlusSquare>
		</A>
		<Show when={!userStore.loading && !userStore.error}>
			<Table data={userStore.users} columns={['#', 'profile', 'name', 'email', '...']}>
				{(user, index)=> <tr>
					<td>{index() + 1}</td>
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
		</Show>

		<Show when={userStore.loading}>
			<p>loading....</p>
		</Show>

		<Show when={userStore.error}>
			<p>{userStore.error}</p>
		</Show>
	</>)
}