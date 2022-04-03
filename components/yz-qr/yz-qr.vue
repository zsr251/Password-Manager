<template>
	<view>
		<view class="qrcode">
			<canvas :style="{width:size+ 'px', height:size+ 'px', background:bgc}" canvas-id="couponQrcode"></canvas>
		</view>
	</view>
</template>

<script>
	const qrCode = require('./weapp-qrcode.js')
	export default {
		data() {
			return {
				bgc: 'rgba(200, 200, 200, 0.1)', //测试画布是否与内容相同大小
				canvasQrPath: this.qrPath, //
				level: ''
			}
		},

		props: {
			text: {
				type: String,
				default: 'hello'
			},
			size: {
				type: Number,
				default: 200
			},
			quality: {
				type: String,
				default: 'L' //二维码质量L/M/Q/H
			},
			colorDark: {
				type: String,
				default: '#000000'
			},
			colorLight: {
				type: String,
				default: '#ffffff'
			},
			qrPath: {
				type: String,
				default: ''
			}
		},
		// 在实例挂载完成后被立即调用
		mounted() { //兼容非动态取值(二维码为固定内容)
			this.couponQrCode()
		},
		watch: {
			text(newVal, oldVal) { //监测到text值发生改变时重新绘制
				console.log('最新值是：' + newVal, "原来的值是：" + oldVal);
				this.couponQrCode()
			}
		},
		methods: {
			// 二维码生成工具
			couponQrCode() {
				var that = this;
				if (this.quality == 'L') {
					this.level = qrCode.CorrectLevel.L
				} else if (this.quality == 'M') {
					this.level = qrCode.CorrectLevel.M
				} else if (this.quality == 'Q') {
					this.level = qrCode.CorrectLevel.Q
				} else if (this.quality == 'H') {
					this.level = qrCode.CorrectLevel.H
				} else {
					this.level = qrCode.CorrectLevel.L
				}
				new qrCode('couponQrcode', {
					text: this.text,
					width: this.size,
					height: this.size,
					showLoading: true, // 是否显示loading
					loadingText: '二维码生成中', // loading文字
					colorDark: this.colorDark, //二维码暗部颜色
					colorLight: this.colorLight, //二维码亮部颜色
					correctLevel: this.level, //二维码质量L/M/Q/H
					usingIn: this //在自定义组件下，第二个参数传入组件实例this
				})
				// 把当前画布指定区域的内容导出生成图片，并返回文件路径。
				uni.canvasToTempFilePath({
					canvasId: 'couponQrcode',
					success: (res) => {
						// 在H5平台下，tempFilePath 为 base64
						// console.log('yz-qr图片路径:', res.tempFilePath)
						this.canvasQrPath = res.tempFilePath
						this.$emit('update:qrPath', this.canvasQrPath)
					}
				}, this);

				console.log('绘制完成');
			}
		}
	}
</script>

<style>
	.qrcode {
		padding: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
