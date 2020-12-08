import React from "react";
import {
    DislikeOutlined,
    LikeOutlined,
    DislikeFilled,
    LikeFilled,
    CloseCircleOutlined,
    UserOutlined, LockOutlined,
    CheckOutlined,CloseOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {Row, Col,Comment, Switch, Tooltip, Avatar, Form, Button, List, Input, Card} from 'antd';
import moment from 'moment';
import axios from "axios";
import api from "../../../api";
import {connect} from "react-redux";
import Preloader from "../../Preloader";
import {Link} from "react-router-dom";
import './Comments.sass'
const {TextArea} = Input;

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            action: null,
            data: [],
            submitting: false,
            value: '',
            loading:false,
            opened:false
        }
        this.form=React.createRef()
    }
    componentDidMount() {
        this.setState({
            data:this.props.data
        })
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.data!==nextProps.data){
            this.setState({
                data:nextProps.data
            })
        }
    }

    handleFinish=(data)=>{
       this.setState({
            loading:true
        })
        console.log(data)
        axios.request( {
            url:`${api.user.post.url}${this.props.uId}/post`,
            method: api.auth.facebook.login.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            },
            data:data
        }).then(response=>{
            this.form.current.resetFields()
            this.setState({
                loading:false,
                data:response.data
            })
        }).catch(err=>{
            console.log(err)
        })
    }
    handleRemove = (id)=>{
        axios.request({
            url:api.Post.delete.url+id,
            method:api.Post.delete.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            },
        }).then(response=>{
           let {data} = this.state;
           data=this.handleRemoveComments(data,id)
           this.setState({
               data:data
           })
        })
    }
    handleRemoveComments=(comments,id)=>{
        return comments.map(comment=>{
            if(comment.id===id){
                return false
            }else{
                if(comment.Comments &&comment.Comments.length){
                    comment.Comments =this.handleRemoveComments(comment.Comments,id)
                }
                return comment
            }
        })
    }

    handleUpdateComment=(Comments,response,type)=>{
       return Comments.map(comment=>{
            if(comment.id===response.data.id){
                let key = type?'likes':'dislikes';
                comment[key] = JSON.parse(comment[key])
                if(comment[key].includes(this.props.state.auth.user.id)){
                    comment[key] = comment[key].filter(id=>id!==this.props.state.auth.user.id)
                }else{
                    comment[key].push(this.props.state.auth.user.id)
                }
                comment[key] = JSON.stringify(comment[key])
                return comment
            }else{
                if(comment.Comments &&comment.Comments.length){
                    comment.Comments =this.handleUpdateComment(comment.Comments,response,type)
                }
                return comment
            }
        })
    }
    handleReact=(id,type)=>{
        axios.request({
            url:api.Post.react.url+id+'/'+type,
            method:api.Post.react.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            },
        }).then(response=>{
            let {data} = this.state;
            data =this.handleUpdateComment(data,response,type)
            console.log(data,response.data)
            this.setState({
                data
            })
        })
    }
    replyTo=(id)=>{
        this.setState({opened:id})
    }
    handleReply=(id,data)=>{
        axios.request({
            url: `${api.Post.react.url}${id}`,
            method: api.Post.react.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            },
            data:data
        }).then(response => {
            let data = this.state.data.splice(0)
            let comment= data.map(i=>{
                if(i.id ===id){
                    i.Comments=response.data.Comments
                }
                return i
            })
            this.setState({
                data:comment,
                opened:false
            })
        }).catch(e=>{
            console.log(e)
        })
    }
    handleShowHide = (comment,value)=>{
        axios.request({
            url: `${api.Post.visibility.url}${comment.id}`,
            method: api.Post.visibility.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            },
            data: {show:value}
        }).then(comment => {
            console.log(comment)
        })
    }
    handleGetUsers = (users)=>{
        if(users.length){
            axios.request({
                url: api.Post.reacted.url,
                method: api.Post.reacted.method,
                headers: {
                    'x-access-token': this.props.state.auth.token,
                    'cache-control': 'no-cache'
                },
                data: {users}
            }).then(users=>{
                console.log(users)
            })
        }
    }
    render() {
        let commentData =(comments,child_deep)=> comments.map((comment, key) =>{
            if(comment){
                comment.fromUser=comment.fromUser?comment.fromUser:{
                    username:'Anonymous',
                    imageURL:"images/dist/anonym.png"
                }
            }
            return comment&&<div key={key}>
                <Comment
                    style={{margin: '20px'}}
                    actions={[
                        this.state.replyId!==comment.id && child_deep<1&&<span onClick={()=>this.replyTo(comment.id)} key="text">Reply to</span>,
                        <Tooltip key="comment-basic-like" title="Like">
                      <span className={'comment-reactions'}>
                          <span onClick={()=>this.handleReact(comment.id,1)}> {JSON.parse(comment.likes).includes(this.props.state.auth.user.id) ? <LikeFilled/> : <LikeOutlined/>}</span>
                          <span onClick={()=>this.handleGetUsers(JSON.parse(comment.likes))} className="comment-action">{JSON.parse(comment.likes).length}</span>
                      </span>
                        </Tooltip>,
                        <Tooltip key="comment-basic-dislike" title="Dislike">
                      <span className={'comment-reactions dislike'} >
                          <span onClick={()=>this.handleReact(comment.id,0)}>{JSON.parse(comment.dislikes).includes(this.props.state.auth.user.id) ? <DislikeFilled/> : <DislikeOutlined/>}</span>
                          <span className="comment-action">{JSON.parse(comment.dislikes).length}</span>
                      </span>
                        </Tooltip>,
                    ]}
                    author={comment.anonymous?<><p>{comment.fromUser.username} <LockOutlined /></p></>:<Link to={`/profile/${comment.fromUser.id}`}>{comment.fromUser.username}</Link>}
                    avatar={<><Avatar src={process.env.REACT_APP_API_ENDPOINT+comment.fromUser.imageURL}/></>}
                    content={<>
                        {this.props.state.auth.user.id ===this.props.uId &&
                        <div className={'comment-controls'}>{child_deep===0? <Switch
                            onChange={(e)=>this.handleShowHide(comment,e)}
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked={comment.show}
                        />:null}<Button onClick={()=>this.handleRemove(comment.id)} icon={<DeleteOutlined />} danger type={'dashed'}/> </div>}<p>{comment.text}</p></>}
                    datetime={
                        <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(comment.createdAt).fromNow()}</span>
                        </Tooltip>}>

                    {this.state.opened===comment.id &&<Form onFinish={(fromData)=>{
                                                                this.handleReply(comment.id,fromData)
                                                            }}>
                        <div onClick={()=>this.setState({opened:null})} className={'comment-close-button'}><CloseCircleOutlined className='closeCommentCircle'/></div>

                        <Form.Item name={'text'} >
                            <TextArea rows={4}/>
                        </Form.Item>
                        <div className='addCommentDiv'>
                            <Form.Item name={'anonymous'}  >
                                <Switch  style={{margin:'0 20px',transform:'scale(1.5)'}} checkedChildren={<LockOutlined />} unCheckedChildren={<UserOutlined />}  />
                            </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit" loading={this.loading}
                                    type="primary">
                                Добавить комментарий
                            </Button>
                        </Form.Item>
                        </div>
                    </Form>}
                    {comment.Comments && comment.Comments.length?commentData(comment.Comments,child_deep+1):null}
                </Comment>
            </div>})
        return <div className={'comments-container'}>
            <Card>
            <Comment
                avatar={<Avatar src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}/>}
                content={
                    <Form ref={this.form} onFinish={this.handleFinish}>
                        <Form.Item name='text' rules={[{
                            required:true,
                        }]}>
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Row className='addCommentDiv'>
                            <div>
                                <Form.Item initialValue={false} name={'anonymous'}  >
                                    <Switch  style={{margin:'0 20px',transform:'scale(1.5)'}} checkedChildren={<LockOutlined />} unCheckedChildren={<UserOutlined />}  />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item >
                                    <Button loading={this.state.loading} htmlType="submit" type="primary">
                                        Добавить комментарий
                                    </Button>
                                </Form.Item>
                            </div>
                        </Row>
                    </Form>
                }
            />
            </Card>
            {!this.state.loading?this.state.data.length&&commentData(this.state.data,0):<Preloader/>}

        </div>

    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(Comments);
