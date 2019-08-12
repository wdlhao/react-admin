/**
 * Created by hao.cheng on 2017/4/13.
  左侧路由渲染逻辑：
  依托于路由config配置文件，进行路由dom渲染;


  1.withRouter:适用于编程式导航。当组件渲染时，withRouter 会将更新后的 match、location 和 history 传递给它。
  2.static setMenuOpen = props => {}:
 
 
 
 
 
 
  */
import React, { Component } from 'react';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import routes from '../routes/config';// obj
import SiderMenu from './SiderMenu';

console.log(routes);// {menu:[]}
const { Sider } = Layout;

class SiderCustom extends Component {
    static getDerivedStateFromProps (props, state) {
        if (props.collapsed !== state.collapsed) {
            const state1 = SiderCustom.setMenuOpen(props);
            const state2 = SiderCustom.onCollapse(props.collapsed);
            return {
                ...state1,
                ...state2,
                firstHide: state.collapsed !== props.collapsed && props.collapsed, // 两个不等时赋值props属性值否则为false
                openKey: state.openKey || (!props.collapsed && state1.openKey)
            }
        }
        return null;
    }
    static setMenuOpen = props => {
        const { pathname } = props.location;
        return {
            openKey: pathname.substr(0, pathname.lastIndexOf('/')),
            selectedKey: pathname
        };
    };
    static onCollapse = (collapsed) => {
        return {
            collapsed,
            // firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        };
    };
    state = {
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
    };
    componentDidMount() {
        // this.setMenuOpen(this.props);
        const state = SiderCustom.setMenuOpen(this.props);
        this.setState(state);
    }
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        const { popoverHide } = this.props; // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    render() {
        const { selectedKey, openKey, firstHide, collapsed } = this.state;
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={collapsed}
                style={{ overflowY: 'auto' }}
            >
                <div className="logo" />
                {/**
                  SiderMenu属性分析：
                  1.menus:为传入组件内部的参数,arr形式;
                  2.mode：表示菜单排列方向，值分别为"inline/horizontal",表示该菜单排列分布或者横向排列;
                  3.selectedKeys:如SelectedKeys={['1']}，表示默认选中的菜单项;
                  4.openKeys:如，OpenKeys={['sub1']}，表示默认打开的菜单项;
                  5.onOpenChange:SubMenu 展开/关闭的回调 function(openKeys: string[])
                  6.onClick:点击 MenuItem 调用此函数 function({ item, key, keyPath, domEvent })
                */}
                <SiderMenu
                    menus={routes.menus}
                    onClick={this.menuClick}
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}
                />
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default withRouter(SiderCustom);