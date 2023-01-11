import { createRequesAPI } from "../api/base"
import { failed, success } from "../components/Toaster"

export default function() {
	const handleClick = async () => {
		const api = createRequesAPI("http://localhost:8080")
		const result = await api('/ping')
		console.table(result)
	}
	return <button className="btn btn-primary" onClick={handleClick}>ping pong</button>
}