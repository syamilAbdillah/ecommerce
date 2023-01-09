import { Show } from "solid-js"
import { useNavigate, useRouteData } from "@solidjs/router"
import { FiChevronRight } from "solid-icons/fi"
import Table from '../components/Table'
import Avatar from "../components/Avatar"
import { Paginate } from "../components/Paginate"
import { usePaginate } from "../components/usePaginate"
import { CreatePageButton } from "../components/Buttons"

export default function() {
	const data = useRouteData()
	const navigate = useNavigate()
	const paginate = usePaginate()


	const selected = id => e => {
		if(e.detail == 2) {
			navigate(`/produk/${id}`)
		}
	}

	return <>
		<CreatePageButton href="/produk/tambah">tambah produk baru</CreatePageButton>
		<Show when={!data.loading}>
			<Show when={data?.().products && (data?.().total != undefined)}>
				<Table data={data?.().products} columns={['#', 'gambar', 'nama', 'harga', '...']}>
					{(product, index) => <tr onClick={selected(product.id)}>
						<td>{(index() + 1) + (paginate.skip())}</td>
						<td>
							<Avatar src={product.image} alt={product.id + '-' + product.name} />
						</td>
						<td>{product.name}</td>
						<td>{product.price}</td>
						<td>
							<FiChevronRight/>
						</td>
					</tr>}
				</Table>

				<Paginate 
					onPrev={paginate.prev} 
					onNext={paginate.next} 
					isPrevDisabled={paginate.page() < 2} 
					isNextDisabled={(paginate.skip() +  data().products.length) >= data().total}
				></Paginate>
			</Show>
		</Show>
	
	</>
}