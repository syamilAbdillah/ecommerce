const baseApi =  {
    baseURL: import.meta.env.VITE_API,
    path: '',

    async req(url = '', options = {}) {
        let res = new Response()
        let body = ''

        try {
            res = await fetch(this.baseURL + this.path + url, {
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
            if(!body.length) return {error: error.message}
        
            return {error: body, httpStatusCode: res.status}
        }
    }
}

export default baseApi