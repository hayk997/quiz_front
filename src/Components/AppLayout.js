import React, {Component, Suspense} from "react";
import {ConfigProvider, Layout} from "antd";
import {connect} from 'react-redux'
import HeaderComp from "./Header/HeaderComp";
import SiderComp from "./Sider/SiderComp";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Login from "./Auth/Login";
import Registration from "./Auth/Registration";
import Profile from "./Profile/Profile";
import Psy from "./PsyTest/Psy";
import UploadAnswerImage from "./Upload/Upload";
import Quizes from "./Quizes/Quizes";
import Quiz from "./Quizes/Quiz";
const { Content} = Layout;
/**
 *
 * @param Component
 * @param rest
 * @param isLoggedIn
 * @returns {*}
 * @constructor
 * private routes only for logged users
 */
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
class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
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
            <section className='ant-layout' style={{minHeight:'720px'}}>
                <HeaderComp/>
                <Layout>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}>
                                        <Switch>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn(false)} exact path="/account/tasks" component={Tasks}/>
                                            <Route exact path="/" component={Login}/>
                                            <Route exact path="/reg" component={Registration}/>
                                            <Route exact path="/profile" component={Profile}/>
                                            <Route exact path='/psytest' component={Psy}/>
                                            <Route exact path='/upload' component={UploadAnswerImage}/>
                                            <Route exact path='/quizes' component={Quizes}/>
                                            <Route exact path='/quizes/:id' component={Quiz}/>
                                        </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </section>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    () => ({

    })
)(AppLayout);
