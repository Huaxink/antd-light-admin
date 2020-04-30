import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import './index.less';

@inject('appStore')
@observer
class Auth extends Component {
    render() {
        const { appStore } = this.props;
        const { role } = appStore;
        return (
            <div className="dashboard">
                这是权限页面,当前权限值：{role}
            </div>
        );
    }
}
export default Auth;
