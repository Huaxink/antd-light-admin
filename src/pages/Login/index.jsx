import React, { useState } from 'react';
import './index.less';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default (props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const checkForm = () => {
        form.submit();
    };

    const handleLogin = (values) => {
        const { appStore } = props;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            appStore.changeRole(1);
            appStore.changeName('小哈哈');
            appStore.changeToken('123456');
        }, 1000);
    };

    return (
        <div className="userlayout">
            <div className="container">
                <div className="top">
                    <div className="header">
                        <img className="logo" src={`${window.PUBLIC_PATH}logo.png`} alt="logo" />
                        <span className="title">Antd4 管理</span>
                    </div>
                    <div className="desc">Antd4 管理系统，轻量化，mobx状态管理</div>
                </div>
                <div className="main">
                    <Form form={form} name="loginFrom" onFinish={handleLogin}>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入登录账号!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="随便输" size="large" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="随便输"
                                onPressEnter={checkForm}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" className="login-form-button" size="large" onClick={checkForm} loading={loading}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className="footer-msg">
                <a href="http://www.beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">蜀ICP备xxxxxxxx号-1</a>
            </div>
        </div>
    );
};
