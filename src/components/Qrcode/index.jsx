import React, { Component } from 'react';
import './index.less';

const QRCode = require('qrcode');
/** 生成二维码开放接口:
 *  二维码内容[通常为url]
 *  二维码大小[限制为正方形]
 *  二维码中间显示：文字或LOGO[默认不显示]
 */
class Qrcode extends Component {
    constructor(props) {
        /** 父组件传递参数
		 * @argument qrUrl        二维码内容
		 * @argument qrSize       二维码大小(默认200)
		 * @argument qrText       二维码下方示文字
         * @argument qrTextSize   二维码下方显示文字大小(默认40px)
         * @argument qrLogo       二维码中间显示图片
		 * @argument qrLogoSize   二维码中间显示图片大小(默认为40)
		 */
        super(props); // 当父组件向子组件传递数据时，需要在这里传入props。
        this.initProps = { ...props };
        this.state = {
            qrUrl: props.qrUrl || '',
            qrSize: props.qrSize || 200,
            qrText: props.qrText || '',
            qrLogo: props.qrLogo || '',
            qrTextSize: props.qrTextSize || 40,
            qrLogoSize: props.qrLogoSize || 40
        };
    }

    componentDidMount() {
        this.renderImage();
    }

    static getDerivedStateFromProps(props, state) {
        return null;
    }

    render() {
        return (
            <div className="Qrcode">
                <div className="qrcode_box">
                    <img className="qrcode_img" crossOrigin="Anonymous" ref={(qrcode_img) => { this.qrcode_img = qrcode_img; }} alt="二维码图片" />
                    <img className="qrcode_logo" crossOrigin="Anonymous" ref={(qrcode_logo) => { this.qrcode_logo = qrcode_logo; }} alt="二维码logo" />
                    <canvas className="canvas" ref={(canvas) => { this.canvas = canvas; }} />
                </div>
            </div>
        );
    }

    renderImage() {
        // 画二维码里的logo[注意添加logo图片的时候需要在父组件中引入图片]
        const { qrcode_img, qrcode_logo, canvas, initProps } = this;
        const { qrUrl, qrText, qrLogo, qrSize, qrTextSize } = this.state;
        this.handleCanvasBlurProblem(canvas);
        const { realQrSize, pixRatio, realQrTextSize } = this;
        if (!canvas || !pixRatio) return;

        if (qrText) {
            // 如果有文字，就要重新计算canvas画布高度
            canvas.height = realQrSize + realQrTextSize;
            canvas.style.height = `${qrSize + qrTextSize}`;
        }
        // QRCode里自己默认设置了4倍图
        const opt = { type: 'image/jpeg', width: realQrSize, errorCorrectionLevel: 'H' };
        QRCode.toDataURL(qrUrl, opt).then(async (url) => {
            qrcode_img.src = url;
            await this.loadImg(qrcode_img);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(qrcode_img, 0, 0, realQrSize, realQrSize); // 获取图片

            if (qrLogo) {
                // 画二维码里的logo或文本 在canvas里进行拼接
                // 如果传了qrLogo则设置中间图片
                qrcode_logo.src = qrLogo;
                await this.loadImg(qrcode_logo);
                this.setQrcodeImg(ctx);
            }
            if (qrText) {
                // 如果传了qrText则设置中间文本
                this.setQrcodeText(ctx);
            }
            qrcode_img.src = canvas.toDataURL(); // 显示二维码图片标签
            canvas.style.display = 'none'; // 隐藏掉canvas
            qrcode_logo.style.display = 'none'; // 隐藏掉logopng
            qrcode_img.style.display = 'block';
            initProps.afterDraw && initProps.afterDraw(qrcode_img.src, qrText || '');
        });
    }

    // 加载图片
    loadImg(img) {
        return new Promise((resolve, reject) => {
            if (!img.src) {
                resolve(false);
                return;
            }
            img.onload = (e) => {
                resolve(e);
            };
        });
    }

    /**
	 * 在二维码下面加文本
	 */
    setQrcodeText = (ctx) => {
        const { realQrSize, realQrTextSize } = this;
        ctx.font = `bold ${realQrTextSize}px Arial`;
        const text = this.state.qrText;
        const tw = ctx.measureText(text).width; // 文字真实宽度
        const ftop = realQrSize;
        const fleft = (realQrSize - tw) / 2; // 根据字体大小计算文字left
        ctx.fillStyle = '#fff';
        ctx.fillRect(
            0,
            ftop,
            realQrSize,
            realQrTextSize
        );
        ctx.textBaseline = 'top'; // 设置绘制文本时的文本基线。
        ctx.fillStyle = '#000';
        ctx.fillText(text, fleft, ftop);
    }

    /**
	 * 在二维码中间加图片
	 */
    setQrcodeImg = (ctx) => {
        const { qrcode_logo } = this; // logo图片的标签
        ctx.fillStyle = '#fff'; // 设置获取的logo将其变为圆角以及添加白色背景
        ctx.beginPath();
        const logoPosition = (this.realQrSize - this.realQrLogoSize) / 2; // logo相对于canvas居中定位
        const h = this.realQrLogoSize + 10; // 圆角高 10为基数(logo四周白色背景为10/2)
        const w = this.realQrLogoSize + 10; // 圆角宽
        const x = logoPosition - 5;
        const y = logoPosition - 5;
        const r = 5; // 圆角半径
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage(
            qrcode_logo,
            logoPosition,
            logoPosition,
            this.realQrLogoSize,
            this.realQrLogoSize
        );
    }

    /**
	 * webkitBackingStorePixelRatio：浏览器在渲染canvas之前会用几个像素来来存储画布信息
	 * window.devicePixelRatio：屏幕的设备像素比
	 */
    getPixelRatio(context) {
        const backingStore = context.backingStorePixelRatio
            || context.webkitBackingStorePixelRatio
            || context.mozBackingStorePixelRatio
            || context.msBackingStorePixelRatio
            || context.oBackingStorePixelRatio
            || context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }

    /**
	 * 解决canvas下图片模糊的问题
	 */
    handleCanvasBlurProblem(canvas) {
        const ctx = canvas.getContext('2d');
        const per = this.getPixelRatio(ctx);
        const { qrSize, qrTextSize, qrLogoSize } = this.state;
        const h = qrSize;
        const w = qrSize;

        canvas.height = h * per;
        canvas.width = w * per;
        canvas.style.height = `${h}px`;
        canvas.style.width = `${w}px`;
        this.pixRatio = per;
        this.realQrSize = qrSize * per;
        this.realQrTextSize = qrTextSize * per;
        this.realQrLogoSize = qrLogoSize * per;
    }
}

export default Qrcode;
