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

        }
    }
    componentDidMount() {
        axios.request({
            url:api.question.list.url,//for pagination add ?page=2
            method:api.question.list.method
        }).then(response=>{
            console.log(response)
        })
    }

    render() {
        return (
            <Row className={'content-aligned'}>
            <Col className={'centered'} lg={24}>
                <Avatar size={100} src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}/>
                <Typography.Title level={2}>{this.props.state.auth.user.username}</Typography.Title>
            </Col>
                <Col lg={24}>
                    <Typography.Title level={4}>My apps</Typography.Title>
                </Col>

                    <Card
                        style={{ width: 300 }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            title="Card title"
                            description="This is the description"
                        />
                    </Card>

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
