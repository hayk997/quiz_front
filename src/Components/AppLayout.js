import  React,{Component} from "react";
import { Layout} from "antd";
import {connect} from 'react-redux'
import HeaderComp from "./Header/HeaderComp";
import SiderComp from "./Sider/SiderComp";
const { Content} = Layout;

class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Layout style={{minHeight:'720px'}}>
                <HeaderComp/>
                <Layout>
                    <SiderComp/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({
        state
    }),
    () => ({

    })
)(AppLayout);
