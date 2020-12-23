import React, {Component} from "react";
import {connect} from 'react-redux'
import './Statistics.sass'
import DislikeFilled from "@ant-design/icons/lib/icons/DislikeFilled";
import LikeFilled from "@ant-design/icons/lib/icons/LikeFilled";
import CalendarFilled from "@ant-design/icons/lib/icons/CalendarFilled";
import EyeFilled from "@ant-design/icons/lib/icons/EyeFilled";


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
                <div className={'statisticCol'}>
                    <LikeFilled/>
                    <p>{this.props.state.auth.user.likes} Лайков</p>
                </div>
                <div className={'statisticCol'}>
                    <DislikeFilled/>
                    <p>{this.props.state.auth.user.disLikes} Дислайков</p>
                </div>
                <div className={'statisticCol'}>
                    <EyeFilled/>
                    <p>{this.props.state.auth.user.views} Просмотров</p>
                </div>
                <div className={'statisticCol'}>
                    <CalendarFilled/>
                    <p>{this.props.state.auth.user.posts || 10} Постов</p>
                </div>
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
