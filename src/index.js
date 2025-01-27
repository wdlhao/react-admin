/**
  1.入口文件：
    1.serviceWorker是什么？为什么需要它？
    2.redux-alitas是什么？为什么需要它？
    redux-alitas是作者自己封装的全局数据共享工具，相当于react-redux;
    import { AlitaProvider, connectAlita,setConfig } from 'redux-alita';
    
    通过AlitaProvider包裹入口，connectAlita来连接各组件数据，从而实现多组件间数据共享;
  
  2.页面组织和渲染过程：
    1.index.js(项目入口，通过ReactDOM.render()绑定页面元素"root"并结合"redux-alita"的属性"AlitaProvider"实现状态数据的共享
    ，同时导入所有的全局样式文件
    2.Page.js(加载通用路由和其他路由)
    3.App.js(经过权限逻辑判断，加载了其他的动态路由数据。加载了整体页面布局组件。通过登录成功之后的路由定向实现
    了content内容的渲染)
 
  3.本项目中是如何使用antd的？
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],



 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Page from './Page'; // 通用路由组件
import * as apis from './axios'; // 所有的api集合
// import { AppContainer } from 'react-hot-loader';
import { AlitaProvider, setConfig } from 'redux-alita';
import './style/lib/animate.css'; //动画css,应用于BasicAnimations组件
import './style/antd/index.less';// 对antd原本样式进行修改和覆盖
import './style/index.less';// 相关组件样式(login,banner等)、共性标签样式(table,scroll,img,button,icons,modal,menu,card等)设置和修改

setConfig(apis);// setConfig：register fetch functions before fetch usage

// const render = Component => { // 增加react-hot-loader保持状态刷新操作，如果不需要可去掉并把下面注释的打开
//     ReactDOM.render(
//         <AppContainer>
//             <Provider store={store}>
//                 <Component store={store} />
//             </Provider>
//         </AppContainer>
//         ,
//         document.getElementById('root')
//     );
// };

// render(Page);

// Webpack Hot Module Replacement API
// if (module.hot) {
//     // 隐藏You cannot change <Router routes>; it will be ignored 错误提示
//     // react-hot-loader 使用在react-router 3.x上引起的提示，react-router 4.x不存在
//     // 详情可参照https://github.com/gaearon/react-hot-loader/issues/298
//     const orgError = console.error; // eslint-disable-line no-console
//     console.error = (...args) => { // eslint-disable-line no-console
//         if (args && args.length === 1 && typeof args[0] === 'string' && args[0].indexOf('You cannot change <Router routes>;') > -1) {
//             // React route changed
//         } else {
//             // Log the error as normally
//             orgError.apply(console, args);
//         }
//     };
//     module.hot.accept('./Page', () => {
//         render(Page);
//     })
// }

ReactDOM.render(
    // <AppContainer>
        <AlitaProvider>
            <Page />
        </AlitaProvider>
    // </AppContainer>
 ,
  document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();