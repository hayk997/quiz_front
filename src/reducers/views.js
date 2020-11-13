export default function views(state = {}, action){
    if(action.type === 'VIEW_PAGE'){
        if(state[action.payload.page]){
            if(!state[action.payload.page].includes(action.payload.id)){
                state[action.payload.page].push(action.payload.id)
            }
        }else{
            state[action.payload.page] = [action.payload.id]
        }
        return {...state}
    }
    if(action.type === 'LOGOUT'){
        return {}
    }
    return state;
}
