import React, {Component} from "react"
import {Upload, message, Form, Input, Button, Row, Col} from 'antd'
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import './styles.sass'

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
            imageUrl:{},
            answersData: {},
            answerKey:0,
            input:{}
        }
    }
    handleInputChange = (e,id)=>{
        this.setState({
            input:{
                ...this.state.input,
                [id]:e.target.value
            },
            answersData:{
                ...this.state.answersData,
                [this.state.answerKey]:{
                    ...(this.state.answersData[this.state.answerKey]?this.state.answersData[this.state.answerKey]:{}),
                    quiz:{
                        title:'dsdsd',
                        ...(this.state.answersData[this.state.answerKey] && this.state.answersData[this.state.answerKey].quiz ?this.state.answersData[this.state.answerKey].quiz:{}),
                            [id]:{
                                ...(this.state.answersData[this.state.answerKey] && this.state.answersData[this.state.answerKey].quiz[id]?this.state.answersData[this.state.answerKey].quiz[id]:{}),
                                title:e.target.value,
                            }
                    }
                }
            }
        })
    }
    handleChange = (info,id) => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                answersData:{
                    ...this.state.answersData,
                    [this.state.answerKey]:{
                        ...(this.state.answersData[this.state.answerKey]?this.state.answersData[this.state.answerKey]:{}),
                        quiz:{
                            title:'dsdsd',
                            ...(this.state.answersData[this.state.answerKey] && this.state.answersData[this.state.answerKey].quiz?this.state.answersData[this.state.answerKey].quiz:{}),
                            [id]:{
                                ...(this.state.answersData[this.state.answerKey] && this.state.answersData[this.state.answerKey].quiz[id]?this.state.answersData[this.state.answerKey].quiz[id]:{}),
                                filePath:info.file.response.path,
                            }
                        }
                    }
                }
            })
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl:{
                        ...this.state.imageUrl,
                        [id]:imageUrl
                    },
                    loading: false,
                }),
            );
        }
    };
    nextPage = ()=>{
        this.setState({
           answerKey:this.state.answerKey+1
        },()=>{
            this.setState({
                imageUrl:{},
                input:{}
            })
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
                    {[...Array(4).keys()].map(key=><Col key={key} lg={10}>
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="http://localhost:4000/files"
                            beforeUpload={beforeUpload}
                            onChange={(info)=>{
                                this.handleChange(info,key)
                            }}
                        >
                            {this.state.imageUrl[key] ?
                                <img src={this.state.imageUrl[key]}  alt="answer" style={{width: '100%'}}/>
                                : uploadButton}
                        </Upload>
                        Вопрос: <Input name={[key,'title']} value={this.state.input[key]} onChange={(e)=>{this.handleInputChange(e,key)}} type='text' />
                    </Col>)}
                </Row>
                <Row className='uploadImages'>
                    <Col>
                        <Button onClick={this.nextPage} size='large' type="primary">
                            Add Answer
                        </Button>
                    <Button size='large' type="primary" >
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