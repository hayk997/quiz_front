import React from 'react';
import ReactDOM from 'react-dom';
import {PersistGate} from 'redux-persist/integration/react'
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configureStore'
import 'antd/dist/antd.css';
import './dist/custom.sass';
import Routes from "./Routes";


const {persistor, store} = configureStore();

if(!store.getState().Intl || !store.getState().Intl.locale){
    //default app locale set hy
    store.dispatch({
        type: "LOCALE",
        payload:'hy'
    })
}
ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Routes store={store}/>
        </PersistGate>
    </Provider>, document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
