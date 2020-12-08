import React,{Component} from "react";
import {Avatar, Comment} from "antd";
import { UserOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import './PopoverUser.sass'
import {Link} from "react-router-dom";
import Preloader from "../../Preloader";


class PopoverUser extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        console.log('popoverList: ', this.props.usersList)
        return (
            <div className='usersListPopover'>
                {!this.props.likeLoading?
                this.props.usersList.map(u=>{
                    return <Comment
                        key={u.id}
                        content={u.username}
                        avatar={
                            <Avatar
                                src={process.env.REACT_APP_API_ENDPOINT + u.imageURL}
                                alt="Han Solo"
                            />
                        }/>
                })
                    :<Preloader/>
                }
            </div>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({

    })
)(PopoverUser);
