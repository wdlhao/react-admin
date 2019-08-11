/**
 * CRouter组件整体渲染逻辑
 * 1. Object.keys(obj).map(key => {})与Object.keys(obj).forEach(key => {})区别？
 *    Object.keys(obj).map(key => {})：匹配满足条件的路由信息;"map"即"映射"，也就是原数组被"映射"成对应新数组。
 *    Object.keys(obj).forEach(key => {})：将object对象通过循环，处理其内部数据;
 * 
 * 2.props.match.params = { ...params }和<Component {...merge} />
 *   解释："..."为ES6扩展运算符语法。
 *   props.match.params = { ...params }，将扩展后的对象params赋值给另外一个对象;
 *   <Component {...merge} />：将扩展后的对象merge应用于组件或者DOM时，即给组件或DOM元素传参。
 *  

 * 3.import queryString from 'query-string';
 *   官网地址：http://nodejs.cn/api/querystring.html#querystring_querystring_parse_str_sep_eq_options
     作用：nodejs语法，querystring.parse() 方法将 URL 查询字符串 str 解析为键值对的集合。
     语法：querystring.parse(str,separator,eq,options)
     本例演示,如：querystring.parse("?param1=1&param2=2")，结果为：{param1: "1", param2: "2"}
     思考：为什么有字符串的第一个值为"?"，也可以进行正常的转化。

     相关：querystring.stringify、querystring.escape、querystring.unescape
     querystring.stringify用于将对象转换为URL查询字符串。

  4.<Route render={(props) => {return {}} />
    只有当路径匹配的时候会被调用,写成内联形式主要是便于渲染页面和传递参数。

    
 * 
 */
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import AllComponents from '../components'; //路由组件出口文件;学习组件的组织思路;
import routesConfig from './config'; // 路由 path配置文件
import queryString from 'query-string';
//console.log(queryString.parse('?foo=bar&abc=xyz&name=123'))

export default class CRouter extends Component {
    // requireAuth = (permission, component) => {
    //     const { auth } = this.props;
    //     const { permissions } = auth.data;
    //     if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
    //     return component;
    // };
    requireLogin = (component, permission) => {
        console.log(permission);// auth/testPage,点击'路由拦截'菜单
        const { auth } = this.props; // 父组件 传递过来的值
        const { permissions } = auth.data; 
        // console.log(permissions);
        // admin:["auth", "auth/authPage", "auth/authPage/visit","auth/authPage/edit","auth/testPage"]
        // guest:["auth", "auth/authPage", "auth/authPage/visit"]
        // 线上环境，没有登录权限,重定向到登录页面
        if (process.env.NODE_ENV === 'production' && !permissions) { 
            return <Redirect to={'/login'} />;
        }
        // 开发环境
        if(permission){
            if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        }else{
            return component;
        }
     };
    render() {
        return (
            <Switch>
                {
                    Object.keys(routesConfig).map(key =>
                        routesConfig[key].map(r => {
                            // 定义route函数,进行<route />组件相关数据的整理。
                            const route = r => {
                                const Component = AllComponents[r.component]; // 在循环的过程中，通过路由组件的匹配
                                //console.log(Component)
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        render={props => {
                                            const reg = /\?\S*/g;
                                            // 匹配?及其以后字符串
                                            const queryParams = window.location.hash.match(reg);//[]
                                            // 去除?的参数
                                            // props:调用组件者传递过来的默认路由属性
                                            const { params } = props.match; // query obj，为啥为空？
                                            Object.keys(params).forEach(key => {
                                                console.log( params[key]);
                                                params[key] = params[key] && params[key].replace(reg, '');
                                            });
                                            console.log({ ...params })
                                            props.match.params = { ...params };
                                            //console.log(queryString.parse(queryParams[0]));
                                            const merge = { ...props, query: queryParams ? queryString.parse(queryParams[0]) : {} };
                                            // 重新包装组件 
                                            // 给匹配到的Component传递 {...merge}参数，如何理解？
                                            console.log(Component);
                                            const wrappedComponent = (
                                                <DocumentTitle title={r.title}>
                                                    <Component {...merge} />
                                                </DocumentTitle>
                                            )
                                            // r.login ??
                                            // permission = r.auth:通过App.js中 <Routes auth={auth} /> 传递过来的属性，表示该用户是否需要进行认证。
                                           console.log(r); // 当前路由数据
                                           console.log(r.login);
                                           console.log(r.auth);
                                            return r.login
                                                ? wrappedComponent
                                                : this.requireLogin(wrappedComponent, r.auth)
                                        }}
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r));
                        })
                    )
                }
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}

console.log(CRouter);