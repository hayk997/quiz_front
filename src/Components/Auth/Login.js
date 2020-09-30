import React,{Component} from "react";
import {Col, Row, Button, Input, Form, notification, Divider} from "antd";
import {UserOutlined, LockOutlined, MailOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../api"
import './styles.sass'
import logo from '../../dist/images/mainLogo.png'
import {Link} from "react-router-dom";
import LoginOutlined from "@ant-design/icons/lib/icons/LoginOutlined";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        }
    }
    handleLogin = (formData)=>{
        this.setState({
            loading:true
        })
        axios.request( {
            url:api.auth.login.url,
            headers:{
            },
            method: api.auth.login.method,
            data: formData
        }).then(response=> {
            if(response.data.message){
                notification.warning({
                    message: 'Warning',
                    description: response.data.message,
                });
            }else{
                this.props.onLogin(response.data)
                this.props.history.push('/profile')
            }
        }).catch(err=>{
            console.log(err.message)
        }).finally(()=>{
            this.setState({
                loading:false
            })
        })
    }
    componentWillUnmount() {

    }

    render() {
        return (
                <Row className={'content-aligned login'}>
                    <Col className='loginBlock' style={{textAlign:'center'}} lg={{offset:8,span:8}}>
                        <div className='loginDiv'>
                            <div style={{marginBottom:'10%'}}>
                                <img style={{height:'60px'}} alt='logo' src={logo} className='logoLogin'/>
                            </div>
                        <Form onFinish={this.handleLogin} className="login-form">
                            <Form.Item name={'email'} rules={[{
                                required: true,
                                message: 'Please enter email address'
                            }]}>

                                <Input prefix={<MailOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       disabled={this.state.loading}
                                       placeholder="email"/>
                            </Form.Item>
                            <Form.Item name={'password'} rules={[{
                                required: true,
                                message: 'Please enter your password'
                            }]}>
                                <Input prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       type="password"
                                       disabled={this.state.loading}
                                       placeholder={"Password"}/>
                            </Form.Item>
                            <Button type="primary" icon={<UserOutlined/>} htmlType="submit" className="block"
                                    loading={this.state.loading}>Login</Button>
                            <Divider orientation='center'/>
                            <div className='regBlock'><h3>Нет аккаунта? Зарегистрируйтесь</h3>
                                <Button className='regButton' style={{backgroundColor:'#42b72a'}} icon={<UserOutlined />}>
                                <Link to='/reg'>Регистация</Link>
                                </Button>
                            </div>
                        </Form>
                        </div>
                    </Col>
                </Row>



        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({
        onLogin: (loginData) => {
            dispatch({
                type: "AUTH",
                payload: loginData
            })
        },
    })
)(Login);
