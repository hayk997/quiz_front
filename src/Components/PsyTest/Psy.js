import React, {Component} from "react"
import {Col, Row, Card} from "antd"
import {connect} from 'react-redux'
import './styles.sass'
import img from '../../dist/images/a.jpg'

const {Meta} = Card

class Psy extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Row className={'content-aligned-center'} style={{border: '1px solid gray'}}>
                <Row >
                    <Col>
                        <h2> Steps</h2>
                    </Col>
                </Row>
                <Row className={'questionBlock'}>
                    <Col>
                        <h2>Question </h2>
                    </Col>
                </Row>
                <Row className={'cardsBlock'} justify={'center'} gutter={[24, 16]}>
                    <Col className={'cardColumn'} offset={2} lg={10}>
                        <Card className={'card'}
                              hoverable
                              bodyStyle={{marginTop:-20,textAlign:'center',border:'1px solid lightgray',height:20,borderRadius: '5%'}}
                              style={{width: 250, height: 250}}
                              cover={<img className={'cardCover'} alt="example" src={img}/>}
                        >
                            <Meta title="Europe Street beat"/>
                        </Card> </Col>
                    <Col className={'cardColumn'} offset={2} lg={10}>
                        <Card className={'card'}
                              hoverable
                              bodyStyle={{marginTop:-20,textAlign:'center',border:'1px solid lightgray',height:20,borderRadius: '5%'}}
                              style={{width: 250, height: 250}}
                              cover={<img className={'cardCover'}
                                          alt="example"
                                          src={img}/>}
                        >
                            <Meta title="Europe Street beat"/>
                        </Card> </Col>

                    <Col className={'cardColumn'} offset={2} lg={10}>
                        <Card className={'card'}
                              hoverable
                              bodyStyle={{marginTop:-20,textAlign:'center',border:'1px solid lightgray',height:20,borderRadius: '5%'}}
                              style={{width: 250, height: 250}}
                              cover={<img className={'cardCover'} alt="example"
                                                                  src={img}/>}
                    >
                        <Meta title="Europe Street beat"/>
                    </Card> </Col>
                    <Col className={'cardColumn'} offset={2} lg={10}>
                        <Card className={'card'}
                              hoverable
                              bodyStyle={{marginTop:-20,textAlign:'center',border:'1px solid lightgray',height:20,borderRadius: '5%'}}
                              style={{width: 250, height: 250}}
                              cover={<img className={'cardCover'} alt="example"
                                                                  src={img}/>}
                    >
                        <Meta title="Europe Street beat"/>
                    </Card> </Col>
                </Row>
            </Row>
        )
    }
}

export default connect(state => ({
        state
    }), dispatch => ({})
)(Psy)