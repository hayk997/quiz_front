import React, {Component} from "react";
import {Spin} from 'antd';



class Preloader extends Component {


    render() {
        return (
            <div style={{padding: 150, background: '#fff', minHeight: 360, margin: "0 auto", textAlign: "center"}}>
                <Spin size={"large"} tip={"Loading"}/>
            </div>

        );
    }
}

export default Preloader;
