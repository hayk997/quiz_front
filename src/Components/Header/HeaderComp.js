import React, {Component} from "react"
import  {Col, Empty, Spin, Select, Layout, Menu, Row, Avatar} from "antd"
import {connect} from 'react-redux'
import {Link, NavLink, withRouter} from "react-router-dom"
import logo from '../../dist/images/mainLogo.png'
import './styles.sass'
import axios from "axios";
import api from "../../api";
import AvatarImg from "../../dist/images/avatar-placeholder.png";

const {Header} = Layout



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
                                className="headerSearch"
                                style={{ width: 200 }}
                                showSearch={true}
                                notFoundContent={this.state.fetching ?
                                    <Spin size="small"/> : null}
                                onSearch={this.handleUserSearch}
                                filterOption={true}
                                optionFilterProp={"name"}
                                value={null}
                                onChange={e=>{
                                    this.setState({
                                        users:[]
                                    })
                                    this.props.history.push('/profile/'+e)
                                }}
                            >
                                {this.state.users.length?this.state.users.map(user =>
                                    <Select.Option  key={user.id}
                                                   name={user.username}
                                                    value={user.id}><Avatar style={{borderRadius:'100%',margin:'0 10px'}} size={25} src={user.imageURL?process.env.REACT_APP_API_ENDPOINT+user.imageURL:AvatarImg}/><span className='searchNameSpan'>{user.username}</span></Select.Option>
                                ):<Empty/>}
                            </Select>}
                            {this.props.state.auth.token &&<Menu.Item style={{marginLeft:'2%'}} onClick={this.navigate} key="/profile">My profile</Menu.Item> }
                            {this.props.state.auth.token &&<Menu.Item ><NavLink to="/quizes">Quizes</NavLink></Menu.Item>}
                            {this.props.state.auth.token ?
                                <Menu.Item onClick={this.props.onLogout} key="/logout">LOGOUT</Menu.Item> :
                                <Menu.Item onClick={this.navigate} key="/">Login</Menu.Item>}
                        </Menu>
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
