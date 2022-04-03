<template>
	<view class="bg-white">
		<view class="padding-xl"><text class="text-xxl text-black text-bold text-shadow">主密码</text></view>
		<view class="cu-form-group margin-top padding-bottom-xl">
			<input placeholder="43位主密码" name="input" v-model="mainpwd"></input>
			<button class='cu-btn bg-green shadow' @tap="scanCode">扫二维码</button>
		</view>
		
		<view class="padding-xl flex justify-center" @tap="setClipboard(mainpwd)" ><text class="text-lg text-olive text-shadow" style="word-break:break-all;">{{mainpwd}}</text></view>
		<view class="padding"><button type="primary" plain @tap="savePwd" class="round ">保存主密码</button></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mainpwd:''
			}
		},
		methods: {
			scanCode: function(){
				console.log("扫描图片")
				let that = this;
				uni.scanCode({
					success(res){
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.mainpwd = res.result;
					}
				});

			},
			savePwd(){
				uni.setStorage({
					key:'mainpwd',
					data: this.mainpwd,
					success() {
						uni.showToast({
							mask: true,
							title:'主密码设置成功'
						})
					}
				});
			},
			setClipboard: function(d){
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
