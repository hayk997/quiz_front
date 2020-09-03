import React, {Component,Suspense, lazy} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {connect} from 'react-redux'
import Login from "./Components/Auth/Login";
import Forgot from "./Components/Auth/Forgot";
import Reset from "./Components/Auth/Reset";



const PrivateRoute = ({ component: Component, ...rest }, isLoggedIn) => (
    <Route
        {...rest}
        render={props =>
            rest.isLoggedIn ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/" }} />
            )
        }
    />
);

class Routes extends Component {


    /**
     * @returns {string | auth | {token} | {basic} | {} | * | boolean}
     * check user logged in and user permissions
     */

    isLoggedIn(permission) {
        return this.props.store.getState().auth && this.props.store.getState().auth.token && this.props.store.getState().auth.user //check auth
            && (!permission || this.props.store.getState().auth.user.is_admin || this.props.store.getState().auth.user.permissions.indexOf(permission) !== -1)
    }

    render() {
        return (
            <ConfigProvider locale={andLocales[this.props.state.Intl.locale]}>
                <IntlProvider translations={translations}>
                    <BrowserRouter>
                        <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route exact path="/" component={Login}/>
                            <Route path="/forgot" component={Forgot}/>
                            <Route path="/password/reset/:token" component={Reset}/>
                            <Switch>
                                <PrivateRoute isLoggedIn={this.isLoggedIn("storeSettings")} exact path="/account/settings" component={Settings}/>
                                <PrivateRoute isLoggedIn={this.isLoggedIn(false)} exact path="/account/tasks" component={Tasks}/>
                                <Route path='*' exact={true} component={NotFound} />

                            </Switch>

                        </Switch>
                        </Suspense>
                    </BrowserRouter>
                </IntlProvider>
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
