import React, {Component} from "react";
import {Layout} from "antd";
import {connect} from 'react-redux'
import HeaderComp from "./Header/HeaderComp";
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./Auth/Login";
import Profile from "./Profile/Profile";
import UploadAnswerImage from "./Upload/Upload";
import Quizes from "./Quizes/Quizes";
import Quiz from "./Quizes/Quiz";
import Answer from "./Answer/Answer";
import AnswerStats from "./Answer/AnswerStats";
import Page404 from "./Page404/Page404";
const { Content} = Layout;
/**
 *
 * @param Component
 * @param isLoggedIn
 * @returns {*}
 * @constructor
 * private routes only for logged users
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
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

    isLoggedIn() {
        return !!this.props.state.auth.user
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
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/profile/:id?" component={Profile}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/upload" component={UploadAnswerImage}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/quizes" component={Quizes}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/quizes/:id" component={Quiz}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/answers/:id" component={Answer}/>
                                            <PrivateRoute isLoggedIn={true} exact path="/stats/:id" component={AnswerStats}/>
                                            <Route exact path="/" > {!this.props.state.auth.token ?<Login/>:<Redirect to="/profile" />}</Route>
                                            <Route exact path="/login" > {this.props.state.auth.token ?<Redirect to="/profile" />:<Login/>}</Route>
                                            <Route exact path="**" > <Page404 /></Route>
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
