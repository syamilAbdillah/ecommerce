import TextInput from "../components/TextInput"
import { useLoginService, user } from "../components/serviceAuth"
import { createEffect } from "solid-js"
import { useNavigate } from "@solidjs/router"

export default function() {
	const loginServ = useLoginService()
	const navigate = useNavigate()

	async function hendleSubmit(event) {
		event.preventDefault()

		const credentials = Object.fromEntries(new FormData(event.target))
		loginServ.login(credentials)
	}

	createEffect(() => {
		if(user()) {
			navigate('/')
		}
	})

	return <div className="h-screen flex justify-center items-center p-4 text-slate-700">
		<form className="block w-full max-w-md flex flex-col gap-4" onSubmit={hendleSubmit}>
			<legend className="text-2xl font-bold text-center">login</legend>
			<TextInput name="email" label="email" type="email" required={true}/>
			<TextInput name="password"  type="password" label="password" required={true}/>
			<div className="flex justify-end">

				<Show when={loginServ.loading()}>
					<button disabled className="btn bg-gray-100">
						loading...
					</button>
				</Show>
				<Show when={!loginServ.loading()}>
					<button className="btn bg-gray-700 text-white" >
						login
					</button>
				</Show>
			</div>
		</form>
	</div>
}
