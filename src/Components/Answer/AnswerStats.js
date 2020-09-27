import React, {Component} from "react"
import {Avatar, Button, Col, Row, Layout, Image,Card} from "antd"
import {Table} from 'antd'
import {Link, withRouter} from "react-router-dom"
import axios from 'axios'
import api from "../../api";
import {connect} from "react-redux"
import Preloader from "../Preloader"

import './styles.sass'
import avatar from '../../dist/images/avatar.png'
import {Typography} from 'antd';
import img from "../../dist/images/a.jpg";

const {Title} = Typography;
const {Meta} = Card;
const {Content} = Layout

class AnswerStats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {}
        }
    }

    componentDidMount() {
        axios.request({
            url: api.answers.data.url + this.props.match.params.id,//for pagination add ?page=2
            method: api.answers.data.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            }
        }).then(res => res.data)
            .then(data => this.setState({loading: false, data: data}))
    }

    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: ['user', 'username'],
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend'],
                render: (item, record) => <><Avatar
                    src={record.user.imageURL ? process.env.REACT_APP_API_ENDPOINT + record.user.imageURL : avatar}/> {item} </>
            },
            {
                title: 'points',
                dataIndex: 'points',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.points - b.points,
            }
        ];

        return (
            this.state.loading ? <Preloader/> :
                <Content>
                    <Row className='stats'>
                        <Col style={{textAlign: 'center'}} lg={{span: 8, offset: 8}}>
                            <Card
                                hoverable
                                cover={<img alt="questionImage"
                                            src={process.env.REACT_APP_API_ENDPOINT + this.state.data.question.imageURL}/>}
                            >
                                <Meta title={this.state.data.question.title}/>
                            </Card>
                        </Col>
                        <Col style={{textAlign: 'center'}} lg={24}>
                            <Title level={2}>Насколько хорошо знаете
                                пользователя {this.state.data.user.username}?</Title>
                            <Link to={`/answers/${this.props.match.params.id}`}>
                                <Button>
                                    Перейти в вопросам
                                </Button>
                            </Link>
                            <Table columns={columns} rowKey={'id'} dataSource={this.state.data.setups}/>
                        </Col>
                        <Col lg={24}>
                            <Title level={3}>
                                What People think About you
                            </Title>

                            {Object.keys(this.state.data.question.content).map(key => {
                                let statistics = this.state.data.userId[key];
                                let sortedStats = [];
                                for (let stat in statistics) {
                                    sortedStats.push([stat, statistics[stat]]);
                                }

                                sortedStats.sort(function (a, b) {
                                    return b[1] - a[1];
                                });
                                const question = this.state.data.question.content[key].question;
                                const MAnswered = this.state.data.question.content[key].questions[parseInt(sortedStats[0])]
                                return <Row key={key} className={'most-answered-list'}>
                                    <Col lg={8}>
                                        <Title level={3}>{question}</Title>
                                    </Col>
                                    <Col lg={16}>
                                        <Row className={'centered'}>
                                            <Col lg={24} md={24} sm={24} xs={24}><Image src={process.env.REACT_APP_API_ENDPOINT+MAnswered.image}/></Col>
                                            <Col lg={24} md={24} sm={24} xs={24} style={{fontSize: '20px'}}>{MAnswered.title}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            })}
                        </Col>
                    </Row>
                </Content>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({})
)(withRouter(AnswerStats))