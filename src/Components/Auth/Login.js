import React,{Component} from "react";
import {Col, Row, Button, Input, Form, notification} from "antd";
import {UserOutlined, LockOutlined, MailOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../api";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    handleLogin = (formData)=>{
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
            }


        }).catch(err=>{
            console.log(err.message)


        })
    }
    render() {
        return (
                <Row className={'content-aligned'}>
                    <Col style={{textAlign:'center'}} lg={{offset:8,span:8}}>
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
                        </Form>
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
