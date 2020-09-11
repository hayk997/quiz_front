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
            loading: false
        }
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
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
        const {loading, imageUrl} = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div style={{marginTop: 8}}>Upload</div>
            </div>
        );

        return (
            <Row className='upload'>
                <Form>
                <Row justify={'center'} gutter={[24, 16]}>
                    <Col lg={10}>
                    <Upload
                        name="answer"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {imageUrl ?
                            <img src={imageUrl} id='1' alt="answer" style={{width: '100%'}}/>
                            : uploadButton}
                    </Upload>
                    Вопрос: <Input type='text' id='1'/>
                    </Col>
                    <Col lg={10}>
                    <Upload
                        name="answer"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {imageUrl ?
                            <img src={imageUrl} id='2' alt="answer" style={{width: '100%'}}/>
                            : uploadButton}
                    </Upload>
                    Вопрос: <Input type='text' id='2'/>
                    </Col>
                    <Col lg={10}>
                    <Upload
                        name="answer"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {imageUrl ?
                            <img src={imageUrl} id='3' alt="answer" style={{width: '100%'}}/>
                            : uploadButton}
                    </Upload>
                    Вопрос: <Input type='text' id='3'/>
                    </Col>
                    <Col lg={10}>
                    <Upload
                        name="answer"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {imageUrl ?
                            <img src={imageUrl} id='4' alt="answer" style={{width: '100%'}}/>
                            : uploadButton}
                    </Upload>
                    Вопрос: <Input type='text' id='4'/>
                    </Col>
                </Row>
                <Row className='uploadImages'>
                    <Col>
                    <Button size='large' type="primary" htmlType="submit">
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