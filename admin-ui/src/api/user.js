import base from './base'

export default {
    __proto__: base,
    path: '/users',

    async find({take, page} = {take: 10, page: 1}) {
        return await this.req(`?take=${take || 10}&page=${page || 1}`)
    },

    async create(userData = {}) {
        return await this.req('/', {
            method: 'POST',
            body: JSON.parse(userData)
        })
    },

    async update(id, userData = {}) {
        return await this.req(`/${id}`, {
            method: 'PUT',
            body: JSON.parse(userData)
        })
    },

    async remove(id) {
        return await this.req(`/${id}`, {method: 'DELETE'})
    },
}