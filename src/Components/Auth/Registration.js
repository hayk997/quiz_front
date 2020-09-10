import React,{Component} from "react";
import {Col,Row,Button,Input,Form,Tooltip} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'
import {formItemLayout} from "../../dist/layoutes";
import FacebookLogin from 'react-facebook-login';
import axios from "axios";
import api from "../../api";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    handleRegFacebook = (response) => {
        if(response.accessToken) {
            console.log(response)
            axios.request( {
                url:api.auth.facebook.url,
                headers:{

                },
                method: api.auth.facebook.method,
                data: {
                    access_token:response.accessToken
                }
            }).then(response=>{
                this.props.onLogin(response.data)
            }).catch(err=>{
                console.log(err)
            })
        }
    }

    handleRegistration = (formData)=>{
        axios.request( {
            url:api.auth.registration.url,
            headers:{

            },
            method: api.auth.registration.method,
            data: formData
        }).then(response=> {
            this.props.onLogin(response.data)
        })
        }
    render() {
        return (
                <Row className={'content-aligned'}>
                    <Col style={{textAlign:'center'}} lg={{offset:6,span:12}}>
                        <Form
                            {...formItemLayout}
                            onFinish={this.handleRegistration}
                        >
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="username"
                                label={
                                    <span>
                                Nickname&nbsp;
                                        <Tooltip title="What do you want others to call you?">
                            <QuestionCircleOutlined />
                                </Tooltip>
                              </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your nickname!',
                                        whitespace: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject('The two passwords that you entered do not match!');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item >
                                <FacebookLogin
                                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                    fields="name,email,picture"
                                    cssClass="hidden"
                                    callback={this.handleRegFacebook}/>
                                <Button style={{margin:'0px 15px'}} onClick={() => document.getElementsByClassName('hidden')[0].click()} type="primary" >
                                    Register with Facebook
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </Form.Item>
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
)(Registration);
