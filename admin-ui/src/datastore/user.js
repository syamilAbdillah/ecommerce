import { createStore } from 'solid-js/store'
import apiUser from '@/api/user'

const [userStore, setUserStore] = createStore({
    users: [],
    total: 0,
    loading: false,
    error: undefined,
    invalidErrors: undefined,
})

export default userStore

export async function findUsers({take, page} = {take: 10, page: 1}) {
    setUserStore(() => ({
        loading: true, 
        error: undefined, 
        invalidErrors: undefined 
    }))
    
    const result = await apiUser.find({take, page})
    if(result.users && result.total) {
        setUserStore(() => ({
            users: result.users,
            total: result.total,
        }))
    }

    if(result.error) {
        setUserStore(() => ({ error: result.error }))
    }

    setUserStore(() => ({ loading: false }))
}

export async function createUser(userData = {}) {
    if(userData.password != userData.confirm) {
        const invalidErrors = {confirm: 'tidak cocok dengan password'}
    
        console.table({pw: userData.password, conf: userData.confirm})

        setUserStore(() => ({invalidErrors}))
        return {invalidErrors}
    }

    setUserStore(() => ({
        loading: true, 
        error: undefined, 
        invalidErrors: undefined 
    }))
    
    const result = await apiUser.create(userData)

    setUserStore(() => ({
        loading: false,
        error: result.error,
        invalidErrors: result.invalid_errors,
    }))

    return {...result, invalidErrors: result.invalid_errors}
}