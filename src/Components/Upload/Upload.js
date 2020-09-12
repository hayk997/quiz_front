import React, {Component} from "react"
import {Upload, message, Form, Input, Button, Row, Col, notification} from 'antd'
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import './styles.sass'
import axios from "axios";
import api from "../../api";

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const beforeUpload = (file) => {
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

class UploadAnswerImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            imageUrl: {},
            answersData: {},
            answerKey: 0,
            input: {}
        }
    }

    handleInputChange = (e, id) => {
        this.setState({
            input: {
                ...this.state.input,
                [id]: e.target.value
            },
            answersData: {
                ...this.state.answersData,
                [this.state.answerKey]: {
                    ...(this.state.answersData[this.state.answerKey] ? this.state.answersData[this.state.answerKey] : {}),
                        title: 'dsdsd',
                        [id]: {
                            ...(this.state.answersData[this.state.answerKey] && this.state.answersData[this.state.answerKey][id] ? this.state.answersData[this.state.answerKey][id] : {}),
                            title: e.target.value,
                        }
                }
            }
        })
    }
    handleChange = (info, id) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            if(id==='avatar'){
                this.setState({
                    answersData: {
                        ...this.state.answersData,
                        [id]:info.file.response.path,
                    }
                })
            }else{
                this.setState({
                    answersData: {
                        ...this.state.answersData,
                        [this.state.answerKey]: {
                            ...(this.state.answersData[this.state.answerKey] ? this.state.answersData[this.state.answerKey] : {}),
                            title: 'dsdsd',
                            [id]: {
                                ...(this.state.answersData[this.state.answerKey] && this.state.answersData[this.state.answerKey][id] ? this.state.answersData[this.state.answerKey][id] : {}),
                                filePath: info.file.response.path,
                            }
                        }
                    }
                })
            }

            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl: {
                        ...this.state.imageUrl,
                        [id]: imageUrl
                    },
                    loading: false,
                }),
            );
        }
    };
    nextPage = () => {
        this.setState({
            answerKey: this.state.answerKey + 1
        }, () => {
            this.setState({
                imageUrl: {},
                input: {}
            })
        })
    }
    onTitleChange = (e) => {
        this.setState({
            answersData: {
                ...this.state.answersData,
                [this.state.answerKey]: {
                    ...(this.state.answersData[this.state.answerKey] ? this.state.answersData[this.state.answerKey] : {}),
                    title: e.target.value,
                }
            }
        })
    }
    onQuestionChange = (e) => {
        this.setState({
            answersData: {
                ...this.state.answersData,
             question:e.target.value
            }
        })
    }
    handleCreateQuestion = () =>{
        axios.request( {
            url:api.auth.login.url,
            method: api.auth.login.method,
            data: this.state.answersData
        }).then(response=> {
            if(response.data.message){
                notification.warning({
                    message: 'Warning',
                    description: response.data.message,
                });
            }else{
                this.props.onLogin(response.data)
            }


        }).catch(err=>{
            console.log(err.message)


        })
    }
    render() {
        console.log(this.state)
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div style={{marginTop: 8}}>Upload</div>
            </div>
        );
        return (
            <Row className='upload'>
                <Form>
                    <Row justify={'center'} gutter={[24, 16]}>
                        <Col lg={24}>
                            <Input onChange={this.onQuestionChange}/>
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="http://localhost:4000/files"
                                beforeUpload={beforeUpload}
                                onChange={(info) => {
                                    this.handleChange(info,'avatar')
                                }}
                            >
                                {this.state.imageUrl.avatar ?
                                    <img src={this.state.imageUrl.avatar} alt="answer" style={{width: '100%'}}/>
                                    : uploadButton}
                            </Upload>
                        </Col>
                        <Col lg={24}>
                            <Input onChange={this.onTitleChange}/>

                        </Col>
                        {[...Array(4).keys()].map(key => <Col key={key} lg={10}>
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="http://localhost:4000/files"
                                beforeUpload={beforeUpload}
                                onChange={(info) => {
                                    this.handleChange(info, key)
                                }}
                            >
                                {this.state.imageUrl[key] ?
                                    <img src={this.state.imageUrl[key]} alt="answer" style={{width: '100%'}}/>
                                    : uploadButton}
                            </Upload>
                            Вопрос: <Input name={[key, 'title']} value={this.state.input[key]} onChange={(e) => {
                            this.handleInputChange(e, key)
                        }} type='text'/>
                        </Col>)}
                    </Row>
                    <Row className='uploadImages'>
                        <Col>
                            <Button onClick={this.nextPage} size='large' type="primary">
                                Add Answer
                            </Button>
                            <Button onClick={this.handleCreateQuestion} size='large' type="primary">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        )
    }
}

export default UploadAnswerImage
