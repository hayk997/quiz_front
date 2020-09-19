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

class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
