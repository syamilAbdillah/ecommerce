import { Show, For } from "solid-js"
import userStore, {findUsers} from "../datastore/user"

export default function() {
	return (<>
		<button className="btn bg-indigo-50 text-indigo-700" onClick={findUsers}>next</button>
		<Show when={!userStore.loading && !userStore.error}>
			<p>total: {userStore.total}</p>
			<For each={userStore.users}>
				{(user) => (
					<p>id:{user.id} email:{user.email}</p>
				)}
			</For>
		</Show>

		<Show when={userStore.loading}>
			<p>loading....</p>
		</Show>

		<Show when={userStore.error}>
			<p>{userStore.error}</p>
		</Show>
	</>)
}

function Table(props) {
	return <>
		<table className="table">

		</table>
	</>
}
