import React, {Component} from "react"
import  {Slider,Col, Row, Card} from "antd"
import {connect} from 'react-redux'
import './styles.sass'
import img from '../../dist/images/a.jpg'

const {Meta} = Card

class Psy extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.handleSelect=this.handleSelect.bind(this)
    }
    handleSelect(e){
        console.log(e.target.textContent)
    }
    render() {
        return (
            <Row >
                <Col lg={{span:14,offset:5}}>
                <Row >

                    <Col lg={{span:12,offset:6}} md={{span:16,offset:4}} sm={24} xs={24}>
                        <Slider
                            min={1}
                            max={10}
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
                            value={3}
                        />
                    </Col>
                </Row>
                <Row className={'questionBlock'}>
                    <Col className={'centered'} lg={{span:12,offset:6}} md={{span:16,offset:4}} sm={24} xs={24}>
                        <h2>Question </h2>
                    </Col>
                </Row>
                <Row >
                    <Col className={'cardColumn'}  xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Row  className={'centered'} >
                            <Col lg={24}><img className={'cardCover'} alt="example" src={img}/></Col>
                            <Col lg={24} style={{fontSize:'20px'}}>Europe Street beat</Col>
                        </Row>
                        </Col>

                    <Col className={'cardColumn'}  xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Row  className={'centered'} >
                            <Col lg={24}><img className={'cardCover'} alt="example" src={img}/></Col>
                            <Col lg={24} style={{fontSize:'20px'}} >Europe Street beat</Col>
                        </Row></Col>

                    <Col className={'cardColumn'} xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Row  className={'centered'} >
                            <Col lg={24}><img className={'cardCover'} alt="example" src={img}/></Col>
                            <Col lg={24} style={{fontSize:'20px'}} >Europe Street beat</Col>
                        </Row> </Col>
                    <Col className={'cardColumn'} xs={12} sm={12} md={12} lg={12} xl={12}>
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

export default connect(state => ({
        state
    }), dispatch => ({})
)(Psy)