export default function auth(state = {}, action){
    if(action.type === 'AUTH'){
        return{
            token: action.payload.accessToken,
            user: action.payload.user,
        }
    }
    if(action.type==='UPDATE'){
        console.log(action.payload)
        return {
            ...state,
            user: {...state.user,...action.payload}//payload-user
        }
    }
    if(action.type === 'LOGOUT'){
        return {}
    }
    return state;
}
