import React, {Component} from 'react';
import {Link} from 'react-router';
import logo from '../images/logo.png';
import axios from 'axios';
import {
    Icon,
    Tabs,
    Form,
    Modal,
    Button,
    Input,
    message,
} from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
class MobileHeader extends Component {
    state = {
        username: null,
        modalShow: false
    }



    setModalShow (isShow) {
        this.setState({modalShow: isShow});
    }

    handleSubmit = (isRigister, event) => {
        event.preventDefault();

            // 注册
            const {username, password, r_userName, r_password, r_confirmPassword} = this.props.form.getFieldsValue()
            const action = isRigister ? 'register' : 'login'
            let url = `http://newsapi.gugujiankong.com/Handler.ashx?action=${action}`;
            if(isRigister) {
                // 注册
                url +=  `&r_userName=${r_userName}&r_password=${r_password}&r_confirmPassword=${r_confirmPassword}`;
            } else {
                // 登录
                url +=  `&username=${username}&password=${password}`;
                // 发送ajax请求
            }

            axios.get(url)
                .then(response => {
                    this.props.form.resetFields();
                    const result = response.data;
                    console.log(result);
                    if(isRigister) {
                        if(result === true) {
                            message.success('注册成功');
                        } else {
                            message.error('注册失败');
                        }
                    } else {
                        if(result) {
                            const userId = result.UserId;
                            const username = result.NickUserName;
                            message.success('登录成功');
                            // 更新状态
                            this.setState({username});
                            localStorage.setItem('userId', userId);
                            localStorage.setItem('username', username);
                        } else {
                            message.error('登录失败');
                        }
                    }

                    this.setState({modalShow: false});
                });

    }

    render () {
        const {username, modalShow} = this.state;
        const userItem = !username
            ? <Icon type="setting" onClick={this.setModalShow.bind(this, true)}></Icon>
            : <Link to="/userCenter">
                <Icon type="inbox"></Icon>
            </Link>;
        const {getFieldDecorator} = this.props.form;
        return (
            <div id="mobileheader">
                <header>
                    <div>
                        <Link to="/">
                            <img src={logo} />
                            <span>ReactNews2</span>
                        </Link>
                        {userItem}
                    </div>
                </header>
                <Modal title="用户中心"
                       visible={modalShow}
                       onOk={this.setModalShow.bind(this, false)}
                       onCancel={this.setModalShow.bind(this, false)}
                       okText='关闭'>
                    <Tabs type="card">
                        <TabPane tab="登陆" key="1">
                            <Form onSubmit={this.handleSubmit.bind(this, false)}>
                                <FormItem label='账户'>
                                    {
                                        getFieldDecorator('username')(
                                            <Input placeholder="请输入账号"/>
                                        )
                                    }
                                </FormItem>
                                <FormItem label='密码'>
                                    {
                                        getFieldDecorator('password')(
                                            <Input type='password' placeholder="请输入密码"/>
                                        )
                                    }
                                </FormItem>
                                <Button type='primary' htmlType="submit">登陆</Button>
                            </Form>
                        </TabPane>
                        <TabPane tab="注册" key="2">
                            <Form onSubmit={this.handleSubmit.bind(this, true)}>
                                <FormItem label='账户'>
                                    {
                                        getFieldDecorator('r_userName')(
                                            <Input placeholder="请输入账号"/>
                                        )
                                    }
                                </FormItem>
                                <FormItem label='密码'>
                                    {
                                        getFieldDecorator('r_password')(
                                            <Input type='password' placeholder="请输入密码"/>
                                        )
                                    }
                                </FormItem>
                                <FormItem label='确认密码'>
                                    {
                                        getFieldDecorator('r_confirmPassword')(
                                            <Input type='password' placeholder="请输入确认密码"/>
                                        )
                                    }
                                </FormItem>
                                <Button type='primary' htmlType="submit">注册</Button>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(MobileHeader);