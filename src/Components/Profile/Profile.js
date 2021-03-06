import React, {Component} from "react";
import  {Tabs,Badge, Col, Row, Avatar, Typography} from "antd";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../api";
import {Upload, message} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import QuizCard from "../Fragments/QuizCard";
import Preloader from "../Preloader";
import AvatarImg from "../../dist/images/avatar-placeholder.png"
import './Profile.sass'
import Comments from "../Fragments/Comments/Comments";
import Statistics from "./Statistics";


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
            loading: true,
            answers: [],
            showUpload: false,
            user: {},
            value: {},
            status: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.componentDidMount()
        }

    }

    componentDidMount() {
        if(this.props.state.auth.user ||this.props.match.params.id  ){
            axios.request({
                url: api.user.list.url + (this.props.match.params.id ? this.props.match.params.id : this.props.state.auth.user.id) + (this.props.state.views['user']?.includes(this.props.match.params.id) ? '?c=1' : ''),//for pagination add ?page=2,//for pagination add ?page=2
                method: api.user.list.method,
                headers: {
                    'x-access-token': this.props.state.auth.token,
                    'cache-control': 'no-cache'
                }
            }).then(response => {
               if(!response.data.error){
                   if (this.props.match.params.id) {
                       this.props.view({
                           page: 'user',
                           id: this.props.match.params.id
                       })
                   }
                   this.setState({
                       user: response.data,
                       loading: false
                   })
               }

            }).catch(e=>{
                this.props.onLogout()
                this.props.history.push('/')
            })
        }else{
            this.props.onLogout()
            this.props.history.push('/')
        }

    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.props.onUpdate(info.file.response.user)

            this.componentDidMount();
        }
    };

    render() {
        console.log(this.state.user)
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div style={{marginTop: 8}}>Upload</div>
            </div>
        );
        return (
            this.state.loading ? <Preloader/> : <Row className={'content-aligned'}>
                <Col className={'centered'} lg={24} md={24} sm={24} xs={24}>
                    {this.state.user.imageURL && !this.state.showUpload ?
                        <>
                            <Avatar onClick={() => this.setState({showUpload: true})}
                                    style={{borderRadius: '100%', cursor: 'pointer'}} size={100}
                                    src={this.state.user.imageURL?process.env.REACT_APP_API_ENDPOINT + this.state.user.imageURL:AvatarImg}/>
                        </> : this.state.user && this.props.state.auth.user?.id === this.state.user.id ?
                            <Upload
                                headers={{
                                    "x-access-token": this.props.state.auth.token
                                }}
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={process.env.REACT_APP_API_ENDPOINT + "updateimage"}
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {this.state.user.imageURL ?
                                    <img src={process.env.REACT_APP_API_ENDPOINT + this.state.user.imageURL}
                                         alt="avatar" style={{width: '100%'}}/> : uploadButton}
                            </Upload> : <Avatar style={{borderRadius: '100%'}} size={100} src={AvatarImg}/>
                    }
                    <Typography.Title level={2}>{this.state.user.username}</Typography.Title>
                </Col>
                <Col
                    className={'centered'}
                    lg={{span:8,offset:8}} md={{span:6,offset:9}}
                    sm={{span:12,offset:6}} xs={24}>
                    <Statistics
                        likes={this.state.user.likes}
                        disLikes={this.state.user.disLikes}
                        views={this.state.user.views}
                        gotPosts={this.state.user.gotPosts }
                        sentPosts={this.state.user.sentPosts}
                        newData={this.state.user.newData}
                    />
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                <Tabs defaultActiveKey="1" centered>
                    <Tabs.TabPane tab="Вопросы/Ответы" key="1">
                            <Comments data={this.state.user.posts} uId={this.state.user.id}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Личные тесты" key="2">
                        <Typography.Title level={4}>My apps</Typography.Title>
                        {this.state.user.answers.length ?
                            this.state.user.answers.map((answer,key) => <Badge key={key} count={answer.newPassed}><QuizCard
                                views={answer.views} link={`/stats/`} passed={answer.Passed} aId={answer.id}
                                question={answer.question}/></Badge>) : null
                        }
                    </Tabs.TabPane>
                </Tabs>
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
        onUpdate: (data) => {
            dispatch({
                type: "UPDATE",
                payload: data
            })
        },
        view: (payload) => {
            dispatch({
                type: "VIEW_PAGE",
                payload
            })
        },
        onLogout: () => {
            dispatch({
                type: "LOGOUT",
            })
        },
    })
)(Profile);
