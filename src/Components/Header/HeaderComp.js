import React, {Component} from "react"
import  {Col, Empty, Spin, Select, Layout, Menu, Row, Drawer, Input, Avatar} from "antd"
import {connect} from 'react-redux'
import {Link, NavLink, withRouter} from "react-router-dom"
import {UserOutlined} from "@ant-design/icons"
import MenuOutlined from "@ant-design/icons/lib/icons/MenuOutlined"
import logo from '../../dist/images/mainLogo.png'
import './styles.sass'
import axios from "axios";
import api from "../../api";
import AvatarImg from "../../dist/images/avatar-placeholder.png";

const {Header} = Layout
const { SubMenu } = Menu
const { Sider } = Layout

class HeaderComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            searchInterval:false,
            users:[],
            searchName:null

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
    handleUserSearch =e=>{
        if(this.state.searchInterval){
            clearInterval(this.state.searchInterval)
        }
        this.setState({
            searchName:e,

        },()=>this.setState({
            searchInterval:setTimeout(()=>{
                axios.request({
                    url:api.user.find.url+this.state.searchName,//for pagination add ?page=2
                    method:api.user.find.method,
                    headers:{
                        'x-access-token':this.props.state.auth.token,
                        'cache-control':'no-cache'
                    }
                }).then(response=> {
                    this.setState({
                        users: response.data.data
                    })
                })

            },800)
        }))



    }
    render() {
        return (
            <Header className="header">
                <Row>
                    <Col xs={4} sm={4} md={4} lg={6} xl={4}>
                        <Link to='/'>
                            <img alt='logo' src={logo} className='mainLogo'/>
                        </Link>
                    </Col>
                    <Col xs={18} sm={18} md={16} lg={12} xl={14}>
                        <Menu theme="dark" mode="horizontal">
                            {this.props.state.auth.token && <Select
                                style={{ width: 200 }}
                                showSearch={true}
                                notFoundContent={this.state.fetching ?
                                    <Spin size="small"/> : null}
                                onSearch={this.handleUserSearch}
                                filterOption={true}
                                allowClear={true}
                                optionFilterProp={"name"}
                                onChange={e=>this.props.history.push('/profile/'+e)}
                            >
                                {this.state.users.length?this.state.users.map(user =>
                                    <Select.Option  key={user.id}
                                                   name={user.username}
                                                   value={user.id}><Avatar style={{borderRadius:'100%',margin:'0 10px'}} size={25} src={user.imageURL?user.imageURL:AvatarImg}/>{user.username}</Select.Option>
                                ):<Empty/>}
                            </Select>}
                            {this.props.state.auth.token ?
                                <Menu.Item onClick={this.props.onLogout} key="/logout">LOGOUT</Menu.Item> :
                                <Menu.Item onClick={this.navigate} key="/">Login</Menu.Item>}
                            {this.props.state.auth.token ?
                                <Menu.Item onClick={this.navigate} key="/profile">My profile</Menu.Item> :
                                <Menu.Item onClick={this.navigate} key="/reg">Registration</Menu.Item>}
                            {this.props.state.auth.token && <Menu.Item ><NavLink to="/quizes">Quizes</NavLink></Menu.Item>}
                        </Menu>
                    </Col>
                    {this.props.state.auth.token &&<Col xs={2} sm={2} md={4} lg={6} xl={6}>
                        <MenuOutlined style={{fontSize:'25px',color:'#b9b9b9'}} onClick={this.showDrawer}/>
                        <Drawer
                            title="Basic Drawer"
                            placement='left'
                            closable={true}
                            onClose={this.onClose}
                            visible={this.state.visible}
                        >
                            <Sider width={250} className="site-layout-background">
                                <Menu
                                    theme='dark'
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    style={{ height: '100%', borderRight: 0 }}
                                >
                                    <Menu.Item key="1">My apps</Menu.Item>
                                    <SubMenu key="sub1" icon={<UserOutlined />} title="My apps">

                                        <Menu.Item key="2"><NavLink to='/psytest'> Psychology Test </NavLink></Menu.Item>
                                        {this.props.state.auth.user.isAdmin&&<Menu.Item key="3"><NavLink to='/upload'> Upload </NavLink></Menu.Item>}
                                        <Menu.Item key="4">option4</Menu.Item>
                                    </SubMenu>

                                </Menu>
                            </Sider>
                        </Drawer>
                    </Col>
                    }
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
