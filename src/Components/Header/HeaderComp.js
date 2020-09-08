import  React,{Component} from "react";
import { Layout, Menu} from "antd";
import {connect} from 'react-redux'
const { Header,  } = Layout;

class HeaderComp extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu>
            </Header>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(HeaderComp);
