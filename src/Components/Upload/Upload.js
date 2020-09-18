import React, {Component} from "react"
import Space, {Upload, message, Form, Input, Button, Row, Col, notification} from 'antd'
import {MinusCircleOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons'
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
            input: {},
            quiz: {}
        }
        this.form = React.createRef()
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
            this.form.current.setFieldsValue({
                [id]: info.file.response.path,
            })
            if (id === 'avatar') {
                this.setState({
                    answersData: {
                        ...this.state.answersData,
                        [id]: info.file.response.path,
                    }
                })
            } else {
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
                question: e.target.value
            }
        })
    }
    handleCreateQuestion = () => {
        axios.request({
            url: api.question.create.url,
            method: api.question.create.method,
            data: this.state.answersData
        }).then(response => {
            if (response.data.message) {
                notification.warning({
                    message: 'Warning',
                    description: response.data.message,
                });
            } else {
                console.log(response)
            }
        }).catch(err => {
            console.log(err.message)
        })
    }
    handleStartApp = (formData) => {
        this.setState({
            quiz: {
                ...formData
            }
        })
    }
    handleAddStep = (formData) => {

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
                {this.state.quiz.title ? <Form ref={this.form} onFinish={this.handleStartApp}>
                        <Form.Item name={'title'} rules={[
                            {required: true}
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name={'image'} rules={[
                            {required: true}
                        ]}>
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="http://localhost:4000/files"
                                beforeUpload={beforeUpload}
                                onChange={(info) => {
                                    this.handleChange(info, 'image')
                                }}
                            >
                                {this.state.imageUrl.image ?
                                    <img src={this.state.imageUrl.image} alt="answer" style={{width: '100%'}}/>
                                    : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType={'submit'}>Create</Button>
                        </Form.Item>
                    </Form> :
                    <Form ref={this.form} onFinish={this.handleAddStep}>
                        <Row justify={'center'} gutter={[24, 16]}>
                            <Col lg={24}>
                                <Form.Item name={'question'}>
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Form.List name="questions">
                                {(fields, {add, remove}) => {
                                    return (
                                        <Col lg={24}>
                                            {fields.map((field,key) => (
                                                <Col key={key+'s'} lg={12}>
                                                    <Form.Item
                                                        {...field}
                                                        label={'Вопрос '+field.key}
                                                        name={[field.name, 'image']}
                                                        fieldKey={[field.fieldKey, 'image']}
                                                        valuePropName={'fileList'}
                                                        rules={[{required: true, message: 'Missing last name'}]}
                                                    >
                                                        <Upload
                                                            name="image"
                                                            listType="picture-card"
                                                            className="avatar-uploader"
                                                            showUploadList={false}
                                                            action="http://localhost:4000/files"
                                                            beforeUpload={beforeUpload}
                                                            onChange={(info) => {
                                                                this.handleChange(info, field.key)
                                                            }}
                                                        >
                                                            {this.state.imageUrl[field.key] ?
                                                                <img src={this.state.imageUrl[field.key]} alt="answer"
                                                                     style={{width: '100%'}}/>
                                                                : uploadButton}
                                                        </Upload>
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label={'Вопрос '+field.key}
                                                        name={[field.name, 'title']}
                                                        fieldKey={[field.fieldKey, 'title']}
                                                        rules={[{required: true, message: 'Missing last name'}]}
                                                    >
                                                        <Input type='text'/>
                                                    </Form.Item>
                                                    <MinusCircleOutlined
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                    />
                                                </Col>
                                            ))}

                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                    block
                                                >
                                                    <PlusOutlined/> Add field
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    );
                                }}
                            </Form.List>
                        </Row>
                        <Row className='uploadImages'>
                            <Col>
                                <Button onClick={()=>console.log(this.form.current.getFieldsValue())}>smth</Button>
                                <Button onClick={this.nextPage} size='large' type="primary">
                                    Add Answer
                                </Button>
                                <Button onClick={this.handleCreateQuestion} size='large' type="primary">
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Form>}
            </Row>
        )
    }
}

export default UploadAnswerImage
