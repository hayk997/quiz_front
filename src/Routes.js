import React, {Component,Suspense} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {connect} from 'react-redux'
import {ConfigProvider} from "antd";
import Login from "./Components/Auth/Login";
import Registration from "./Components/Auth/Registration";
import AppLayout from "./Components/AppLayout";

class Routes extends Component {

    render() {
        return (
            <ConfigProvider>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/single" ><h1>Another Route without Layout</h1></Route>
                    <Route path={'*'}> <AppLayout/></Route>
                </Switch>
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
