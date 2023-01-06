import { failed, success } from "../components/Toaster"

export default function() {
	const handleClick = () => {
		const rand = Math.random()
		const message = String(rand)
		if(rand < 0.5) {
			success(message)
		} else {
			failed(message)
		}
	}
	return <button className="btn btn-primary" onClick={handleClick}>add toast</button>
}