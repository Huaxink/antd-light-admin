import React, { Component } from 'react';
import { Layout, Menu, Spin, Dropdown, Button, Modal } from 'antd';
import { SettingOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './index.less';
import { observer, inject } from 'mobx-react';
import { renderRoutes, routeConfig } from '../router/router';
import Login from '../pages/Login';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

@inject('appStore')
@observer
class BasicLayout extends Component {
    state = {
        logoutVisible: false
    }

    toggle = () => {
        const { appStore } = this.props;
        const sider = appStore.sider - 0 === 1 ? 0 : 1;
        appStore.changeSider(sider);
    };

    shopSetting = () => {
        this.props.history.push('/setting');
    }

    handleLogout = () => {
        this.setState({ logoutVisible: true });
    }

    hideModal() {
        this.setState({ logoutVisible: false });
    }

    confirmLogout() {
        const { appStore } = this.props;
        setTimeout(async () => {
            this.hideModal();
            await appStore.changeToken('');
        }, 1000);
    }

    goHome = () => {
        this.props.history.replace('/');
    }

    componentDidMount() {
        const { appStore } = this.props;
        appStore.changeShopName('爱斯基摩');
        appStore.changeName('小哈哈');
    }

    render() {
        const { appStore } = this.props;
        const { logoutVisible } = this.state;
        const { routes } = routeConfig;
        if (!routes) {
            return <Spin size="large" />;
        }
        // 用户角色，和权限路由挂钩 侧边栏展开收起
        const { role, sider, name, shopName, token } = appStore;
        const realRole = role - 0;
        const _sider = sider - 0;

        if (!token) {
            return <Login {...this.props} />;
        }

        // 侧边栏列表
        const menus = routes.filter((v) => v.extraProps && !v.extraProps.hide && (!v.auth || v.auth.includes(realRole)));

        // 匹配当前路由，高亮侧边栏项目
        const location = this.props.location.pathname;
        const key = menus.findIndex((v) => v.path === location);

        const menu = (
            <Menu>
                <Menu.Item onClick={() => this.shopSetting()}>
                    <div className="pl-6 pr-6">
                        <SettingOutlined />
                        {' '}
                        <span className="ml5">店铺设置</span>
                    </div>
                </Menu.Item>
                <Menu.Item onClick={() => this.handleLogout()} style={{ borderTop: '1px solid #eee' }}>
                    <div className="pl-6 pr-6">
                        <LogoutOutlined />
                        {' '}
                        <span className="ml5">退出登录</span>
                    </div>
                </Menu.Item>
            </Menu>
        );

        return (
            <Layout className="basic-layout">
                <Sider trigger={null} collapsible collapsed={_sider === 1} width={180}>
                    <div className="logo" onClick={this.goHome}>
                        <img className="logo-img" src={`${window.PUBLIC_PATH}logo.png`} alt="xxx" />
                        {_sider !== 1 && <h1 className="title">Ant Design</h1>}
                    </div>
                    <Menu theme="dark" mode="inline" selectedKeys={[`${key}`]}>
                        {
                            menus && menus.map((item, index) => {
                                const itemNav = (
                                    <Menu.Item key={`${index}`}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            {' '}
                                            <span>{item.extraProps.title}</span>
                                        </Link>
                                    </Menu.Item>
                                );

                                const subNav = (
                                    <SubMenu
                                        key={index}
                                        title={(
                                            <span>
                                                {item.icon}
                                                <span>{item.extraProps.title}</span>
                                            </span>
                                        )}
                                    >
                                        {item.routes && item.routes.map((subItem, idx) => (
                                            <Menu.Item key={`${index}_${idx}`}>
                                                <Link to={subItem.path}>{subItem.title}</Link>
                                            </Menu.Item>
                                        ))}
                                    </SubMenu>
                                );

                                if (item.routes && item.routes.length > 0) {
                                    return subNav;
                                }
                                return itemNav;
                            })
                        }
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background site-header" style={{ padding: 0 }}>
                        {React.createElement(_sider === 1 ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: this.toggle
                        })}
                        <div className="user-box">
                            <div className="user-info">
                                <Dropdown overlay={menu} placement="bottomRight">
                                    <Button type="link" style={{ height: '100%' }}>
                                        <span>{shopName}</span>
                                        <span style={{ marginLeft: '10px' }}>·</span>
                                        <span style={{ marginLeft: '10px' }}>{name}</span>
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                    </Header>
                    <Content className="site-layout-background site-content">
                        {routes && renderRoutes(routes, realRole, routeConfig.multipleRoutes)}
                    </Content>
                    <Footer style={{ textAlign: 'center', padding: '0 50px 8px' }}>
                        Antd ©2019
                    </Footer>
                </Layout>

                <Modal
                    title="退出登录"
                    visible={logoutVisible}
                    onOk={() => this.confirmLogout()}
                    onCancel={() => this.hideModal()}
                    okText="退出"
                    cancelText="取消"
                >
                    <p>确定退出登录？</p>
                </Modal>
            </Layout>
        );
    }
}

export default BasicLayout;
