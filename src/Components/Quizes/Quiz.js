import React, {Component} from "react"
import {Alert, Col, Progress, Row, Typography, Button} from "antd"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import axios from "axios";
import './styles.sass'
import api from "../../api";
import img from "../../dist/images/a.jpg";
import Preloader from "../Preloader";
const {Paragraph}= Typography

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            questions: {},
            currentPage: 0,
            lastPage: 10,
            loading:true,
            answers:{},
            quizId:null
        }
    }

    componentDidMount() {
        axios.request({
            url: api.question.single.url + this.props.match.params.id+(this.props.state.views['quiz']?.includes(this.props.match.params.id)?'?c=1':''),
            method: api.question.single.method
        }).then(response => {
            this.props.view({
                page:'quiz',
                id:this.props.match.params.id
            })
            this.setState({
                questions: response.data,
                loading:false
            })
        })
    }
    handleSelect = (key) =>{
        this.setState({
            answers:{
                ...this.state.answers,
                [this.state.currentPage]:key
            },
            currentPage:this.state.currentPage+1
        },()=>{
            if(this.state.currentPage>=this.state.questions.count){
                axios.request({
                    url:api.answers.create.url,
                    method:api.answers.create.method,
                    headers:{
                        'x-access-token':this.props.state.auth.token
                    },
                    data: {
                        answers:this.state.answers,
                        questionId:this.props.match.params.id
                    }
                }).then(response=>{
                    this.setState({
                        quizId:response.data.id
                    })
                })
            }
        })
    }
    render() {
        return (
            <Row>
                <Col lg={{span: 14, offset: 5}}>
                    {this.state.loading?<Preloader/>:this.state.currentPage>=this.state.questions.count?<Alert
                        style={{marginTop:'50px'}}
                        message="Test Successfully created"
                        description={<>You can view your test <Button onClick={()=>this.props.history.push(`/stats/`+this.state.quizId)} type={'link'}>HERE</Button>
                                        <Paragraph copyable>{`${process.env.REACT_APP_DOMAIN}stats/${this.state.quizId}`}</Paragraph> </>}
                        type="success"
                        showIcon
                    />:<Row>
                        <Col className={'centered'} lg={24}> <Typography.Title
                            level={2}>{this.state.questions.title}</Typography.Title></Col>
                        <Col lg={{span: 12, offset: 6}} md={{span: 16, offset: 4}} sm={24} xs={24}>
                            <Progress percent={(this.state.currentPage/this.state.questions.count)*100} />
                        </Col>
                        <Row>
                            <Col lg={24} className={'questionBlock'}>
                            <Col className={'centered'} lg={{span: 12, offset: 6}} md={{span: 16, offset: 4}}
                                     sm={24} xs={24}>
                                    <h2>{this.state.questions.content[this.state.currentPage].question} </h2>
                                </Col>
                            </Col>
                                    <Col lg={24}>
                                        <Row>
                                            {this.state.questions.content[this.state.currentPage].questions.map((switches,key)=> <Col key={key} className={'cardColumn'} onClick={(e)=>this.handleSelect(key,e)} xs={24} sm={24} md={12}
                                                                                                  lg={12} xl={12}>
                                                <Row className={'centered'}>
                                                    <Col lg={24} md={24} sm={24} xs={24}><img className={'cardCover'}
                                                                                              alt="example" src={process.env.REACT_APP_API_ENDPOINT+switches.image}/></Col>
                                                    <Col lg={24} md={24} sm={24} xs={24} style={{fontSize: '20px'}}>{switches.title}</Col>
                                                </Row>
                                            </Col>)}

                                        </Row>
                                    </Col>
                                </Row>

                    </Row>}
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
        onLogout: () => {
            dispatch({
                type: "LOGOUT",
            })
        },
        view: (payload) => {
            dispatch({
                type: "VIEW_PAGE",
                payload
            })
        },
    })
)(withRouter(Quiz));
