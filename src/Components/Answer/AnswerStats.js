import React, {Component} from "react"
import {Avatar, Button, Col, Row, Layout, Image, Divider} from "antd"
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
import {CaretRightOutlined} from '@ant-design/icons';
import FastAuth from "../Fragments/FastAuth/FastAuth";

const {Title} = Typography;

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
            url: api.answers.data.url + this.props.match.params.id+(this.props.state.views['answer']?.includes(this.props.match.params.id)?'?c=1':''),
            method: api.answers.data.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            }
        }).then(res => res.data)
            .then(data => this.setState({loading: false, data: data}))
        this.props.view({
            page:'answer',
            id:this.props.match.params.id
        })
    }

    render() {
        const columns = [
            {
                title: 'Имя',
                dataIndex: ['user', 'username'],
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend'],
                render: (item, record) => <><Avatar
                    src={record.user.imageURL ? process.env.REACT_APP_API_ENDPOINT + record.user.imageURL : avatar}/> {item} </>
            },
            {
                title: 'Очки',
                dataIndex: 'points',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.points - b.points,
            }
        ];

        return (
            this.state.loading ? <Preloader/> :
                <Content className={'answer-stats'}>
                    <Row className='stats'>
                        <Col style={{textAlign: 'center',marginBottom:'25px'}} lg={{span: 4, offset: 10}}>
                            <Title level={1}>{this.state.data.question.title}</Title>
                           <Image alt="questionImage"
                                            src={process.env.REACT_APP_API_ENDPOINT + this.state.data.question.imageURL}/>

                        </Col>
                        <Col style={{textAlign: 'center'}} lg={24}>
                            <Title level={2}>Насколько хорошо знаете
                                пользователя {this.state.data.user.username}?</Title>
                            <Divider/>
                            {this.props.state.auth.token?<Link to={`/answers/${this.props.match.params.id}`}>
                                <Button type={'primary'} icon={<CaretRightOutlined />} className={'start-button'}>
                                    Перейти в вопросам
                                </Button>
                            </Link>:<FastAuth refId={this.state.data.user.id} title={'Войдите чтобы пройти тест'}/>}
                            <Divider/>
                            <Table size={'small'} columns={columns} rowKey={'id'} dataSource={this.state.data.setups}/>
                        </Col>
                        {Object.keys(this.state.data.userId).length ?<Col lg={24}>
                            <Title level={3}>
                                What People think About you
                            </Title>

                            {Object.keys(this.state.data.question.content).map((key,index) => {
                                let statistics = this.state.data.userId[key];
                                let sortedStats = [];
                                for (let stat in statistics) {
                                    sortedStats.push([stat, statistics[stat]]);
                                }

                                sortedStats.sort(function (a, b) {
                                    return b[1] - a[1];
                                });
                                const question = this.state.data.question.content[key].question;
                                const MAnswered = this.state.data.question.content[key].questions[parseInt(sortedStats[0][0])]
                                return <Row key={key} className={'most-answered-list'}>
                                    <Col lg={8}>
                                        <Title level={3}>{question}</Title>
                                        <Title level={4}>Ответ был выбран {sortedStats[0][1]} раз</Title>
                                    </Col>
                                    <Col lg={16}>
                                        <Row className={'centered'}>
                                            <Col lg={24} md={24} sm={24} xs={24}><Image src={process.env.REACT_APP_API_ENDPOINT+MAnswered.image}/></Col>
                                            <Col lg={24} md={24} sm={24} xs={24} style={{fontSize: '20px'}}>{MAnswered.title}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            })}
                        </Col>:null}
                    </Row>
                </Content>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch  => ({
        view: (payload) => {
            dispatch({
                type: "VIEW_PAGE",
                payload
            })
        },
    })
)(withRouter(AnswerStats))
