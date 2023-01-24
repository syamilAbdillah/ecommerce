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

export function invalidErrorsMapper(invalid_errors) {
	const errorsMap = {
		"min": param => `minimal ${param} karakter`,
		"max": param => `maksimal ${param} karakter`,
		"required": () => `tidak boleh kosong`,
		"unique": () => `telah digunakan, masukan nilai lain`,
		"gt": param => `harus lebih besar dari ${param}`,
	}

	return Object.keys(invalid_errors).reduce((acc, curr) => {
		const {rule, param} = invalid_errors[curr]
		const errRule = errorsMap[rule]
		
		acc[curr] = (typeof errRule == 'function') ? 
			errRule(param): 
			`${rule}(${param})` 

		return acc
	}, {})
}

export const rand = () => Math.floor(Math.random() * 10e9) + '-' + Date.now()