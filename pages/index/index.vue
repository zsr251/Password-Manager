<template>
	<view class="bg-white">
		<drag-button :isDock="true" :existTabBar="true" :addOrShare = "false" openType="share" />
		<view class="padding-xl " @tap="setClipboard(password)">
			<view class="flex justify-between align-end">
				<view class="text-bold text-xxl text-black">密码</view>
				<view class="text-gray">点击可复制</view>
			</view>
			<view  class="flex justify-center padding-top-lg padding-bottom-lg align-end">
				<text class="text-xxl">{{password}}</text>
			</view>
			<view class="flex justify-end text-gray ">
				<text>强度：<text class="text-bold text-red text-lg">{{level}}</text>/5</text>
			</view>
		</view>
		
		<view class="padding-xl solid-top solid-bottom">
			<view class="padding-top-xs">
				<view class="text-black">长度<text class="text-black text-bold text-lg">{{length}}</text>位</view>
				<view class="flex justify-between align-center">
					<view><text>4</text></view>
					<view style="width: 95%;"><slider :value="length" @change="sliderChange" @changing="sliderChange" min="4" max="36" /></view>
					<view><text>36</text></view>
				</view>
			</view>
			<view class="flex justify-between padding-top align-center">
				<view class="text-lg text-bold text-black">包含小写字母</view>
				<view><switch @change="lowerChange" :checked="lower==1" /></view>
			</view>
			<view class="flex justify-between padding-top align-center">
				<view class="text-lg text-bold text-black">包含大写字母</view>
				<view><switch @change="upperChange" :checked="upper==1" /></view>
			</view>
			<view class="flex justify-between padding-top align-center">
				<view class="text-lg text-bold text-black">包含数字</view>
				<view><switch @change="numberChange" :checked="number==1"/></view>
			</view>
			<view class="flex justify-between padding-top align-center">
				<view class="text-lg text-bold text-black">包含特殊字符</view>
				<view><switch @change="symbolChange" :checked="symbol==1"/></view>
			</view>
			<view class="flex justify-between padding-top-xs align-center">
				<view class="text-lg ">指定特殊字符</view>
				<view><input type="text" v-model="symbols" /></view>
			</view>
		</view>
		<view class="padding-xl">
			<button type="primary" plain @tap="generatePass" class="round">生成密码</button>
		</view>
		
	</view>
</template>

<script>
	import {generatePassword,generateUUID} from "@/common/password.js";
	export default {
		data() {
			return {
				password:'xxxx',
				level: 5,
				length: 16,
				lower: 1,
				upper:1,
				number:1,
				symbol:1,
				symbols:'!@#$%^&*_+?'}
		},
		onLoad: function(){
			this.password = generatePassword(this.length,this.lower,this.upper,this.number,this.symbol,this.symbols);
			this.level =  (this.length>8?1:this.length<6?-1:0) + this.lower + this.upper + this.number + this.symbol;
		},
		methods: {
			sliderChange: function(e){
				this.length = e.detail.value;
			},
			lowerChange:function(e){
				this.lower  = e.detail.value?1:0;
			},
			upperChange:function(e){
				this.upper  = e.detail.value?1:0;
			},
			numberChange:function(e){
				this.number  = e.detail.value?1:0;
			},
			symbolChange:function(e){
				this.symbol  = e.detail.value?1:0;
			},
			generatePass: function(){
				this.password = generatePassword(this.length,this.lower,this.upper,this.number,this.symbol,this.symbols); 
				this.level =  (this.length>8?1:this.length<6?-1:0) + this.lower + this.upper + this.number + this.symbol;				
				if(!this.password) this.level = 0;
			},
			setClipboard: function(d){
				uni.setClipboardData({
					data: d,
					success: function(){
						console.log("复制成功："+d)
					}
				})
			},
			onShareAppMessage(res) {
				if (res.from === 'button') {// 来自页面内分享按钮
				  console.log(res.target)
				}
				return {
				  title: '生成随机密码',
				  path: '/pages/index/index',
				  mpId: 'wxae4701cc7491a327'
				}
			  },
			onShareTimeline(res){
			  if (res.from === 'button') {// 来自页面内分享按钮
				console.log(res.target)
			  }
			  return {
				title: '生成随机密码',
				path: '/pages/index/index',
				mpId: 'wxae4701cc7491a327'
			  }
			},
		}
	}
	
</script>

<style>
	
</style>
