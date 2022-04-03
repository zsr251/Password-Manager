<template>
	<view>
		<drag-button :isDock="true" :existTabBar="true" @btnClick="addNote" />
		<view v-if="total == 0" class="bg-grey bg-cyan light flex justify-center align-center" style="height: calc(100vh);width: 100vw; position: absolute;bottom: 0rpx;top: 0rpx;">
			<view class="padding-xl flex align-center">
				<text class="text-lg padding-right">无数据</text>
				<text class="text-xsl"><text class="cuIcon-read"></text></text>
			</view>
		</view>
		<view class="VerticalBox" v-else>
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop"
				style="height:calc(100vh)">
				<view class="cu-item " :class="index==tabCur?'text-green cur':''" v-for="(item,index) in list"
					:key="index" @tap="TabSelect" :data-id="item.id">
					<view class="text-lg" style="margin-top: 10rpx;">{{item.itemType}}</view>
				</view>
			</scroll-view>
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh)"
				:scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
				<view class="padding-top padding-lr" v-for="(item,index) in list" :key="index" :id="'main-'+item.id">
					<view class="cu-bar bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text> {{item.itemType + item.data.length +'条'}}
						</view>
					</view>
					<view class="cu-list solid-bottom bg-white">
						<view class="cu-item padding-top-lg padding-bottom-lg padding-left solids-bottom flex align-center" v-for="(nitem,nindex) in item.data" @tap="showNoteDetail(nitem._id)">
							<view class="cu-avatar radius margin-right ">
								{{nitem.item_title[0]}}
							</view>
							<view class="content">
								{{nitem.item_title}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''" @touchmove.stop.prevent="moveStop">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">无主密码</view>
				</view>
				<view class="padding-xl">
					本小程序所有的数据均是本地加密后上传到服务端存储，所以如果没有主密码或主密码丢失，则永远无法解密数据。
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="importPwd">导入已有密码</button>
						<button class="cu-btn bg-green margin-left" @tap="newPwd">创建新密码</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='DialogModal2'?'show':''" @touchmove.stop.prevent="moveStop">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">一键登录</view>
				</view>
				<view class="padding-xl">
					如果您还没有账号，则会自动给您创建一个账号，如果有关联到您微信的账号则会自动登录。
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn bg-green margin-left" >好的</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='DialogModal3'?'show':''" @touchmove.stop.prevent="moveStop">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content" v-if="lockModalStep == 0">录入锁屏密码</view>
					<view class="content" v-if="lockModalStep == 1">设置四位锁屏密码</view>
					<view class="content" v-if="lockModalStep == 2">再次输入密码</view>
				</view>
				<view class="padding-xl flex justify-center">
					<input type="number" @input="lockPwdInput" v-model="curLockPwd" maxlength="4" class="bg-white text-xxl text-bold text-black text-shadow" style="width: 200rpx;"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true,
				modalName: '',
				total:0,
				lockModalStep: 0, // 0 解锁 1 第一次录入设置 2 第二次录入设置
				curLockPwd: '', // 页面输入的锁屏密码
				step1LockPwd: '', // 设置时第一次录入的密码
			}
		},
		onShow() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			this.load = true;
			const mainpwd = uni.getStorageSync('mainpwd');
			if (!mainpwd) {
				this.modalName = 'DialogModal1';
				uni.hideLoading()
				return;
			} else {
				this.modalName = ''
			}
			// 判断是否设置了锁屏密码
			const lockPwd = uni.getStorageSync('lockPwd');
			if (lockPwd) {
				// 如果有锁屏密码 弹出密码输入框 且遮罩
				const isLock = uni.getStorageSync('isLock');
				if (isLock) {
					this.lockModalStep = 0;
					this.modalName = 'DialogModal3';
				}
			} else {
				// 如果没有锁屏密码 进行设置锁屏密码
				this.lockModalStep = 1;
				this.modalName = 'DialogModal3';
			}
			const uid = uni.getStorageSync('uid');
			if(!uid){
				this.toLogin();
				this.modalName = 'DialogModal2';
				uni.hideLoading()
				return;
			}
			// 加载密码数据
			this.loadData();
		},
		methods: {
			showNoteDetail(id){
				let url = '/pages/show-note/show-note?type=1&id=';
				uni.navigateTo({
					url:url+id,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			loadData(){
				let that = this;
				const uid = uni.getStorageSync('uid');
				if(!uid){
					uni.showToast({
						icon: 'error',
						title: '未登录'
					})
					uni.hideLoading()
					return;
				}
				uniCloud.callFunction({
					name: "account-note-get",
					data: {
						uid
					},
					success: async ({
						result
					}) => {
						if(result && result.code == 200){
							that.total = result.total;
							that.list = result.data;
						}
						uni.hideLoading()
					}
				})
			},
			toLogin() {
				const uid = uni.getStorageSync('uid');
				if(uid){
					console.log('已登录')
					if(this.modalName == 'DialogModal2'){
						this.modalName = '';
					}
					return;
				}
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						
						uniCloud.callFunction({
							name: "login-or-register",
							data: {
								code:res.code,
							},
							success: async ({
								result
							}) => {
								console.log(result);
								if(result && result._id){
									uni.setStorage({
										key:'uid',
										data: result._id
									});
									that.modalName = ''
									console.log('登录成功：'+result._id)
								}
							}
						})
					}
				});
			},
			importPwd() {
				this.$Router.push({
					path: '/pages/import-pwd/import-pwd'
				});
			},
			newPwd() {
				this.$Router.push({
					path: '/pages/new-pwd/new-pwd'
				});
			},
			moveStop() {},
			addNote(e) {
				let url = '/pages/show-note/show-note?type=0';
				uni.navigateTo({
					url,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				return false //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id);
						view.fields({
							size: true
						}, data => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id - 1) * 50
						this.tabCur = this.list[i].id
						return false
					}
				}
			},
			lockPwdInput(e) {
				let that = this;
				if (that.curLockPwd.length >= 4) {
					const lockWaitTime = uni.getStorageSync('lockWaitTime');
					if (lockWaitTime) {
						if (Date.now() < lockWaitTime) {
							that.curLockPwd = ''
							uni.showToast({
								icon: 'error',
								title: '锁定中，请稍后',
							})
							return
						}
					}
					that.curLockPwd = that.curLockPwd.slice(0, 4);
					// 解锁
					if (that.lockModalStep == 0) {
						const lockPwd = uni.getStorageSync('lockPwd');
						if (lockPwd == that.curLockPwd) {
							console.log('解锁成功')
							that.curLockPwd = ''
							that.modalName = ''
							// 清除锁屏失败次数
							uni.removeStorageSync('lockPwdErrorCount')
							uni.removeStorageSync('lockWaitTime')
							uni.removeStorageSync('isLock')
							uni.hideKeyboard();
						} else {
							let lockPwdErrorCount = uni.getStorageSync('lockPwdErrorCount');
							if (lockPwdErrorCount) {
								if (lockPwdErrorCount >= 3) {
									uni.setStorageSync('lockWaitTime',Date.now() + 10 * 60 * 1000)
									uni.showToast({
										icon: 'error',
										title: '锁定十分钟',
									})
								}else{
									uni.showToast({
										icon: 'error',
										title: '密码错误',
									})
								}
								lockPwdErrorCount = lockPwdErrorCount + 1
							} else {
								lockPwdErrorCount = 1
								uni.showToast({
									icon: 'error',
									title: '密码错误',
								})
							}
							uni.setStorageSync('lockPwdErrorCount',lockPwdErrorCount);
							that.curLockPwd=''
						}
					} else if (that.lockModalStep == 1) {
						// 第一步设置
						that.step1LockPwd = that.curLockPwd
						that.curLockPwd = ''
						that.lockModalStep = 2
					} else if (that.lockModalStep == 2) {
						// 第二步设置
						if (that.step1LockPwd == that.curLockPwd) {
							uni.setStorageSync('lockPwd',that.curLockPwd);
							uni.removeStorageSync('lockPwdErrorCount')
							uni.removeStorageSync('lockWaitTime')
							uni.removeStorageSync('isLock')
							that.modalName = ''
							that.curLockPwd = ''
							that.step1LockPwd = ''
							that.lockModalStep = 0
							uni.hideKeyboard();
							uni.showToast({
								title: '设置成功'
							})
						} else {
							uni.showToast({
								icon: 'error',
								title: '两次输入不一致',
							})
							that.curLockPwd = ''
							that.step1LockPwd = ''
							that.lockModalStep = 1
						}
					}
				}
			},
		},
	}
</script>

<style>
	.fixed {
		position: fixed;
		z-index: 99;
	}

	.VerticalNav.nav {
		width: 200upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #f1f1f1;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}
</style>
