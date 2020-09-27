import React,{Component} from "react";
import {Col, Row, Card, Avatar, Typography, Button} from "antd";
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
            loading:false,
            answers:[],
            showUpload:false
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
            console.log(response.data)
           this.setState({
               answers:response.data.answers
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

    render() {
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <Row className={'content-aligned'}>
            <Col className={'centered'} lg={24}>
                {this.props.state.auth.user.imageURL && !this.state.showUpload ?
                    <>
                        {  //todo stex arden requestic galisa useri nkar@ tes ete galisa stex dir konkret et user nkar@
                        }
                    <Avatar style={{borderRadius:'100%'}} size={100} src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}/>
                    <Button onClick={()=>this.setState({showUpload:true})}>Change Photo</Button>
                    </>:
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
                        {this.props.state.auth.user.imageURL ?
                            <img src={process.env.REACT_APP_API_ENDPOINT+this.props.state.auth.user.imageURL}
                                 alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                }
                <Typography.Title level={2}>{this.props.state.auth.user.username}</Typography.Title>
            </Col>
                <Col lg={24}>
                    <Typography.Title level={4}>My apps</Typography.Title>
                </Col>
                {this.state.answers.length?
                    this.state.answers.map((question,key)=> <Card
                        style={{width: 300}}
                        key={key}
                        cover={
                            <img
                                alt="example"
                                src={process.env.REACT_APP_API_ENDPOINT+question.question.imageURL}
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Card.Meta
                            title={<NavLink to={'/stats/'+question.id} >{question.question.title}</NavLink>}
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
        onUpdate: (data) => {
            dispatch({
                type: "UPDATE",
                payload: data
            })
        },
    })
)(Profile);
