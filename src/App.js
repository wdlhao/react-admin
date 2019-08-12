/**
 * 
 路由嵌入文件入口及页面整体布局入口：
   1.import Routes from './routes';
   疑问：是否需要每次点击路由时，都需要去重新加载路由组件？是否会影响页面性能？最好的解决方法是什么？
 
   2.export default connectAlita(['auth', 'responsive'])(App);
    通过redux-alita所提供的组件间数据共享工具
    import {AlitaProvider, connectAlita,setConfig } from "redux-alita";

   3.antd中Layout组件通过flex布局,实现了页面自适应，导入使用即可。
     import { Layout } from "antd";
     const { Header,Footer,Sider,Content } from "Layout";

    4.Routes auth={auth} />，路由页面渲染入口
     理解：用户登录之后，通过Page.js中path="/app"已经将路由信息加载完成；定位到其他页面时，直接显示路由视图。

 * 
 * 
 */
import React, { Component } from 'react';
import Routes from './routes';
import DocumentTitle from 'react-document-title';
import SiderCustom from './components/SiderCustom'; // 左侧菜单组件
import HeaderCustom from './components/HeaderCustom';// 顶部菜单组件
import { Layout, notification, Icon } from 'antd';
import { ThemePicker } from './components/widget';// 主题颜色选择组件
import { connectAlita } from 'redux-alita'; // 作者自己封装的react-redux数据管理工具
// 
const { Content, Footer } = Layout;

class App extends Component {
    state = {
        collapsed: false,
        title: ''
    };
    componentWillMount() {
        const { setAlitaState } = this.props;
        const user = JSON.parse(localStorage.getItem('user'));
        user && setAlitaState({ stateName: 'auth', data: user }); // 从localStorage中拿到用户信息并给auth赋值；
        this.getClientWidth();
        window.onresize = () => {
            console.log('屏幕变化了');
            this.getClientWidth();
        }
    }
    componentDidMount() {
        const openNotification = () => {
            notification.open({
              message: '博主-yezihaohao',
              description: (
                  <div>
                      <p>
                          GitHub地址： <a href="https://github.com/yezihaohao" target="_blank" rel="noopener noreferrer">https://github.com/yezihaohao</a>
                      </p>
                      <p>
                          博客地址： <a href="https://yezihaohao.github.io/" target="_blank" rel="noopener noreferrer">https://yezihaohao.github.io/</a>
                      </p>
                  </div>
              ),
              icon: <Icon type="smile-circle" style={{ color: 'red' }} />,
              duration: 0,
            });
            localStorage.setItem('isFirst', JSON.stringify(true));
        };
        const isFirst = JSON.parse(localStorage.getItem('isFirst'));
        !isFirst && openNotification();
    }
    getClientWidth = () => { // 获取当前浏览器宽度并设置responsive管理响应式
        const { setAlitaState } = this.props;
        const clientWidth = window.innerWidth;
        setAlitaState({ stateName: 'responsive', data: { isMobile: clientWidth <= 992 } });
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        const { title } = this.state;
        const { auth = { data: {} }, responsive = { data: {} } } = this.props;
        console.log(auth); 
        console.log(responsive);
        console.log("是否每次点击路由，都会进行页面组件的整体渲染：  ");
        return (
            <DocumentTitle title={title}>
                <Layout>
                    {!responsive.data.isMobile && <SiderCustom collapsed={this.state.collapsed} />}
                    <ThemePicker />
                    <Layout style={{flexDirection: 'column'}}>
                        <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}} />
                        <Content style={{ margin: '0 16px', overflow: 'initial', flex: '1 1 0' }}>
                            <Routes auth={auth} />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                        React-Admin ©{new Date().getFullYear()} Created by 865470087@qq.com
                        </Footer>
                    </Layout>
                </Layout>
            </DocumentTitle>
        );
    }
}

export default connectAlita(['auth', 'responsive'])(App);// 实现数据共享，相当于react-redux的connect()
