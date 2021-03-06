import React, {Component} from "react"
import {Col, Row, Typography, Progress,Divider} from "antd"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import axios from "axios";
import '../Quizes/styles.sass'
import '../Quizes/styles.sass'
import api from "../../api";
import img from "../../dist/images/a.jpg";
import Preloader from "../Preloader";
import SuccessComponent from "../SuccessComponent/SuccessComponent";


class Answer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            questions: {},
            currentPage: 0,
            lastPage: 10,
            loading:true,
            answers:{},
            answer:{},
            points:0,
            disabled:false

        }
    }

    componentDidMount() {
        axios.request({
            url: api.answers.single.url + this.props.match.params.id,//for pagination add ?page=2
            method: api.answers.single.method,
            headers:{
                'x-access-token':this.props.state.auth.token,
                'cache-control':'no-cache'
            }
        }).then(response => {
            this.props.view({
                page:'answer',
                id:this.props.match.params.id
            })
            this.setState({
                questions: response.data.question,
                answer:response.data,
                loading:false
            })
        }).catch(e=>{
        })
    }
    handleSelect = (e,key) =>{
        if(!this.state.disabled){
            this.setState({
                disabled:true
            })

            if(key===this.state.answer.answers[this.state.currentPage]){
                e.currentTarget.classList.add("trueAnswer")
            }else{
                e.currentTarget.classList.add("wrongAnswer")
            }

            setTimeout(()=>this.setState({
                answers:{
                    ...this.state.answers,
                    [this.state.currentPage]:key,
                },
                points:key===this.state.answer.answers[this.state.currentPage]?this.state.points+1:this.state.points,
                currentPage:this.state.currentPage+1,
                disabled:false
            },()=>{
                if(this.state.currentPage>=this.state.questions.count){
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
            }),800)
        }

    }
    render() {

        return (
            <Row>
                <Col lg={{span: 14, offset: 5}}>
                    {this.state.loading?<Preloader/>:this.state.currentPage>=this.state.questions.count?<Col className={'centered'} ><SuccessComponent points={this.state.points}/></Col> :<Row>
                        <Col className={'centered'} lg={24}> <Typography.Title
                            level={2}>{this.state.questions.title}</Typography.Title></Col>
                        <Col lg={{span: 12, offset: 6}} md={{span: 16, offset: 4}} sm={24} xs={24}>
                            <Progress percent={parseInt((this.state.currentPage/this.state.questions.count)*100)} />
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
                                    {this.state.questions.content[this.state.currentPage].questions.map((switches,key)=> <Col key={key+switches.title} className={'cardColumn'} onClick={(e)=>this.handleSelect(e,key)} xs={24} sm={24} md={12}
                                                                                                                              lg={12} xl={12}>
                                        <Row className={'centered'}>
                                            <Col lg={24} md={24} sm={24} xs={24}><img className={'cardCover'}
                                                                                      alt="example" src={process.env.REACT_APP_API_ENDPOINT+switches.image}/></Col>
                                            <Divider/>
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
)(withRouter(Answer));
