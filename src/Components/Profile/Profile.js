import React,{Component} from "react";
import {Col, Row, Card, Avatar, Typography,Form, Button,Input} from "antd";
import {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../api";
import {NavLink} from "react-router-dom";
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import QuizCard from "../Fragments/QuizCard";
import Preloader from "../Preloader";
import AvatarImg from "../../dist/images/avatar-placeholder.png"

const {TextArea }=Input

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            answers:[],
            showUpload:false,
            user:{},
            value:{},
            status:''
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if( this.props.match.params.id!==prevProps.match.params.id){
            this.componentDidMount()
        }
    }

    componentDidMount() {
        axios.request({
            url:api.user.list.url+(this.props.match.params.id?this.props.match.params.id:this.props.state.auth.user.id),//for pagination add ?page=2
            method:api.user.list.method,
            headers:{
                'x-access-token':this.props.state.auth.token,
                'cache-control':'no-cache'
            }
        }).then(response=>{
           this.setState({
               user:response.data,
               loading:false
           })
        })
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.props.onUpdate(info.file.response.user)
            // Get this url from response in real world.
            this.setState({
                loading:false,
                showUpload:false,
            })
        }
    };
    onFinish= values => {
        console.log('Success:', values);
    };
    onChange = ({ target: { value } }) => {
        this.setState({ value });
    };
    render() {
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
           this.state.loading?<Preloader/>: <Row className={'content-aligned'}>
            <Col className={'centered'} lg={24}>
                {this.props.state.auth.user.imageURL && !this.state.showUpload ?
                    <>
                    <Avatar style={{borderRadius:'100%'}} size={100} src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}/>
                    <Button onClick={()=>this.setState({showUpload:true})}>Change Photo</Button>
                    </>:this.state.user && this.props.state.auth.user.id===this.state.user.id ?
                    <Upload
                        headers={{
                            "x-access-token": this.props.state.auth.token
                        }}
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={process.env.REACT_APP_API_ENDPOINT+"updateimage"}
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {this.state.user.imageURL ?
                            <img src={process.env.REACT_APP_API_ENDPOINT+this.state.user.imageURL}
                                 alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>:<Avatar style={{borderRadius:'100%'}} size={100} src={AvatarImg}/>
                }
                <Typography.Title level={2}>{this.state.user.username}</Typography.Title>
            </Col>
               <Col className='centered' lg={{span:12,offset:6}}>
                   <div className='statusBlock'>
                       <Form
                           layout='horizontal'
                           name='postForm'
                           onFinish={this.onFinish}
                           initialValues={{ remember: true }}>
                           <Form.Item>
                               <TextArea
                                   onChange={this.onChange}
                                   value={this.state.status}
                                   name='postText'
                                   autoSize={{ minRows: 2, maxRows: 4 }}
                                   placeholder="О чем вы думаете?"
                               />
                           </Form.Item>
                           <Form.Item>
                               <Button type="primary" htmlType="submit">
                                   Create post
                               </Button>
                           </Form.Item>
                       </Form>
                   </div>
               </Col>
                <Col lg={24}>
                    <Typography.Title level={4}>My apps</Typography.Title>
                </Col>
                {this.state.user.answers.length?
                    this.state.user.answers.map((answer,key)=> <QuizCard link={'/stats/'}  question={answer.question} />):null
                }
            </Row>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({
        onUpdate: (data) => {
            dispatch({
                type: "UPDATE",
                payload: data
            })
        },
    })
)(Profile);
