import React, {Component} from "react";
import {Layout, notification} from "antd";
import {connect} from 'react-redux'
import HeaderComp from "./Header/HeaderComp";
import {Redirect, Route, Switch,withRouter} from "react-router-dom";
import Login from "./Auth/Login";
import Profile from "./Profile/Profile";
import UploadAnswerImage from "./Upload/Upload";
import Quizes from "./Quizes/Quizes";
import Quiz from "./Quizes/Quiz";
import Answer from "./Answer/Answer";
import AnswerStats from "./Answer/AnswerStats";
import Page404 from "./Page404/Page404";
import FastAuth from "./Fragments/FastAuth/FastAuth";
import Horoscope from "./Horoscope/Horoscope";
import { io } from 'socket.io-client';

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
var Socket;
class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        if(this.props.state.auth.token){
            Socket = io('http://localhost:4001/',{
                auth:{
                    token:this.props.state.auth.token
                }
            })
            Socket.on("connect",()=>{
                console.log(Socket)

            })
            Socket.on('connectedUserCount',(count)=>{
                console.log(count)
            })
            Socket.on('adminMessage',(message)=>{
                console.log(message)
                notification.info({
                    message:'Admin@ asma',
                    description:message
                })
            })

            Socket.on("connect_error", (err) => {
                console.log(err.message); // prints the message associated with the error
            });
        }else{
            console.log('not logged')
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.location.pathname!==this.props.location.pathname){
            if(this.props.state.auth.token){
              let path = this.props.location.pathname;
                path =  path.split('/')
                Socket.emit('userMove',{
                    path:path[1],
                    key:path[2]
                })
            }
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
                                            <PrivateRoute isLoggedIn={true} exact path="/profile/:id?" component={Profile}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/upload" component={UploadAnswerImage}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/quizes" component={Quizes}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/quizes/:id" component={Quiz}/>
                                            <PrivateRoute isLoggedIn={this.isLoggedIn()} exact path="/answers/:id" component={Answer}/>
                                            <PrivateRoute isLoggedIn={true} exact path="/stats/:id" component={AnswerStats}/>
                                            <PrivateRoute isLoggedIn={true} exact path="/horoscope" component={Horoscope}/>
                                            <Route exact path="/" > {!this.props.state.auth.token ?<FastAuth title={'Быстрая регистрация или вход'}/>:<Redirect to="/profile" />}</Route>
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
AppLayout = connect(
    state => ({
        state
    }),
    () => ({

    })
)(withRouter(AppLayout))
export {AppLayout,Socket};
