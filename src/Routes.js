import React, {Component,Suspense} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {connect} from 'react-redux'
import {ConfigProvider} from "antd";
import HeaderComp from "./Components/Header/HeaderComp";
import AppLayout from "./Components/AppLayout";
import Login from "./Components/Auth/Login";

class Routes extends Component {

    render() {
        return (
            <ConfigProvider>
                    <BrowserRouter>
                        <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route exact path="/" component={Login}/>
                        </Switch>
                        </Suspense>
                    </BrowserRouter>
            </ConfigProvider>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(Routes);
