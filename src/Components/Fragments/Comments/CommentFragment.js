import React, {Component} from "react";
import '@ant-design/compatible/assets/index.css';
import {
    Input,
    Button,
    Col,
    Divider,
    Form,
    Comment,
    Avatar,
    Tooltip, Typography
} from 'antd';
import {connect} from "react-redux";
import Preloader from "../../Preloader";
import moment from "moment";
import {CloseCircleOutlined} from '@ant-design/icons'

const {Title} = Typography
const {TextArea} = Input;
class Comments extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            comments:[],
            replyId:null
        };
        this.commentForm = React.createRef();
    }

    componentDidMount() {
        this.setState({
            comments:this.props.Comments
        })
    }


    commentHandler = (values) => {

        this.setState({
            commentsLoading: true,
            replyId:null
        })
        commentResource(this.props.state.auth.token, this.props.Resource, this.props.itemId, values).then(data => {
            this.commentForm.current.resetFields(['comment'])
            this.setState({
                comments: data.comments
            })
        }).catch(err => {
            notificate(err)
        }).finally(() => this.setState({
            commentsLoading: false,

        }))
    }

    render() {
        let commentData =(comments,child_deep)=> comments.map((comment, key) =>{
            return <div key={key}>
                <Comment
                    style={{margin: '20px'}}
                    actions={[this.state.replyId!==comment.id && child_deep<2&&<span onClick={()=>this.setState({replyId:comment.id})} key="comment-nested-reply-to">Մեկնաբանել</span>]}
                    author={comment.commenter.name}
                    avatar={
                        <Avatar
                            src={comment.commenter.photo ? comment.commenter.photo.public_url : AvatarImg}
                        />
                    }
                    content={
                        <p>
                            {comment.comment}
                        </p>
                    }
                    datetime={
                        <Tooltip
                            title={moment(comment.created_at).format('YYYY-MM-DD HH:mm')}>
                            <span>{moment(comment.created_at).fromNow()}</span>
                        </Tooltip>
                    }
                >
                    {this.state.replyId===comment.id&&<Form ref={this.commentForm}
                                                            onFinish={(fromData)=>{
                                                                fromData.parent_id = comment.id
                                                                this.commentHandler(fromData)
                                                            }}>
                        <div onClick={()=>this.setState({replyId:null})} className={'comment-close-button'}><CloseCircleOutlined /></div>

                        <Form.Item name={'comment'} rules={[
                            {
                                required: true,
                                message: 'Մեկնաբանությունը պետք է լինի առնվազն 1 նիշ'
                            }
                        ]}>
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" loading={this.loading}
                                    type="primary">
                                Ավելացնել մեկնաբանություն
                            </Button>
                        </Form.Item>
                    </Form>}
                    {comment.children && comment.children.length?commentData(comment.children,child_deep+1):null}

                </Comment>
            </div>})
        return (
            <Col lg={24}>
                {!this.state.commentsLoading ? this.state.comments.length ?commentData(this.state.comments,0): <Title style={{margin: '20px'}} level={4}>Մեկնաբանություններ
                    չկան</Title> : <Preloader/>}
                <Divider/>
                <Comment
                    style={{margin: '20px'}}
                    content={<Form ref={this.commentForm}
                                   onFinish={this.commentHandler}>
                        <Form.Item name={'comment'} rules={[
                            {
                                required: true,
                                message: 'Մեկնաբանությունը պետք է լինի առնվազն 1 նիշ'
                            }
                        ]}>
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" loading={this.loading}
                                    type="primary">
                                Ավելացնել մեկնաբանություն
                            </Button>
                        </Form.Item>
                    </Form>}
                />
            </Col>
        );
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({})
)(Comments);