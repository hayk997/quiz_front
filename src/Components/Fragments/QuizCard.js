import React, {Component} from "react";
import {Card} from "antd";
import {

    EditOutlined,
    EllipsisOutlined,
    EyeOutlined
} from "@ant-design/icons";
import {connect} from 'react-redux'

import {NavLink} from "react-router-dom";


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <NavLink
                to={this.props.link + this.props.question.id}> <Card
                cover={
                    <img
                        alt="example"
                        src={process.env.REACT_APP_API_ENDPOINT + this.props.question.imageURL}
                    />
                }
            >
                <Card.Meta
                    title={this.props.question.title}
                />
            </Card>
            </NavLink>

        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({
        onUpdate: (data) => {
            dispatch({
                type: "UPDATE",
                payload: data
            })
        },
    })
)(Profile);
