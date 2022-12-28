import base from './base'

const userApi =  {
    __proto__: base,
    path: '/users',

    async find({take, page} = {take: 10, page: 1}) {
        const params = new URLSearchParams()
        params.append('take', take)
        params.append('page', page)
        
        return await this.req('?' + params.toString())
    },

    async get(id) {
        return await this.req('/' + id)
    },

    async create(userData = {}) {
        return await this.req('/', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
    },

    async update(id, userData = {}) {
        return await this.req(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
    },

    async remove(id) {
        return await this.req(`/${id}`, {method: 'DELETE'})
    },
}


export default userApi