/**
 * @params {number} number
 * @return {string} convert number to currency format in string
 * */

export function toCurrency(number) {
	const arr = String(number).split('')
	if(arr.length < 1) return "0"

	const indexStart = arr.length - 1
	
	let result = ''
	for (let i = indexStart; i >= 0; i--) {
		const x = indexStart - i
		
		if((x != 0) && (x % 3) == 0) {
			result = arr[i] + '.' + result
			continue
		}

		result = arr[i] + result
	}

	return result
}