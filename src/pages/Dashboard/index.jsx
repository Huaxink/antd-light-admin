import React, { Component } from 'react';
import { DatePicker, Button, Upload, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Qrcode from '@/components/Qrcode';
import { formatImgs } from '@/utils/utils';
import './index.less';

const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const imgType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

export default class Dashboard extends Component {
    state = {
        range: [],
        imgLoading: false,
        upImgs: []
    }

    changeRange = (dates, datestrings) => {
        this.setState({
            range: dates
        });
    }

    gotoDetial(id) {
        this.props.history.replace(`/detail/${id}`);
    }

    render() {
        const { range, imgLoading, upImgs } = this.state;
        const _this = this;
        const uploadProps = {
            listType: 'picture-card',
            name: 'file',
            showUploadList: false,
            accept: imgType.join(','),
            beforeUpload: (file) => {
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                    message.error('图片大小不能超过10M!');
                    return false;
                }
                _this.setState({
                    imgLoading: true
                });
                formatImgs(file).then((fileData) => {
                    _this.setState({
                        imgLoading: false,
                        upImgs: [fileData.file]
                    });
                });
                return false;
            }
        };
        return (
            <div className="dashboard">
                首页
                <br />
                <div>测试dayjs替换momentjs后的效果，设置中文测试</div>
                <RangePicker value={range} onChange={this.changeRange} />
                <br />
                <br />
                <Button type="ghost" onClick={() => this.gotoDetial(1)}>查看详情</Button>
                <br />
                <div className="mt10 text-center">图片格式化测试(去除系统拍照出来的差异，苹果自动旋转，横屏照片，多余信息，以及图片压缩)</div>
                <Dragger {...uploadProps} className="photo-uploader">
                    <Spin spinning={imgLoading}>
                        {
                            upImgs.length
                                ? <div className="preview-img"><img src={upImgs[0].thumbUrl} alt="img" style={{ width: '100%' }} /></div>
                                : (
                                    <div>
                                        <PlusOutlined />
                                        <div className="ant-upload-text">点击上传</div>
                                    </div>
                                )
                        }
                    </Spin>
                </Dragger>
                <div className="text-center mt10">二维码组件：</div>
                <div style={{ margin: '20px auto', width: '200px' }}>
                    <Qrcode
                        qrUrl="https://github.com/Huaxink/antd-light-admin"
                        qrText="Antd Ligth Admin"
                        qrTextSize={16}
                        qrLogo={`${window.PUBLIC_PATH}logo.png`}
                    />
                </div>
            </div>
        );
    }
}
