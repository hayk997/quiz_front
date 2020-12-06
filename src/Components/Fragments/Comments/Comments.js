import React from "react";
import {
    DislikeOutlined,
    LikeOutlined,
    DislikeFilled,
    LikeFilled,
    CloseCircleOutlined,
    UserOutlined, LockOutlined,
    CheckOutlined,CloseOutlined
} from '@ant-design/icons';
import {Row, Col,Comment, Switch, Tooltip, Avatar, Form, Button, List, Input, Card} from 'antd';
import moment from 'moment';
import axios from "axios";
import api from "../../../api";
import {connect} from "react-redux";
import Preloader from "../../Preloader";

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

    handleUpdateComment=(Comments,response)=>{
       return Comments.map(comment=>{
            if(comment.id===response.data.id){
                return response.data
            }else{
                if(comment.Comments &&comment.Comments.length){
                    comment.Comments =this.handleUpdateComment(comment.Comments,response)
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
            data =this.handleUpdateComment(data,response)
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
            console.log(response)
        }).catch(e=>{
            console.log(e)
        })
    }
    render() {
        let commentData =(comments,child_deep)=> comments.map((comment, key) =>{
            return comment&&<div key={key}>
                <Comment
                    style={{margin: '20px'}}
                    actions={[
                        this.state.replyId!==comment.id && child_deep<2&&<span onClick={()=>this.replyTo(comment.id)} key="text">Reply to</span>,
                        <Tooltip key="comment-basic-like" title="Like">
                      <span onClick={()=>this.handleReact(comment.id,1)}>
                        {JSON.parse(comment.likes).includes(this.props.state.auth.user.id) ? <LikeFilled/> : <LikeOutlined/>}
                          <span className="comment-action">{JSON.parse(comment.likes).length}</span>
                      </span>
                        </Tooltip>,
                        <Tooltip key="comment-basic-dislike" title="Dislike">
                      <span onClick={()=>this.handleReact(comment.id,0)}>
                        {JSON.parse(comment.dislikes).includes(this.props.state.auth.user.id) ? <DislikeFilled/> : <DislikeOutlined/>}
                          <span className="comment-action">{JSON.parse(comment.dislikes).length}</span>
                      </span>
                        </Tooltip>,
                        <span onClick={()=>this.handleRemove(comment.id)}>Remove</span>,
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked
                        />
                    ]}
                    author={<a>{comment.fromUser.username}</a>}
                    avatar={<Avatar src={process.env.REACT_APP_API_ENDPOINT+comment.fromUser.imageURL}/>}
                    content={<p>{comment.text}</p>}
                    datetime={
                        <Tooltip title={moment(comment.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(comment.createdAt).fromNow()}</span>
                        </Tooltip>}>
                    {this.state.opened===comment.id &&<Form onFinish={(fromData)=>{
                                                                this.handleReply(comment.id,fromData)
                                                            }}>
                        <div onClick={()=>this.setState({opened:null})} className={'comment-close-button'}><CloseCircleOutlined /></div>

                        <Form.Item name={'text'} >
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" loading={this.loading}
                                    type="primary">
                                Ավելացնել մեկնաբանություն
                            </Button>
                        </Form.Item>
                    </Form>}
                    {comment.Comments && comment.Comments.length?commentData(comment.Comments,child_deep+1):null}

                </Comment>
            </div>})
        return <>

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
                        <Row>
                            <Col>
                                <Form.Item initialValue={false} name={'anonymous'}  >
                                    <Switch  checkedChildren={<LockOutlined />} unCheckedChildren={<UserOutlined />}  />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item >
                                    <Button loading={this.state.loading} htmlType="submit" type="primary">
                                        Add Comment
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>


                    </Form>
                }
            />
            </Card>
            {!this.state.loading?this.state.data.length&&commentData(this.state.data,0):<Preloader/>}

        </>

    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(Comments);
