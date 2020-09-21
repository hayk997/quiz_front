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
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const {Meta} = Card;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

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
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <Row className={'content-aligned'}>
            <Col className={'centered'} lg={24}>
                {this.props.state.auth.user.imageURL?
                    <Avatar size={100} src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}/>
                    :
                    <Upload
                        headers={{
                            "x-access-token": this.props.state.auth.token
                        }}
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={process.env.REACT_APP_API_ENDPOINT+"/userImage"}
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>}
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
