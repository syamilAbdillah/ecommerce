import TextInput from "../components/TextInput"
export default function() {

	function hendleSubmit(event) {
		event.preventDefault()
		console.log(Object.fromEntries(new FormData(event.target)))
	}

	return <div className="h-screen flex justify-center items-center p-4 text-slate-700">
		<form className="block w-full max-w-md flex flex-col gap-4" onSubmit={hendleSubmit}>
			<legend className="text-2xl font-bold text-center">login</legend>
			<TextInput name="email" label="email" type="email" required={true}/>
			<TextInput name="password"  type="password" label="password" required={true}/>
			<div className="flex justify-end">
				<button className="btn bg-gray-700 text-white" >
					login
				</button>
			</div>
		</form>
	</div>
}
