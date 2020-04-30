import React, { Component } from 'react';
import './index.less';
import { Descriptions, Skeleton, message, Switch, Spin, Tag, Input, Modal, Table, Button, Form, Radio } from 'antd';
import { PlusOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { observer, inject } from 'mobx-react';

const { confirm } = Modal;

const PasswordForm = ({ props }) => {
    const [form] = Form.useForm();
    const validateMessages = {
        required: '必填项!',
        string: {
            min: '密码至少6位'
        }
    };
    const { parent } = props;
    props.parent.staffFrom = form;
    return (
        <Form labelCol={{ span: 11 }} form={form} wrapperCol={{ span: 13 }} name="shopForm" validateMessages={validateMessages}>
            <Form.Item name="password" label="请输入当前登录密码" rules={[{ required: true }, { min: 6 }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item name="new_password" label="请输入新密码" rules={[{ required: true }, { min: 6 }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item name="copy_newPassword" label="请再次输入新密码" rules={[{ required: true }, { min: 6 }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 13, offset: 11 }}>
                <div className="text-right">
                    <Button type="default" onClick={() => parent.cancelPassword()}>取消</Button>
                    <Button type="primary" onClick={() => parent.confirmChangePassword()} className="ml10">确定</Button>
                </div>
            </Form.Item>
        </Form>
    );
};

@inject('appStore')
@observer
class Setting extends Component {
    constructor(props) {
        super(props);
        this.shopStore = props.appStore.shopInfo;
        this.state = {
            shopInfo: null,
            loading: false,
            inputTypeVisible: false,
            inputTypeValue: '',
            inputColorVisible: false,
            inputColorValue: '',
            inputKindVisible: false,
            inputKindValue: '',
            staffList: [],
            curStaff: {},
            showStaffModel: false,
            showRole: false,
            cloumns: [
                {
                    title: '登录账号',
                    dataIndex: 'username',
                    align: 'center'
                },
                {
                    title: '员工姓名',
                    dataIndex: 'staff_name',
                    align: 'center',
                    render: (text, record) => (
                        <div>
                            <span className="mr5">{text}</span>
                            <Button type="link" size="small" onClick={() => this.handleChangeName(record)}>
                                <EditOutlined />
                            </Button>
                        </div>
                    )
                },
                {
                    title: '角色',
                    dataIndex: 'role_name',
                    align: 'center'
                },
                {
                    title: '账号状态',
                    dataIndex: 'status',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'option',
                    render: (text, record) => (
                        <div>
                            <Button size="small" type="link" onClick={() => this.showRoleModal(record)}>修改角色，测试权限</Button>
                            <Button size="small" type="link" onClick={() => this.showRoleModal(record)}>修改密码</Button>
                        </div>
                    )
                }
            ]
        };
    }

    getShopInfo() {
        this.setState({
            shopInfo: {
                create_time: '2019-02-01',
                show_cdata: 1,
                required_from: 0,
                required_contract: 0,
                kinds: [],
                colors: [],
                types: []
            }
        });
    }

    showRoleModal(staff) {
        const { appStore } = this.props;
        const { role } = appStore;
        this.setState({ curStaff: { ...staff, role }, showRole: true });
    }

    showPasswordModal(staff) {
        this.setState({ curStaff: { ...staff }, showStaffModel: true });
    }

    getStaffList() {
        const { appStore } = this.props;
        const { role } = appStore;
        this.setState({
            staffList: [{ id: 1, key: 1, staff_name: '小哈哈', username: 'xhh', role_name: '管理员', status: '正常', role }]
        });
    }

    handleChangeSwitch(key, value) {
        const shop = this.state.shopInfo;
        const oldValue = shop[key];
        if (oldValue !== value) {
            this.setState({ shopInfo: { ...shop, [key]: value } });
        }
    }

    handleChangeName(item) {
        const staffData = { ...item };
        const handleChange = (e) => {
            const event = e || window.event;
            const target = event.target || event.srcElement;
            staffData.staff_name = target.value;
        };
        const content = (
            <div>
                <Input
                    type="text"
                    style={{ width: 200 }}
                    defaultValue={staffData.staff_name}
                    onChange={handleChange}
                />
            </div>
        );
        confirm({
            title: '更改员工名字！',
            icon: <ExclamationCircleOutlined />,
            maskClosable: true,
            content
        });
    }

    confirmChangePassword() {
        const _this = this;
        this.staffFrom.validateFields().then((values) => {
            const { password, new_password, copy_newPassword } = values;
            if (new_password !== copy_newPassword) {
                return message.error('确认密码和新密码不一致');
            }
            if (password && new_password) {
                _this.cancelPassword();
            }
        });
    }

    cancelPassword() {
        this.setState({ showStaffModel: false });
    }

    handleRemoveProp(key, item) {
        const _this = this;
        const name = item[`${key}_name`];
        const { shopInfo } = this.state;
        confirm({
            title: '删除提醒',
            content: `确认删除【${name}】?`,
            onOk() {
                _this.setState({ loading: true });
                setTimeout(() => {
                    const propsKey = `${key}s`;
                    const valueKey = `${key}_name`;
                    shopInfo[propsKey] = shopInfo[propsKey].filter((v) => v[valueKey] !== item[valueKey]);
                    _this.setState({ loading: false, shopInfo: { ...shopInfo } });
                }, 1000);
            }
        });
    }

    showInput(key) {
        if (key === 'type') {
            this.setState({ inputTypeVisible: true, inputTypeValue: '' }, () => this.typeInput.focus());
        }
        if (key === 'color') {
            this.setState({ inputColorVisible: true, inputColorValue: '' }, () => this.colorInput.focus());
        }
        if (key === 'kind') {
            this.setState({ inputKindVisible: true, inputKindValue: '' }, () => this.kindInput.focus());
        }
    }

    handleInputChange(e, key) {
        const event = e || window.event;
        const target = event.target || event.srcElement;
        const value = target.value ? target.value.trim() : '';
        if (key === 'type') this.setState({ inputTypeValue: value });
        if (key === 'color') this.setState({ inputColorValue: value });
        if (key === 'kind') this.setState({ inputKindValue: value });
    }

    handleInputBlur(key) {
        if (key === 'type') this.setState({ inputTypeVisible: false, inputTypeValue: '' });
        if (key === 'color') this.setState({ inputColorVisible: false, inputColorValue: '' });
        if (key === 'kind') this.setState({ inputKindVisible: false, inputKindValue: '' });
    }

    handleInputConfirm(key) {
        const { shopInfo, inputTypeValue, inputColorValue, inputKindValue } = this.state;
        if (key === 'type') {
            shopInfo.types.push({ type_name: inputTypeValue });
        }
        if (key === 'color') {
            shopInfo.colors.push({ color_name: inputColorValue });
        }
        if (key === 'kind') {
            shopInfo.kinds.push({ kind_name: inputKindValue });
        }
        this.setState({ shopInfo });
        this.handleInputBlur(key);
    }

    onChangeRole(e) {
        const { value } = e.target;
        const { curStaff } = this.state;
        curStaff.role = value;
        this.setState({ curStaff });
    }

    confirmChangeRole() {
        const { curStaff } = this.state;
        const { appStore } = this.props;
        appStore.changeRole(curStaff.role);
        this.setState({ showRole: false, loading: true });
        setTimeout(() => {
            message.success(curStaff.role ? '权限页有了' : '权限页没了');
            appStore.changeRole(curStaff.role);
            this.setState({ loading: false });
        }, 500);
    }

    cancelChangeRole() {
        this.setState({ showRole: false });
    }

    componentDidMount() {
        this.getShopInfo();
        this.getStaffList();
    }

    render() {
        const { shopInfo, loading,
            inputTypeVisible, inputTypeValue,
            inputColorVisible, inputColorValue,
            inputKindVisible, inputKindValue,
            curStaff, showStaffModel,
            cloumns, staffList, showRole } = this.state;
        if (!shopInfo) {
            return (
                <div>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </div>
            );
        }
        return (
            <div className="setting-content">
                <Spin spinning={loading}>
                    <h1>{shopInfo.shop_name}</h1>
                    <Descriptions title="店铺设置" bordered size="small" className="in-title">
                        <Descriptions.Item label="创建时间">{shopInfo.create_time}</Descriptions.Item>
                        <Descriptions.Item label="是否允许销售员查看【客户列表】">
                            <Switch
                                checkedChildren="是"
                                unCheckedChildren="否"
                                checked={!!shopInfo.show_cdata}
                                onChange={(checked) => this.handleChangeSwitch('show_cdata', checked ? 1 : 0)}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="【合同编号】是否必填">
                            <Switch
                                checkedChildren="是"
                                unCheckedChildren="否"
                                checked={!!shopInfo.required_contract}
                                onChange={(checked) => this.handleChangeSwitch('required_contract', checked ? 1 : 0)}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                    <Descriptions title="店铺属性" bordered size="small" column={1} className="in-title">
                        <Descriptions.Item label="类型">
                            {shopInfo.types.map((item, idx) => (
                                <span key={idx} style={{ display: 'inline-block' }}>
                                    <Tag
                                        className="prop-item"
                                        closable
                                        onClose={(e) => { e.preventDefault(); this.handleRemoveProp('type', item); }}
                                    >
                                        {item.type_name}
                                    </Tag>
                                </span>
                            ))}
                            {inputTypeVisible && (
                                <Input
                                    ref={(input) => (this.typeInput = input)}
                                    type="text"
                                    size="small"
                                    style={{ width: 88 }}
                                    value={inputTypeValue}
                                    onChange={(e) => this.handleInputChange(e, 'type')}
                                    onBlur={() => this.handleInputBlur('type')}
                                    onPressEnter={(value) => this.handleInputConfirm('type')}
                                />
                            )}
                            {!inputTypeVisible && (
                                <Tag onClick={() => this.showInput('type')} className="site-tag-plus">
                                    <PlusOutlined />
                                    {' '}
                                    添加类型
                                </Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="颜色">
                            {shopInfo.colors.map((item, idx) => (
                                <span key={idx} style={{ display: 'inline-block' }}>
                                    <Tag
                                        className="prop-item"
                                        closable
                                        onClose={(e) => { e.preventDefault(); this.handleRemoveProp('color', item); }}
                                    >
                                        {item.color_name}
                                    </Tag>
                                </span>
                            ))}
                            {inputColorVisible && (
                                <Input
                                    ref={(input) => (this.colorInput = input)}
                                    type="text"
                                    size="small"
                                    style={{ width: 88 }}
                                    value={inputColorValue}
                                    onChange={(e) => this.handleInputChange(e, 'color')}
                                    onBlur={() => this.handleInputBlur('color')}
                                    onPressEnter={(value) => this.handleInputConfirm('color')}
                                />
                            )}
                            {!inputColorVisible && (
                                <Tag onClick={() => this.showInput('color')} className="site-tag-plus">
                                    <PlusOutlined />
                                    {' '}
                                    添加颜色
                                </Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="款式">
                            {shopInfo.kinds.map((item, idx) => (
                                <span key={idx} style={{ display: 'inline-block' }}>
                                    <Tag
                                        className="prop-item"
                                        closable
                                        onClose={(e) => { e.preventDefault(); this.handleRemoveProp('kind', item); }}
                                    >
                                        {item.kind_name}
                                    </Tag>
                                </span>
                            ))}
                            {inputKindVisible && (
                                <Input
                                    ref={(input) => (this.kindInput = input)}
                                    type="text"
                                    size="small"
                                    style={{ width: 88 }}
                                    value={inputKindValue}
                                    onChange={(e) => this.handleInputChange(e, 'kind')}
                                    onBlur={() => this.handleInputBlur('kind')}
                                    onPressEnter={(value) => this.handleInputConfirm('kind')}
                                />
                            )}
                            {!inputKindVisible && (
                                <Tag onClick={() => this.showInput('kind')} className="site-tag-plus">
                                    <PlusOutlined />
                                    {' '}
                                    添加款式
                                </Tag>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                    <div className="title">员工管理</div>
                    <Table columns={cloumns} dataSource={staffList} bordered size="small" className="mt10" pagination={false} />
                </Spin>

                <Modal
                    footer={false}
                    visible={showStaffModel}
                    width={600}
                    destroyOnClose
                    closable={false}
                    maskClosable
                    title={`修改【${curStaff.staff_name}】登录密码`}
                >
                    <PasswordForm props={{ parent: this }} />
                </Modal>
                <Modal
                    title={`修改【${curStaff.staff_name}】角色`}
                    visible={showRole}
                    destroyOnClose
                    closable={false}
                    maskClosable
                    onOk={() => this.confirmChangeRole()}
                    onCancel={() => this.cancelChangeRole()}
                >
                    <Radio.Group onChange={(e) => this.onChangeRole(e)} value={curStaff.role}>
                        <Radio value={0}>普工</Radio>
                        <Radio value={1}>管理员</Radio>
                    </Radio.Group>
                </Modal>
            </div>
        );
    }
}
export default Setting;
