import  React,{Component} from "react";
import { Layout, Menu} from "antd";
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom";
const { Header,  } = Layout;

class HeaderComp extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    navigate=(e)=>{
        this.props.history.push(e.key)
    }
    render() {
        return (
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item onClick={this.navigate} key="/reg">Registration</Menu.Item>
                    <Menu.Item onClick={this.navigate} key="/">Login</Menu.Item>
                    <Menu.Item onClick={this.navigate} key="/single">nav 3</Menu.Item>
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
)(withRouter(HeaderComp));
