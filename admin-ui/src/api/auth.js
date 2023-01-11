import { createRequesAPI } from './base'

const api = createRequesAPI(`${import.meta.env.VITE_API}/auth`)

/**
 * 
 * @param {{ email: string; password: string; }} credentials 
 * @returns {Promise<{
 *  httpStatusCode: number;
 *  error?: string;
 *  user?: User;
 * }>}
 */
export async function authLogin(credentials) {
    return await api('/login', { method: 'POST', body: JSON.stringify(credentials) })
}

/**
 * 
 * @returns {Promise<{
 *  httpStatusCode: number;
 *  error?: string;
 *  user?: User;
 * }>}
 */
export async function authAuthenticate() {
    return await api('/me')
}
