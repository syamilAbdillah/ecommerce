/**
 * @type Object<string, (param: string) => string>
 */
const errorMessageMap = {
    'min': param => `minimal berjumlah ${param} karakter`,
    'max': param => `maximal berjumlah ${param} karakter`,
    'gt': param => `masukan angka lebih dari ${param}`,
    'email': () => 'masukan dengan format email yang benar',
    'unique': () => 'masukan nilai yang unik, nilai tsb telah digunakan',
    'required': () => 'tidak boleh kosong',
}

/**
 * 
 * @param {string} key 
 * @param {string} param 
 * @returns {string}
 */
export function dispatch(key, param) {
    if(typeof errorMessageMap[key] == 'function') {
        return errorMessageMap[key](param)
    }
    
    return key
}