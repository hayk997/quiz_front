export default function auth(state = {}, action){
    if(action.type === 'AUTH'){
        return{
            token: action.payload.accessToken,
            user: action.payload.user,
        }
    }
    if(action.type === 'LOGOUT'){
        return {}
    }

    return state;
}
