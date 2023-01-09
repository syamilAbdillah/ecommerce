import { createRequesAPI } from "./base";

const api = createRequesAPI(`${import.meta.env.VITE_API}/products`)

/**
 * @typedef {Object} Product 
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {number} created_at
 * 
 */

/**
 * @param {{take: number; page: number}} pagination
 * @returns {Promise<{
 *  httpStatusCode: number;
 *  products?: Product[];
 *  total?: number;
 *  error?: string;
 * }>}
 */
export async function productFind({ take, page } = {take: 10, page: 1}) {
    const params = new URLSearchParams()
    params.append("take", String(take))
    params.append("page", String(page))

    return await api("?" + params.toString())
}

/**
 * 
 * 
 * @param {Product} data 
 * @returns {Promise<{
 *  httpStatusCode: number;
 *  product?: Product;
 *  error?: string; 
 *  invalid_errors?: Object<string, {rule: string; param?: string;}>
 * }>}
 */
export async function productCreate(data = {}) {
    return await api('/', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<{
 *  httpStatusCode: number;product: Product; error: string}>}
 */
export async function productGet(id) {
    return await api('/' + id)
}

/**
 * 
 * @param {string} id 
 * @param {Product} data 
 * @returns {Promise<{
 *  httpStatusCode: number;
 *  product?: Product;
 *  invalid_errors?: Object<string, {rule: string; param?: string}>
 *  error?: string;
 * }>}
 */
export async function productUpdate(id, data = {}) {
    return await api("/" + String(id), {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

/**
 * 
 * @param {string} id 
 * @returns {Promise<{
 *  product?: Product;
 *  error?: string;
 * }>}
 */
export async function productDelete(id) {
    return await api("/" + String(id), {method: 'DELETE'})
}