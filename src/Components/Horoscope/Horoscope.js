import React from "react";

import {withRouter} from "react-router-dom";
import axios from "axios";
import api from "../../api";
import {connect} from "react-redux";



class Horoscope extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            imageSrc:''
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
                imageSrc:response.data.src
            })

        })
    }

    render() {
        return<div className='successContainer' id="container">
               <img src={this.state.imageSrc}/>
            </div>
    }
}


export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(withRouter(Horoscope));
