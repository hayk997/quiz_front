import React, {Component} from "react"
import {Col, Layout, Menu, Row, Drawer} from "antd"
import {connect} from 'react-redux'
import {NavLink, withRouter} from "react-router-dom"
import {LaptopOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons"
import MenuOutlined from "@ant-design/icons/lib/icons/MenuOutlined";

const {Header} = Layout
const { SubMenu } = Menu
const { Sider } = Layout


class HeaderComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false
        }
    }

    navigate = (e) => {
        this.props.history.push(e.key)
    }
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    render() {
        return (
            <Header className="header">
                <Row>
                    <Col xs={4} sm={4} md={4} lg={6} xl={4}>
                        <div className="logo"/>
                    </Col>
                    <Col xs={18} sm={18} md={16} lg={12} xl={14}>
                        <Menu theme="dark" mode="horizontal">
                            {this.props.state.auth.token ?
                                <Menu.Item onClick={this.props.onLogout} key="/logout">LOGOUT</Menu.Item> :
                                <Menu.Item onClick={this.navigate} key="/">Login</Menu.Item>}
                            {this.props.state.auth.token ?
                                <Menu.Item onClick={this.navigate} key="/profile">My profile</Menu.Item> :
                                <Menu.Item onClick={this.navigate} key="/reg">Registration</Menu.Item>}
                            <Menu.Item onClick={this.navigate} key="/single">Test layout</Menu.Item>
                            <Menu.Item >My apps</Menu.Item>
                            <Menu.Item ><NavLink to="/psytest">Psychology test</NavLink></Menu.Item>
                        </Menu>
                    </Col>
                    <Col xs={2} sm={2} md={4} lg={6} xl={6}>
                        <MenuOutlined style={{fontSize:'25px'}} onClick={this.showDrawer}/>
                        {/*<Button type='primary' onClick={this.showDrawer}>*/}
                        {/*    Show*/}
                        {/*</Button>*/}
                        <Drawer
                            title="Basic Drawer"
                            placement='left'
                            closable={true}
                            onClose={this.onClose}
                            visible={this.state.visible}
                        >
                            <Sider theme='dark' width={200} className="site-layout-background">
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    style={{ height: '100%', borderRight: 0 }}
                                >
                                    <Menu.Item key="1">My apps</Menu.Item>
                                    <SubMenu key="sub1" icon={<UserOutlined />} title="My apps">

                                        <Menu.Item key="2"><NavLink to='/psytest'> Psychology Test </NavLink></Menu.Item>
                                        <Menu.Item key="3"><NavLink to='/upload'> Upload </NavLink></Menu.Item>
                                        <Menu.Item key="4">option4</Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                                        <Menu.Item key="5">option5</Menu.Item>
                                        <Menu.Item key="6">option6</Menu.Item>
                                        <Menu.Item key="7">option7</Menu.Item>
                                        <Menu.Item key="8">option8</Menu.Item>
                                    </SubMenu>
                                </Menu>
                            </Sider>
                        </Drawer>
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({
        onLogout: () => {
            dispatch({
                type: "LOGOUT",
            })
        },
    })
)(withRouter(HeaderComp));
