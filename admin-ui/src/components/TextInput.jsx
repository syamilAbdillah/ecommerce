function TextInput(props) {
	const id = props.id || Math.random() * 10e9
	return (
		<div className="relative flex flex-col mt-3">
			<input 
				id={id}
				ref={props.ref}
				type={props.type || 'text'} 
				name={props.name}
				placeholder={props.label}
				required={props.required}
				value={props.value || ""}
				className={"peer bg-gray-50 placeholder-shown:bg-gray-100 rounded px-4 py-2 outline outline-1 placeholder:text-gray-100 placeholder-shown:outline-0 focus:outline-1 " + (props.error ? "focus:outline-rose-500 outline-rose-500": "focus:outline-gray-700 outline-gray-700")} 
			/>
			<label htmlFor={id} className="absolute left-4 top-2 -translate-y-6 -translate-x-4  px-[2px] py-0 text-xs text-gray-700 transition peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-6 peer-focus:-translate-x-4 peer-focus:text-xs peer-focus:text-gray-700">{props.label}</label>
			<Show when={props.error}>
				<span className="text-rose-500 mt-1">{props.error || "error message"}</span>
			</Show>
		</div>
	)
}

/*

<div class="relative flex flex-col">
<input 
type="password" 
id="input-passowrd" 
placeholder="email" 
class="peer placeholder-shown:bg-gray-50 rounded px-4 py-2 outline outline-1 outline-violet-500 placeholder:text-white placeholder-shown:outline-0 focus:outline-1 focus:outline-violet-500" />
<label 
for="input-passowrd" 
class="absolute left-4 top-2 -translate-y-6 -translate-x-4  px-[2px] py-0 text-xs text-violet-500 transition peer-placeholder-shown:translate-x-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:-translate-y-6 peer-focus:-translate-x-4 peer-focus:text-xs peer-focus:text-violet-500">Password</label>
</div>

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
*/

export default TextInput