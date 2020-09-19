import React,{Component} from "react";
import  {Col, Row,Card, Avatar, Typography} from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../api";

const {Meta} = Card;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions:{}
        }
    }
    componentDidMount() {
        axios.request({
            url:api.question.list.url,//for pagination add ?page=2
            method:api.question.list.method
        }).then(response=>{
           this.setState({
               questions:response.data
           })
        })
    }

    render() {
        console.log(this.state)
        return (
            <Row className={'content-aligned'}>
            <Col className={'centered'} lg={24}>
                <Avatar size={100} src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}/>
                <Typography.Title level={2}>{this.props.state.auth.user.username}</Typography.Title>
            </Col>
                <Col lg={24}>
                    <Typography.Title level={4}>My apps</Typography.Title>
                </Col>
                {this.state.questions.data && this.state.questions.data.length?
                    this.state.questions.data.map((question,key)=> <Card
                        style={{width: 300}}
                        key={key}
                        cover={
                            <img
                                alt="example"
                                src={process.env.REACT_APP_API_ENDPOINT+question.imageURL}
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Card.Meta
                            title={question.title}
                        />
                    </Card>):null
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

    })
)(Profile);
