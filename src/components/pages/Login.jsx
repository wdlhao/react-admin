/**
  1.用户登录成功之后，相关的处理逻辑：
    用户登录成功后，通过用户名和密码判断，然后调用setAlitaState({ funcName: 'admin', stateName: 'auth' })方法
    将数据保存在共享数据中，同时供其他页面使用。

  2.Form.create(options)
    使用方式如下：
        class CustomizedForm extends React.Component {}
        CustomizedForm = Form.create({})(CustomizedForm);
    经 Form.create() 包装过的组件会自带 this.props.form 属性

  3.学习第三方登录

  4.生命周期函数：componentDidUpdate:
   组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。

    5.const { auth: nextAuth = {}, history } = this.props 
    语法理解：形式为解构赋值并设置auth的默认值为{},再将{}赋值给nextAuth,实现auth的克隆。


 */
import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { PwaInstaller } from '../widget'; // 手动触发的安装程序
import { connectAlita } from 'redux-alita';

const FormItem = Form.Item;

class Login extends React.Component {
    componentDidMount() {
        const { setAlitaState } = this.props;
        setAlitaState({ stateName: 'auth', data: null }); // 初始化auth = null
    }
    /**
     1.用户登录成功之后，通过调用函数admin或者guest(参考setAlitaState封装的方法),从而触发组件更新，进入周期函数componentDidUpdate
     中

     */
    componentDidUpdate() { // React 16.3+弃用componentWillReceiveProps
        const { auth: nextAuth = {}, history } = this.props;
        if (nextAuth.data && nextAuth.data.uid) { // 判断是否登陆成功
            localStorage.setItem('user', JSON.stringify(nextAuth.data)); //将登录之后的用户信息保存到localStorage
            history.push('/');//登录成功后，路由定位到首页
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { setAlitaState } = this.props;
                if (values.userName === 'admin' && values.password === 'admin') setAlitaState({ funcName: 'admin', stateName: 'auth' }); // 调取接口；
                if (values.userName === 'guest' && values.password === 'guest') setAlitaState({ funcName: 'guest', stateName: 'auth' });
            }
        });
    };
    gitHub = () => {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin';
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <div className="login-form" >
                    <div className="login-logo">
                        <span>React Admin</span>
                        <PwaInstaller />
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="管理员输入admin, 游客输入guest" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <span className="login-form-forgot" href="" style={{float: 'right'}}>忘记密码</span>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span >或 现在就去注册!</span>
                                <span onClick={this.gitHub} ><Icon type="github" />(第三方登录)</span>
                            </p>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Form.create({ name: 'inline_login' })(Login));