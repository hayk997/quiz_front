import React, {Component} from "react"
import {Col, Row, Typography, Card,Pagination} from "antd"
import {connect} from 'react-redux'
import {NavLink, withRouter} from "react-router-dom"
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,

} from "@ant-design/icons"
import axios from "axios";
import api from "../../api";
import Preloader from "../Preloader";



class Quizes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            questions:{},
            loading:true
        }
    }
    componentDidMount() {
        axios.request({
            url:api.question.list.url,//for pagination add ?page=2
            method:api.question.list.method
        }).then(response=>{
            console.log(response.data)
            this.setState({
                questions:response.data,
                loading:false
            })
        })
    }
    handlePageChange = (e) =>{
        this.setState({
            loading:true
        })
        axios.request({
            url:api.question.list.url+'?page='+e,//for pagination add ?page=2
            method:api.question.list.method
        }).then(response=>{
            console.log(response.data)
            this.setState({
                questions:response.data,
                loading:false
            })
        })
    }
    render() {
        return (
          <Row>
              {this.state.loading?<Preloader/>:

              <Col lg={24}>
                  <Typography.Title level={4}>Tests</Typography.Title><Row>
                      {this.state.questions.data && this.state.questions.data.length?
                          this.state.questions.data.map((question,key)=><Col  key={key} lg={4}> <Card
                              className={'quiz_cards'}
                              cover={<img alt="example" src={process.env.REACT_APP_API_ENDPOINT+question.imageURL}/>}
                              actions={[
                                  <SettingOutlined key="setting" />,
                                  <EditOutlined key="edit" />,
                                  <EllipsisOutlined key="ellipsis" />,
                              ]}
                          >
                              <Card.Meta
                                  title={<NavLink to={'/quizes/'+question.id} >{question.title}</NavLink>}
                              />
                          </Card>
                          </Col>):null
                      }
                  </Row>
                  <Pagination onChange={this.handlePageChange} current={parseInt(this.state.questions.pagination.currentPage)} pageSize={this.state.questions.pagination.perPage} total={this.state.questions.pagination.totalItems} />
              </Col>  }

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
