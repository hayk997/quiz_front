import React, {Component} from "react";
import {connect} from 'react-redux'
import './Statistics.sass'
import {
    EyeFilled,DislikeFilled,
    FormOutlined,LikeFilled,
} from "@ant-design/icons";
import {Badge, Card, Typography} from "antd";
import {MailOutlined} from "@ant-design/icons";


class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            user: {},
        }
    }
    render() {
        return (
            <div className={'statisticsMain'}>
                <Card className={'statisticCol likes'}>
                    <Badge count={this.props.newData?.likes}><LikeFilled/></Badge>
                    <Typography.Title level={2}>{this.props.likes??0}</Typography.Title>
                </Card>
                <Card className={'statisticCol dislikes'}>
                    <Badge count={this.props.newData?.disLikes}><DislikeFilled/></Badge>
                    <Typography.Title level={2}>{this.props.disLikes??0}</Typography.Title>
                </Card>
                <Card className={'statisticCol views'}>
                    <EyeFilled/>
                    <Typography.Title level={2}>{this.props.views??0}</Typography.Title>
                </Card>
                <Card className={'statisticCol posts-got'}>
                    <Badge count={this.props.newData?.gotPosts}><MailOutlined /></Badge>
                    <Typography.Title level={2}>{this.props.gotPosts??0}</Typography.Title>
                </Card>
                <Card className={'statisticCol posts'}>
                    <FormOutlined />
                    <Typography.Title level={2}>{this.props.sentPosts??0}</Typography.Title>
                </Card>
            </div>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({})
)(Statistics);
