import React,{Component} from "react";
import {Col,Row,Button,Input,Form} from "antd";
import {UserOutlined, LockOutlined, MailOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'
import AppLayout from "../AppLayout";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
                <Row className={'content-aligned'}>
                    <Col style={{textAlign:'center'}} lg={{offset:8,span:8}}>
                        <Form className="login-form">
                            <Form.Item name={'Email'} rules={[{
                                required: true,
                                message: 'Please enter email address'
                            }]}>

                                <Input prefix={<MailOutlined style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       disabled={this.state.loading}
                                       placeholder="Email"/>
                            </Form.Item>
                            <Form.Item name={'Password'} rules={[{
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

    })
)(Login);
