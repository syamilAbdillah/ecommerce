/**
 * 
 * @param {string} baseURL 
 * @returns 
 */
export function createRequesAPI(baseURL = '') {
    /**
     * 
     * 
     * @param {string} subURL url = baseURL + subURL 
     * @param {Object} opt fetch option
     * @returns {Promise<{error?: string, httpStatusCode: number}>}
     */
    async function requestAPI(subURL = '', options = {}) {
        let res = new Response()
        let body = ''

        try {
            res = await fetch(baseURL + subURL, {
                ...options, 
                credentials: 'include',
                keepalive: true,
            })
            body = await res.text()
        } catch(error) {
            if(import.meta.env.DEV) {
                console.table({error})
            }

            return {error: error.message, httpStatusCode: res.status}
        }

        // parsing
        try {
            const result = JSON.parse(body)
            result.httpStatusCode = res.status
            return result
        } catch(error) {
            if(!body.length) return {error: error.message, httpStatusCode: res.status}
        
            return {error: body, httpStatusCode: res.status}
        }
    }

    return requestAPI  
}