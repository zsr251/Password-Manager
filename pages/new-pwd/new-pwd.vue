<template>
	<view @tap="setClipboard(mainpwd)" class="padding-xl">
		<view class="flex justify-between align-end">
			<view class="text-bold text-xxl text-black">主密码</view>
			<view class="text-gray">点击可复制</view>
		</view>
		<view class="padding solid bg-olive light margin-top-xl"><text class="text-xl" style="word-break:break-all;">{{mainpwd}}</text></view>
		<view class="flex justify-center margin-top margin-bottom"><yz-qr :qrPath.sync="qrPath" :text="mainpwd" :size="size" :quality="quality" :colorDark="colorDark"
			:colorLight="colorLight"></yz-qr></view>
		<view class="flex justify-center"><text>请截图保存该页面，如主密码丢失则所有数据都无法解密。可使用该二维码恢复主密码。</text></view>
	</view>
</template>

<script>
	import {generatePassword,generateUUID} from "@/common/password.js";
	export default {
		onLoad: function(){
			this.generatePwd()
		},
		data() {
			return {
				mainpwd:'',
				qrPath: '',
				text: 'hello',
				size: 200,
				quality: 'L',
				colorDark: '#000000',
				colorLight: '#ffffff'
			}
		},
		methods: {
			generatePwd(){
				let that = this;
				this.mainpwd = generatePassword(43,1,1,1,0);
				uni.setStorage({
					key:'mainpwd',
					data: this.mainpwd,
					success() {
						uni.showToast({
							mask: true,
							title:'主密码设置成功'
						});
					}
				});
			},
			setClipboard: function(d){
				console.log(d)
				uni.setClipboardData({
					data: d,
					success: function(){
						console.log("复制成功")
					}
				})
			},
		}
	}
</script>

<style>

</style>
