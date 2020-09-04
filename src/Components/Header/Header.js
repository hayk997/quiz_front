import React, {Component} from "react";
import {connect} from 'react-redux'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <h1>sssssssssssssssss</h1>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(Header);
