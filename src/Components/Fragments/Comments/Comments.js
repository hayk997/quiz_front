import React, {createElement} from "react";
import {DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled} from '@ant-design/icons';
import {Comment, Switch, Tooltip, Avatar, Form, Button, List, Input} from 'antd';
import moment from 'moment';
import axios from "axios";
import api from "../../../api";
import {connect} from "react-redux";


const {TextArea} = Input;

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dislikes: 0,
            likes: 0,
            action: null,
            comments: [],
            submitting: false,
            value: '',
        }
        this.form=React.createRef()
    }
    handleFinish=(data)=>{
        axios.request( {
            url:`${api.user.post.url}${this.props.uId}/post`,
            method: api.auth.facebook.login.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            },
            data:data
        }).then(response=>{
            console.log(response)
        }).catch(err=>{
            console.log(err)
        })
    }
    render() {
        return <>
            {this.props.data.length&&this.props.data.map(item=><Comment
                    actions={[
                        <Tooltip key="comment-basic-like" title="Like">
                      <span>
                        {this.state.action === 'liked' ? <LikeFilled/> : <LikeOutlined/>}
                        <span className="comment-action">{this.state.likes}</span>
                      </span>
                        </Tooltip>,
                        <Tooltip key="comment-basic-dislike" title="Dislike">
                      <span>
                        {this.state.action === 'disliked' ? <DislikeFilled/> : <DislikeOutlined/>}
                          <span className="comment-action">{this.state.dislikes}</span>
                      </span>
                        </Tooltip>,
                        <span key="comment-basic-reply-to">Reply to</span>,
                    ]}
                    author={<a>{item.fromUser.username}</a>}
                    avatar={<Avatar src={process.env.REACT_APP_API_ENDPOINT+item.fromUser.imageURL}/>}
                    content={<p>{item.text}</p>}
                    datetime={
                        <Tooltip title={moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(item.createdAt).fromNow()}</span>
                        </Tooltip>}/>
            )}
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
                            <Button htmlType="submit" type="primary">
                                Add Comment
                            </Button>
                        </Form.Item>
                    </Form>
                }
            />
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
