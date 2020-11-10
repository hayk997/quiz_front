import React,{Component} from "react";
import {Col, Row, Button, Input, Form, notification, Divider} from "antd";
import {UserOutlined, LockOutlined, MailOutlined,FacebookOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../api"
import './styles.sass'
import logo from '../../dist/images/mainLogo.png'
import {Link, Redirect} from "react-router-dom";
import FacebookLogin from "react-facebook-login";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            userData:{}
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
                if(response.data.userData){
                    this.setState({
                        userData:response.data.userData
                    })
                }else{
                    this.props.onLogin(response.data)
                    return <Redirect to='/profile'/>
                }

            }).catch(err=>{
                console.log(err)
            })
        }
    }
    handleCheckAvailability = (e)=>{

      axios.request({
          url:api.user.check.url,
          method:api.user.check.method,
          data: {username:e.target.value},
      }).then(resp=>{
          this.setState({
              availability:resp.data.availability
          })
      })
    }
    render() {
        return (
                <Row className={'content-aligned login'}>
                    <Col className='loginBlock' style={{textAlign:'center'}} lg={{offset:8,span:8}}>
                        <div className='loginDiv'>
                            <div style={{marginBottom:'10%'}}>
                                <img style={{height:'60px'}} alt='logo' src={logo} className='logoLogin'/>
                            </div>
                                <FacebookLogin
                                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                    fields="name,email,picture"
                                    cssClass="hidden"
                                    callback={this.handleRegFacebook}/>
                            {this.state.userData.id?<Form>
                                <Form.Item name={'username'} label={'Choose Username'} validateStatus={this.state.availability?'success':'error'} rules={[
                                    {
                                        required:true,
                                    },
                                    {
                                        message:'min length 4',
                                        min:4,
                                    }
                                ]}>
                                    <Input onChange={this.handleCheckAvailability}/>
                                </Form.Item>
                                <Button htmlType={'submit'}>Register</Button>

                            </Form>:   <Button className={'login-button'} icon={<FacebookOutlined/>} style={{margin:'0px 15px'}} onClick={() => document.getElementsByClassName('hidden')[0].click()} type="primary" >
                                    Login with Facebook
                                </Button>}
                                <Divider orientation='center'/>
                                <div className='regBlock'><h3>Нет аккаунта? Зарегистрируйтесь</h3>
                                    <Button className='regButton' style={{backgroundColor:'#42b72a'}} icon={<UserOutlined />}>
                                        <Link to='/reg'>Регистация</Link>
                                    </Button>
                                </div>
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
