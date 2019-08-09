/**
  CRouter组件整体渲染逻辑
  1. Object.keys(obj).map(key => {})与Object.keys(obj).forEach(key => {})区别？
     Object.keys(obj).map(key => {})：匹配满足条件的路由信息;"map"即"映射"，也就是原数组被"映射"成对应新数组。
     Object.keys(obj).forEach(key => {})：将object对象通过循环，处理其内部数据;
  
  2.props.match.params = { ...params }和<Component {...merge} />
    解释："..."为ES6解构赋值语法。
    props.match.params = { ...params }，将解构后的对象params赋值给另外一个对象;
    <Component {...merge} />：将解构后的对象merge应用于组件或者DOM时，即给组件或DOM元素传参。
   

  3.import queryString from 'query-string';
   官网地址：http://nodejs.cn/api/querystring.html#querystring_querystring_parse_str_sep_eq_options
     作用：nodejs语法，querystring.parse() 方法将 URL 查询字符串 str 解析为键值对的集合。
     语法：querystring.parse(str,separator,eq,options)
     本例演示,如：querystring.parse("?param1=1&param2=2")，结果为：{param1: "1", param2: "2"}
     思考：为什么有字符串的第一个值为"?"，也可以进行正常的转化。

     相关：querystring.stringify、querystring.escape、querystring.unescape
     querystring.stringify用于将对象转换为URL查询字符串。
   
  4.项目中扩展名".js"和".jsx"的异同：
     4.1.代码执行的结果没有差异:.js和.jsx文件被解析打包后都是es5语句，效果并不会有差异,都会被浏览器执行;
     4.2.是否需要配置语法解析工具：".jsx"语法需要在相应的打包工具中(如webpack)配置解析工具;"js"语法不需要配置;
     4.3.编辑器的解析方式不同：".jsx"语法,一般编辑器默认就用react的方式解析;".js"语法，一般编辑器会采用babel方式解析;
     4.4.适用场景不同： ".jsx"适用于包含jsx语法ui组件文件;".js"适用于接近js原生函数，如axios,router,utils等
    
 
 */
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import AllComponents from '../components'; //路由组件出口文件
import routesConfig from './config'; // 路由 path配置文件
import queryString from 'query-string';
console.log(queryString.parse('?foo=bar&abc=xyz&name=123'))
console.log(AllComponents);

export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const { auth } = this.props;
        const { permissions } = auth.data;
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    requireLogin = (component, permission) => {
        const { auth } = this.props;
        const { permissions } = auth.data; 
        // admin:["auth", "auth/testPage", "auth/authPage", "auth/authPage/edit", "auth/authPage/visit"]
        // guest:["auth", "auth/authPage", "auth/authPage/visit"]
        //console.log(permissions);
        if (process.env.NODE_ENV === 'production' && !permissions) { // 线上环境，没有登录权限,重定向到登录页面
            return <Redirect to={'/login'} />;
        }
        return permission ? this.requireAuth(permission, component) : component;
    };
    render() {
        return (
            <Switch>
                {
                    Object.keys(routesConfig).map(key =>
                        // arr[{},{}]
                        routesConfig[key].map(r => {
                            // 定义route函数,进行<route />组件相关数据的整理。
                            const route = r => {
                                const Component = AllComponents[r.component]; // 在循环的过程中，通过路由组件的匹配
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