import { For, Show } from "solid-js"

function Table(props) {
    return <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full">
		<table className="table">
			<thead>
				<tr>
					<For each={props.columns}>
						{col => (
							<th>{col}</th>
						)}
					</For>
				</tr>
			</thead>
			<tbody>
				<For each={props.data}>
					{props.children}
				</For>
			</tbody>
		</table>
	</div>
}


export default Table