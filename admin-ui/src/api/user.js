import base from './base'

/**
 * @typedef {Object} User user model
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [password]
 * @property {number} created_at epoch timestamp in milisecond
 * @property {'superuser' | 'user'} role
 * @property {string} profile_picture
 */


const userApi =  {
    __proto__: base,
    path: '/users',

    async find({take, page} = {take: 10, page: 1}) {
        const params = new URLSearchParams()
        params.append('take', take)
        params.append('page', page)
        
        return await this.req('?' + params.toString())
    },

    /**
     * 
     * @param {string} id 
     * @returns {Promise<{user?: User, error?: string}>}
     */
    async get(id) {
        return await this.req('/' + id)
    },

    /**
     * 
     * @param {{name: string, email: string, password: string}} userData 
     * 
     * @returns {Promise<{user?: User, invalid_errors?: Object<string,string>, error?: string}>}
     */
    async create(userData = {}) {
        return await this.req('/', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
    },

    /**
     * 
     * @param {string} id 
     * @param {{name: string, email: string, password: string}} userData 
     * @returns {Promise<{
     *  user?: User,
     * invalid_errors?: Object<string,string>,
     * error?: string
     * }>}
     */
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