/**
 * 路由导航主体文件：
 * 1.Redirect,push??
 * 包括通用路由，如：path="/",path="/login",path="/404" 和其他路由生成入口App组件
 * 
 * 2.项目启动时，根据path="/",是默认定位到index;
 * 
 * 
 */
import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import App from './App'; //针对path="/app",加载其他路由信息;
console.log(App)

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} />        
            <Route path="/app" component={App} />
            <Route path="/404" component={NotFound} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
        </Switch>
    </Router>
)