import { createSignal,  Show } from 'solid-js'
import { A, useBeforeLeave } from '@solidjs/router'
import { FiUser, FiHome, FiPackage, FiMenu } from 'solid-icons/fi'
import { clickOutside } from './directives'
import Avatar from './Avatar'

const [active, setActive] = createSignal(false)
const open = () => setActive(true)
const close = () => setActive(false)

function Sidebar() {
	return (<>
		<Overlay/>
		<aside className={"h-screen w-64 fixed z-50 lg:translate-x-0 lg:relative flex flex-col justify-between items-center bg-white border transition " + (active() ? "translate-x-0": "-translate-x-64")}>
			<SidebarHeader title="Admin UI"/>
			<div className="flex-1 w-full flex flex-col gap-2 overflow-y-auto p-4 scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full">
				<Items title="dashboard">
					<>
						<Item href="/" icon={FiHome} end={true}>
							Home
						</Item>
					</>
				</Items>
				<Items title="data master">
					<>
						<Item href="/superuser" icon={FiUser}>
							Superuser
						</Item>
						<Item href="/produk" icon={FiPackage}>
							Produk
						</Item>
					</>
				</Items>
			</div>
			<SidebarFooter name="John Doe" email="johndoe@email.com"/>
		</aside>
	</>)
}

export default Sidebar

export function Toggle() {
	useBeforeLeave(() => {
		if(active()) {
			close()
		}
	})

	return (
		<button className="lg:hidden text-xl absolute top-4 left-4 z-30 p-2 rounded hover:bg-gray-300" onClick={open}>
			<FiMenu/>
		</button>
	)
}




// helper
function Overlay() {
	return <div className={"lg:hidden w-screen h-screen z-50 bg-gray-500/25 " + (active() ? "fixed": "hidden")} onClick={close}></div>
}

function Item(props) {
	const Icon = props.icon
	return(
		<li>
			<A 
				href={props.href}
				activeClass="py-2 px-4 flex items-center gap-3 bg-gray-50 rounded-md" 
				inactiveClass="py-2 px-4 hover:bg-gray-50 flex items-center gap-3 rounded-md"
				end={props.end}
			>
				<Icon/>
				<span className="font-thin">{props.children}</span>
			</A>
		</li>
	)
}

function Items(props) {
	return (<>
		<Title>{props.title}</Title>
		<ul className="flex flex-col gap-1 text-gray-600">
			{props.children}
		</ul>
	</>)
}

function Title(props) {
	return <p className="text-xs mt-4 first:mt-0 uppercase text-gray-500 font-medium">{props.children}</p>
}

function SidebarHeader(props) {
	return (
		<div className="flex-0 py-4 w-full">
			<h2 className="text-lg font-medium text-center">{props.title}</h2>
		</div>
	)
}

function SidebarFooter(props){
	const [show, setShow] = createSignal(false)
	const open = () => setShow(true)
	const close = () => setShow(false)
	return(
		<div className="flex flex-col border w-full">
			<div className="flex-0 flex items-center gap-2 p-4 cursor-pointer" onClick={open} use:clickOutside={close}>
				<Avatar 
					alt="profile"
					src="https://avatars.dicebear.com/api/adventurer/default-facehook-profile.svg" 
				/>
				<div>
					<h2 className="text-md font-medium">{props.name}</h2>
					<p className="text-gray-600 font-thin text-sm">{props.email}</p>
				</div>
			</div>
			<Show when={show()}>
				<div className="flex flex-col gap-2 p-2 mb-4">
					<button className="btn bg-gray-200">view your profile</button>
					<button className="btn bg-rose-100 text-rose-600">logout</button>
				</div>
			</Show>
		</div>
	)
}