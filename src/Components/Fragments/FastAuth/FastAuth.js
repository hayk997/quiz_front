import React,{Component} from "react";
import {Col, Row, Button, Input, Form, Spin, Typography,DatePicker,Select } from "antd";
import { FacebookOutlined} from "@ant-design/icons";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../../api"
import logo from '../../../dist/images/mainLogo.png'
import FacebookLogin from "react-facebook-login";
import ManOutlined from "@ant-design/icons/lib/icons/ManOutlined";
import WomanOutlined from "@ant-design/icons/lib/icons/WomanOutlined";
import './FastAuth.sass'
const { Option } = Select;

class FastAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            userData:{},
            availability:false
        }
    }
    handleRegFacebook = (response) => {
        if(response.accessToken) {
            axios.request( {
                url:api.auth.facebook.login.url,
                method: api.auth.facebook.login.method,
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
    handleRegUser = formData=>{
        this.setState({
            loading: true
        })
        if(this.state.userData.accessToken) {
            axios.request( {
                url:api.auth.facebook.reg.url,
                method: api.auth.facebook.reg.method,
                data: {
                    access_token:this.state.userData.accessToken,
                    userName:formData.username,
                    refId:this.props.refId,
                    birthDate:formData.birthDate,
                    genderId:formData.genderId
                }
            }).then(response=>{
                if(response.data.userData){
                    this.setState({
                        loading:false,
                        userData:response.data.userData
                    })
                }else{
                    this.props.onLogin(response.data)
                }

            }).catch(err=>{
                console.log(err)
            })
        }
    }
    render() {
        return (
            <Row className={'content-aligned login'}>
                <Col className='loginBlock' style={{textAlign:'center'}} lg={{offset:8,span:8}}>
                    {this.state.loading ? <Spin size={"large"} tip="Загрузка..."/> :
                        <div className='loginDiv'>
                            <div style={{marginBottom:'10%'}}>
                                <img style={{height:'60px'}} alt='logo' src={logo} className='logoLogin'/>
                            </div>
                            <Typography.Title level={4}>{this.props.title}</Typography.Title>
                            <FacebookLogin
                                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                fields="name,email,picture"
                                cssClass="hidden"
                                callback={this.handleRegFacebook}/>
                            {this.state.userData.id?<Form onFinish={this.handleRegUser}>
                                <Form.Item wrapperCol={{span:13,offset:1}} labelCol={{span: 9}} name={'username'} label={'Имя пользователя'} rules={[
                                    {
                                        validator:(rule, value, callback)=>{
                                            if(!value){
                                                callback('Обязателен к заполнению')
                                            }
                                            if(!this.state.availability){
                                                callback('Используется')
                                            }
                                            if(value.length<4){
                                                callback('Минимальная длина 4')
                                            }
                                            if(!value.match(/^\S*$/)){
                                                callback('Пробелы не разрешены')
                                            }
                                            callback()

                                        }
                                    }
                                ]}>
                                    <Input onChange={this.handleCheckAvailability}/>
                                </Form.Item>

                                <Form.Item style={{width:'100%'}} wrapperCol={{span:13,offset:1}} labelCol={{span: 9}} required label={'Дата рождения'} name='birthDate'>
                                    <DatePicker/>
                                </Form.Item>
                                <Form.Item wrapperCol={{span:13,offset:1}} labelCol={{span: 9}} required name='genderId' label={'Выберите пол'}>
                                    <Select
                                        style={{ width: 200 }}
                                        placeholder="Выберите пол"
                                    >
                                        <Option value="1"><ManOutlined />Мужской</Option>
                                        <Option value="2"><WomanOutlined />Женский</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType={'Submit'}>Зарегестрироватся</Button>
                                </Form.Item>
                            </Form>:   <Button className={'login-button'} icon={<FacebookOutlined/>} style={{margin:'0px 15px'}} onClick={() => document.getElementsByClassName('hidden')[0].click()} type="primary" >
                                Войти с помощю фейсбук
                            </Button>}
                        </div>
                    }
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
)(FastAuth);
