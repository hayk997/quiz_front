import  React,{Component} from "react"
import { Layout, Menu} from "antd"
import { UserOutlined, LaptopOutlined, NotificationOutlined  } from "@ant-design/icons"
import {connect} from 'react-redux'
import {NavLink} from "react-router-dom"
import PsyTest from "../PsyTest/Psy";

const { SubMenu } = Menu
const { Sider } = Layout

class SiderComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    render() {
        return (
            <Sider width={200} className="site-layout-background">
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
                    <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                        <Menu.Item key="9">option9</Menu.Item>
                        <Menu.Item key="10">option10</Menu.Item>
                        <Menu.Item key="11">option11</Menu.Item>
                        <Menu.Item key="12">option12</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(SiderComp);
