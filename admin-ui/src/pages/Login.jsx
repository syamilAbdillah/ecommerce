export default function() {

	function hendleSubmit(event) {
		event.preventDefault()
		console.log(Object.fromEntries(new FormData(event.target)))
	}

	return <div className="h-screen flex justify-center items-center p-4 text-slate-700">
		<form className="block w-full max-w-md flex flex-col gap-4" onSubmit={hendleSubmit}>
			<legend>login</legend>
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


function TextInput(props) {
	return (
		<label className="block">
			<span className="text-gray-700">{props.label}</span>
			<input 
				ref={props.ref}
				type={props.type || 'text'} 
				name={props.name}
				className="form-input block w-full mt-1" 
				required={props.required}
			/>
		</label>
	)
}