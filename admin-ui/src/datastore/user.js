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
            loading: false,
        }))

        return
    }

    setUserStore(() => ({
        error: result.error, 
        loading: false
    }))
}

function reset() {
    setUserStore({
        users: [],
        total: 0,
        loading: false,
        error: undefined,
        invalidErrors: undefined,
    })
}