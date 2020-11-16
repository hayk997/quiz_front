import React from "react";
import { Result, Button } from 'antd';
import {withRouter} from "react-router-dom";

class Page404 extends React.Component{
    constructor(props) {
        super(props);
    }
    handleHome(){
        this.props.history.push('/')
    }
    render() {
        return <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={()=>this.handleHome()}>Back Home</Button>}
            />
    }
}

export default withRouter(Page404)