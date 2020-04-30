import React from 'react';
import { HomeOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import DressDetail from '@/pages/DressDetail';
import loadable from '@/utils/loadable';
import NotFound from '@/components/NotFound';

export const routeConfig = {
    routes: [
        {
            path: '/dashboard', exact: true, icon: <HomeOutlined style={{ marginRight: '18px' }} />, component: Dashboard, extraProps: { title: '工作台' }
        },
        {
            path: '/auth', auth: [1], exact: true, icon: <FileSearchOutlined style={{ marginRight: '18px' }} />, component: loadable(() => import(/* webpackChunkName: "auth" */'@/pages/Auth')), extraProps: { title: '权限页' }
        },
        {
            path: '/setting', exact: true, component: loadable(() => import(/* webpackChunkName: "addDress" */'@/pages/Setting')), extraProps: { hide: true }
        },
        { path: '/detail/:number', exact: true, component: DressDetail },
        { url: '/dashboard', redirect: true, extraProps: { hide: true } }
    ]
};

/**
 * 将路由配置渲染成节点
 * @param routes switch路由列表
 * @param authed 当前账号权限
 * @param multipleRoutes 非switch路由列表，将会在Switch节点前渲染Route
 * @param extraProps 添加额外的Route props
 * @param switchProps Switch props
 */
export const renderRoutes = (
    routes = [],
    authed,
    multipleRoutes,
    extraProps = {},
    switchProps = {}
) => {
    const list = [];
    const mapFunc = (R = []) => R.map((route, i) => (
        route.redirect ? <Redirect to={route.url} key={route.key || i} />
            : (
                <Route
                    key={route.key || i}
                    path={route.path}
                    exact={route.exact}
                    strict={route.strict}
                    render={(props) => {
                        // 将authed赋值到route，试子组件可以通过route.authed获取当前用户权限
                        if (authed !== undefined) route.authed = authed;
                        // 不存在authed或者authed大于当前路由权限，即可渲染组件，否则跳默认页面
                        if (!route.auth || route.auth.includes(authed - 0)) {
                            return route.render
                                ? route.render({ ...props, ...extraProps, route })
                                : route.component && (
                                    <route.component {...props} {...extraProps} route={route} />
                                );
                        }
                        return <NotFound {...props} {...extraProps} route={route} />;
                    }}
                />
            )
    ));
    if (routes) {
        list.push(
            <Switch {...switchProps} key="blblbl">
                {mapFunc(routes)}
            </Switch>
        );
        // 将非Switch包裹的Route挂载到Switch节点之前
        multipleRoutes && list.unshift(...mapFunc(multipleRoutes));
        // 返回一个数组，比如 [<Route/>,...,<Route/>,<Switch>...</Switch>]
        return list;
    }
};
