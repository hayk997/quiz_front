import React, {Component} from "react";
import {Col, Row, Card, Avatar, Typography, Button} from "antd";
import {
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
    EyeOutlined
} from "@ant-design/icons";
import {connect} from 'react-redux'
import axios from "axios";
import api from "../../api";
import {NavLink} from "react-router-dom";

const {Meta} = Card;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Card
                cover={
                    <img
                        alt="example"
                        src={process.env.REACT_APP_API_ENDPOINT + this.props.question.imageURL}
                    />
                }
                actions={[
                    <EyeOutlined/>,
                    <EditOutlined key="edit"/>,
                    <EllipsisOutlined key="ellipsis"/>,
                ]}
            >
                <Card.Meta
                    title={<NavLink
                        to={this.props.link + this.props.question.id}>{this.props.question.title}</NavLink>}
                />
            </Card>

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
