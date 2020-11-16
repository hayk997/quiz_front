import React from "react";
import './styles.sass'
import { Typography } from 'antd';
import {withRouter} from "react-router-dom";

const { Title } = Typography;

class SuccessComponent extends React.Component{
    constructor(props) {
        super(props)
    }
    handleToProfile(){
        this.props.history.push('/stats/'+this.props.match.params.id)
    }
    render() {
        return <>
        <div id="container">
            <div id="success-box">
                <div className="face">
                    <div className="eye"> </div>
                    <div className="eye right"> </div>
                    <div className="mouth happy"> </div>
                </div>
                <div className="shadow scale"> </div>
                <div className="message"><h1 className="alert">Success!</h1><Title style={{color:"white"}}>You scored {this.props.points} points!</Title></div>
                <button onClick={()=>this.handleToProfile()} className="button-box"><h1 className="green">continue</h1></button>
            </div>
        </div>
            </>
    }
}


export default withRouter(SuccessComponent);
