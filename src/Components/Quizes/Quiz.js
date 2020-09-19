import React, {Component} from "react"
import {Col, Layout, Menu, Row, Drawer, Typography, Card, Slider} from "antd"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import axios from "axios";
import './styles.sass'
import api from "../../api";
import img from "../../dist/images/a.jpg";



class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            questions:{}
        }
    }
    componentDidMount() {
        axios.request({
            url:api.question.single.url+this.props.match.params.id,//for pagination add ?page=2
            method:api.question.single.method
        }).then(response=>{
            console.log(response.data)
            this.setState({
                questions:response.data
            })
        })
    }

    render() {
        return (
            <Row >
                <Col lg={{span:14,offset:5}}>
                    <Row >
                        <Col lg={{span:12,offset:6}} md={{span:16,offset:4}} sm={24} xs={24}>
                            <Slider
                                disabled
                                min={1}
                                max={this.state.lastPage}
                                marks={
                                    {
                                        1: '1',
                                        2: '2',
                                        3: '3',
                                        4: '4',
                                        5: '5',
                                        6: '6',
                                        7: '7',
                                        8: '8',
                                        9: '9',
                                        10: '10'
                                    }}
                                defaultValue={1}
                                value={this.state.currentPage}
                            />
                        </Col>
                    </Row>
                    <Row className={'questionBlock'}>
                        <Col className={'centered'} lg={{span:12,offset:6}} md={{span:16,offset:4}} sm={24} xs={24}>
                            <h2>Question </h2>
                        </Col>
                    </Row>
                    <Row >
                        <Col className={'cardColumn'} onClick={this.handleSelect} xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Row className={'centered'} >
                                <Col lg={24}><img className={'cardCover'} alt="example" src={img}/></Col>
                                <Col lg={24} style={{fontSize:'20px'}}>Europe Street beat</Col>
                            </Row>
                        </Col>
                        <Col className={'cardColumn'} onClick={this.handleSelect} xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Row  className={'centered'} >
                                <Col lg={24}><img className={'cardCover'} alt="example" src={img}/></Col>
                                <Col lg={24} style={{fontSize:'20px'}} >Europe Street beat</Col>
                            </Row></Col>

                        <Col className={'cardColumn'} onClick={this.handleSelect} xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Row  className={'centered'} >
                                <Col lg={24}><img className={'cardCover'} alt="example" src={img}/></Col>
                                <Col lg={24} style={{fontSize:'20px'}} >Europe Street beat</Col>
                            </Row> </Col>
                        <Col className={'cardColumn'} onClick={this.handleSelect} xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Row  className={'centered'} >
                                <Col lg={24}><img className={'cardCover'} alt="example" src={img}/></Col>
                                <Col lg={24} style={{fontSize:'20px'}} >Europe Street beat</Col>
                            </Row>
                        </Col>
                    </Row>
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
)(withRouter(Quiz));
