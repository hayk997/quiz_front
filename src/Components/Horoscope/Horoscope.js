import React from "react";

import {withRouter} from "react-router-dom";
import axios from "axios";
import api from "../../api";
import {connect} from "react-redux";
import {Card, Col, Image, Row, Typography} from "antd";
import Preloader from "../Preloader";


class Horoscope extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            imageSrc:'',
            loading:true
        }
    }
    componentDidMount() {
        axios.request({
            url: api.horoscope.get.url,
            method: api.horoscope.get.method,
            headers: {
                'x-access-token': this.props.state.auth.token,
                'cache-control': 'no-cache'
            }
        }).then(response=>{
            console.log(response.data.src)
            this.setState({
                imageSrc:response.data.src,
                loading:false
            })

        })
    }



    render() {
        return<Row style={{textAlign:'center'}}  >

            {this.state.loading?<Preloader/>:  <Col lg={24}>
                <Typography.Title style={{textAlign:'center'}}  level={3}>Гороскоп на Завтра</Typography.Title>
                <Card>
                    <Image style={{textAlign:'center'}} src={this.state.imageSrc}/>
                </Card>

            </Col>}

            </Row>
    }
}


export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(withRouter(Horoscope));
