import React, {createElement} from "react";
import {DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled} from '@ant-design/icons';
import {Comment, Switch, Tooltip, Avatar, Form, Button, List, Input} from 'antd';
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
            dislikes: 0,
            likes: 0,
            action: null,
            data: [],
            submitting: false,
            value: '',
            loading:false
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
           this.setState({
               data:data.filter(item=>item.id!==id)
           })

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
            data= data.map(comment=>{
                if(comment.id===response.data.id){
                    console.log(response.data)
                    return response.data
                }else{
                    console.log(comment)
                   return comment
                }
            })
            this.setState({
                data
            })
        })
    }
    render() {
        return <>
            <Comment
                avatar={<Avatar src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}/>}
                content={
                    <Form ref={this.form} onFinish={this.handleFinish}>
                        <Form.Item name='text' rules={[{
                            required:true,
                        }]}>
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Form.Item >
                            <Button loading={this.state.loading} htmlType="submit" type="primary">
                                Add Comment
                            </Button>
                        </Form.Item>
                    </Form>
                }
            />
            {!this.state.loading?this.state.data.length&&this.state.data.map(item=><Comment
                    actions={[
                        <Tooltip key="comment-basic-like" title="Like">
                      <span onClick={()=>this.handleReact(item.id,1)}>
                        {this.state.action === 'liked' ? <LikeFilled/> : <LikeOutlined/>}
                        <span className="comment-action">{JSON.parse(item.likes).length}</span>
                      </span>
                        </Tooltip>,
                        <Tooltip key="comment-basic-dislike" title="Dislike">
                      <span onClick={()=>this.handleReact(item.id,0)}>
                        {this.state.action === 'disliked' ? <DislikeFilled/> : <DislikeOutlined/>}
                          <span className="comment-action">{JSON.parse(item.dislikes).length}</span>
                      </span>
                        </Tooltip>,
                        <span key="comment-basic-reply-to">Reply to</span>,
                        <span onClick={()=>this.handleRemove(item.id)}>Remove</span>,

                    ]}
                    author={<a>{item.fromUser.username}</a>}
                    avatar={<Avatar src={process.env.REACT_APP_API_ENDPOINT+item.fromUser.imageURL}/>}
                    content={<p>{item.text}</p>}
                    datetime={
                        <Tooltip title={moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(item.createdAt).fromNow()}</span>
                        </Tooltip>}/>
            ):<Preloader/>}

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
