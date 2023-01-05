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


import { createRequesAPI } from './base'

const api = createRequesAPI(`${import.meta.env.VITE_API}/users`)

/**
 * 
 * @param {{take: number, page: number}} param0 
 * @returns {Promise<{
 *  httpStatusCode: number,
 *  users?: User[],
 *  total?: number,
 *  error?: string,
 * }>}
 */
export async function userFind({take, page} = {take: 10, page: 1}) {
    const params = new URLSearchParams()
    params.append('take', take)
    params.append('page', page)
    
    return await api('?' + params.toString())
}

/**
 * 
 * @param {string} id user's unique id 
 * @returns {Promise<{
 *  httpStatusCode: number,
 *  user?: User,
 *  error?: string,
 * }>}
 */
export async function userGetById(id) {
    return await api('/' + id)
}

/**
 * 
 * @param {{name: string, email: string, password: string}} userData 
 * @returns {Promise<{
 *  httpStatusCode: number,
 *  user?: User, 
 *  invalid_errors?: Object<string,string>, 
 *  error?: string
 * }>}
 */
export async function userCreate(userData = {}) {
    return await api('/', {
        method: 'POST',
        body: JSON.stringify(userData),
    })
}

/**
 * 
 * @param {string} id 
 * @param {{name: string, password: string, email: string}} userData 
 * @returns {Promise<{
 *  httpStatusCode: number,
 *  user?: User,
 *  invalid_errors?: Object<string,string>,
 *  error?: string
 * }>}
 */
export async function userUpdate(id = '', userData = {}) {
    return await api('/' + id, {
        method: 'PUT',
        body: JSON.stringify(userData)
    })
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<{
 *  httpStatusCode: number,
 *  user?: User,
 *  error?: string,
 * }>}
 */
export async function userDelete(id = '') {
    return await api('/' + id, { method: 'DELETE' })
}