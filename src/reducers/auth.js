export default function auth(state = {}, action){
    if(action.type === 'AUTH'){
        return{
            ...state,
            token: 'Bearer ' + action.payload.access_token,
            user: action.payload.user,
            permissions: action.payload.permissions,
        }
    }
    if(action.type === 'LOGOUT'){
        return {}
    }

    return state;
}