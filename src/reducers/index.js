import { combineReducers } from 'redux';
import auth from './auth'
import views from "./views";

export default combineReducers({
    auth,
    views
})
