import React, {Component} from "react"
import {Col, Layout, Menu, Row, Drawer, Typography, Card} from "antd"
import {connect} from 'react-redux'
import {NavLink, withRouter} from "react-router-dom"
import {
    EditOutlined,
    EllipsisOutlined,
    LaptopOutlined,
    NotificationOutlined,
    SettingOutlined,
    UserOutlined
} from "@ant-design/icons"
import MenuOutlined from "@ant-design/icons/lib/icons/MenuOutlined"
import logo from '../../dist/images/mainLogo.png'
import axios from "axios";
import api from "../../api";



class Quizes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            questions:{}
        }
    }
    componentDidMount() {
        axios.request({
            url:api.question.list.url,//for pagination add ?page=2
            method:api.question.list.method
        }).then(response=>{
            console.log(response.data)
            this.setState({
                questions:response.data
            })
        })
    }

    render() {
        return (
          <Row>
              <Col lg={24}>
                  <Typography.Title level={4}>Tests</Typography.Title><Row>
                      {this.state.questions.data && this.state.questions.data.length?
                          this.state.questions.data.map((question,key)=><Col  key={key} lg={4}> <Card
                              style={{width: 300}}

                              cover={
                                  <img
                                      alt="example"
                                      src={process.env.REACT_APP_API_ENDPOINT+question.imageURL}
                                  />
                              }
                              actions={[
                                  <SettingOutlined key="setting" />,
                                  <EditOutlined key="edit" />,
                                  <EllipsisOutlined key="ellipsis" />,
                              ]}
                          >
                              <Card.Meta
                                  title={question.title}
                              />
                          </Card>
                          </Col>):null
                      }
                  </Row>
              </Col>

          </Row>

        )
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({
        onLogout: () => {
            dispatch({
                type: "LOGOUT",
            })
        },
    })
)(withRouter(Quizes));
