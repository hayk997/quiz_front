import React, {Component} from "react"
import {Col, Layout, Menu, Row, Drawer, Typography, Card, Slider} from "antd"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import axios from "axios";
import '../Quizes/styles.sass'
import api from "../../api";
import img from "../../dist/images/a.jpg";
import Preloader from "../Preloader";


class Answer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            questions: {},
            currentPage: '0',
            lastPage: 10,
            loading:true,
            answers:{},
            answer:{},
            points:0

        }
    }

    componentDidMount() {
        axios.request({
            url: api.answers.single.url + this.props.match.params.id,//for pagination add ?page=2
            method: api.answers.single.method,
            headers:{
                'x-access-token':this.props.state.auth.token
            }
        }).then(response => {
            this.setState({
                questions: response.data.question,
                answer:response.data,
                loading:false
            })
        })
    }
    handleSelect = (e) =>{
        this.setState({
            answers:{
                ...this.state.answers,
                [this.state.currentPage]:e,
            },
            points:e===this.state.answer.answers[this.state.currentPage]?this.state.points+1:this.state.points,
            currentPage:(parseInt(this.state.currentPage)+1).toString()
        },()=>{
            if(parseInt(this.state.currentPage)+1>=this.state.questions.count){
                axios.request({
                    url:api.setup.create.url,
                    method:api.setup.create.method,
                    headers:{
                        'x-access-token':this.props.state.auth.token
                    },
                    data: {
                        answers:this.state.answers,
                        answerId:this.props.match.params.id,
                        points:this.state.points
                    }
                }).then(response=>{
                    console.log(response)
                })
            }
        })


    }
    render() {
        return (
            <Row>
                <Col lg={{span: 14, offset: 5}}>
                    {this.state.loading?<Preloader/>:parseInt(this.state.currentPage)+1>=this.state.questions.count?<h1>Test Succesfully created</h1>:<Row>
                        <Col className={'centered'} lg={24}> <Typography.Title
                            level={2}>{this.state.questions.title}</Typography.Title></Col>
                        <Col lg={{span: 12, offset: 6}} md={{span: 16, offset: 4}} sm={24} xs={24}>
                            <Slider
                                disabled
                                min={1}
                                max={this.state.questions.count}
                                defaultValue={1}
                                value={this.state.currentPage+1}
                            />
                        </Col>
                        <Row>
                            <Col lg={24} className={'questionBlock'}>
                                <Col className={'centered'} lg={{span: 12, offset: 6}} md={{span: 16, offset: 4}}
                                     sm={24} xs={24}>
                                    <h1>{this.state.points}</h1>
                                    <h2>{this.state.questions.content[this.state.currentPage].question} </h2>
                                </Col>
                            </Col>
                            <Col lg={24}>
                                <Row>
                                    {this.state.questions.content[this.state.currentPage].questions.map((switches,key)=> <Col key={key} className={this.state.answer.answers[this.state.currentPage]===key?'cardColumn':'cardColumnIncorrect'} onClick={()=>this.handleSelect(key)} xs={24} sm={24} md={12}
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
    })
)(withRouter(Answer));
