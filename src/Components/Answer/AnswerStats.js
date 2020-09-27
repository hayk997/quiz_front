import React, {Component} from "react"
import {Avatar, Button, Col, Row} from "antd"
import { Table } from 'antd'
import {Link, withRouter} from "react-router-dom"
import axios from 'axios'
import api from "../../api";
import {connect} from "react-redux"
import Preloader from "../Preloader"
import { Card } from 'antd'
import './styles.sass'
import avatar from '../../dist/images/avatar.png'
import { Typography } from 'antd';

const { Title } = Typography;
const { Meta } = Card;


class AnswerStats extends Component {
    constructor(props) {
        super(props)
        this.state={
            loading:true,
            data:{}
        }
    }
    componentDidMount() {
        axios.request({
            url: api.answers.data.url + this.props.match.params.id,//for pagination add ?page=2
            method: api.answers.data.method,
            headers:{
                'x-access-token':this.props.state.auth.token,
                'cache-control':'no-cache'
            }
        }).then(res=>res.data)
          .then(data=>this.setState({loading:false,data:data}))
    }

    render() {
        console.log(this.state.data)
        const columns = [
            {
                title: 'Name',
                dataIndex: ['user','username'],
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend'],
                render:(item,record)=><><Avatar src={record.user.imageURL?process.env.REACT_APP_API_ENDPOINT+record.user.imageURL:avatar}/> {item} </>
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
            <Row className='stats'>
                <Col style={{textAlign:'center'}} lg={{span:14,offset:5}}>
                            <Card
                                hoverable
                                style={{ marginLeft: '30%',width: '40%' }}
                                cover={<img alt="questionImage" src={process.env.REACT_APP_API_ENDPOINT+this.state.data.question.imageURL}/>}
                            >
                                <Meta title={this.state.data.question.title} />
                            </Card>
                </Col>
                <Col style={{textAlign:'center'}} lg={{span:14,offset:5}}>
                    <Title level={2}>Насколько хорошо знаете пользователя {this.state.data.user.username}?</Title>>
                        <Link to={`/answers/${this.props.match.params.id}`}>
                            <Button>
                                Перейти в вопросам
                            </Button>
                        </Link>
                    <Table columns={columns} rowKey={'id'} dataSource={this.state.data.setups} />
                </Col>
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
)(withRouter(AnswerStats))