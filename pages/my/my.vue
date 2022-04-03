<template>
	<view>
		<view class=" padding margin-bottom bg-white flex justify-between align-center">
			<view class="cu-avatar xl margin-left round" @tap="refreshAvatar" v-if="!avatar">
				<text class="cuIcon-people"></text>
			</view>
			<view v-else @tap="refreshAvatar" class="cu-avatar xl round margin-left"
				:style="'background-image:url(' + avatar + ');'"></view>
			<view class="margin-right padding-right"><text class="text-xxl text-black text-bold">{{nickname}}</text>
			</view>
		</view>
		<view class="cu-list menu sm-border margin-top">
			<view class="cu-item arrow" @tap="changeUser('mobile','手机号')">
				<view class="content">
					<text class="cuIcon-mobile text-green"></text>
					<text class="text-grey">手机号</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{mobileMask}}</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="changeUser('email','邮箱')">
				<view class="content">
					<text class="cuIcon-mail text-green"></text>
					<text class="text-grey">邮箱</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{emailMask}}</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="sendMainpwd">
				<view class="content">
					<text class="cuIcon-send text-green"></text>
					<text class="text-grey">发送主密码到邮箱</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="setMainpwd">
				<view class="content">
					<text class="cuIcon-settings text-yellow"></text>
					<text class="text-grey">设置主密码</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="clearMainpwd">
				<view class="content">
					<text class="cuIcon-delete text-red"></text>
					<text class="text-grey">清除主密码</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="clearLockpwd">
				<view class="content">
					<text class="cuIcon-command text-red"></text>
					<text class="text-grey">清除锁屏密码</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="showAbout">
				<button class="cu-btn content">
					<text class="cuIcon-question text-olive"></text>
					<text class="text-grey">使用说明</text>
				</button>
			</view>
			<view class="cu-item arrow">
				<button class="cu-btn content" open-type="feedback">
					<text class="cuIcon-question text-olive"></text>
					<text class="text-grey">意见反馈</text>
				</button>
			</view>

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
						<button class="cu-btn bg-green margin-left">好的</button>
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
					<input type="number"  @input="lockPwdInput" v-model="curLockPwd" maxlength="4" class="bg-white text-xxl text-bold text-black text-shadow" style="width: 200rpx;"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatar: '',
				nickname: '昵称',
				username: '',
				mobile: '',
				email: '',
				uid: '',
				modalName: '',
				lockModalStep: 0, // 0 解锁 1 第一次录入设置 2 第二次录入设置
				curLockPwd: '', // 页面输入的锁屏密码
				step1LockPwd: '', // 设置时第一次录入的密码
			}
		},
		computed: {
			mobileMask: function() {
				if (this.mobile) {
					return this.mobile.replace(/(\d{3})\d*(\d{4})/, "$1****$2")
				} else {
					return ''
				}
			},
			emailMask: function() {
				if (this.email) {
					return this.email.replace(/(.{0,3}).*@(.*)/, "$1***@$2")
				} else {
					return ''
				}
			}
		},
		onShow() {
			let that = this;
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			const mainpwd = uni.getStorageSync('mainpwd');
			if (!mainpwd) {
				this.modalName = 'DialogModal1';
				uni.hideLoading()
				return;
			} else {
				this.modalName = ''
			}

			const uid = uni.getStorageSync('uid');
			if (!uid) {
				this.toLogin();
				this.modalName = 'DialogModal2';
				uni.hideLoading()
				return;
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

			this.uid = uid;
			// 加载用户数据
			uniCloud.callFunction({
				name: "get-update-user",
				data: {
					type: '1',
					uid: uid,
				},
				success: async ({
					result
				}) => {
					uni.hideLoading()
					console.log(result);
					if (result && result.code == 200) {
						that.avatar = result.avatar
						that.nickname = result.nickname
						that.username = result.username
						that.mobile = result.mobile
						that.email = result.email
					} else if (result.code == 404) {
						uni.showToast({
							icon: 'error',
							title: result.message,
							complete() {
								uni.removeStorage({
									key: 'uid',
									success() {
										that.uid = '';
										that.toLogin();
										that.modalName = 'DialogModal2';
									}
								})
							}
						})
					} else {
						uni.showToast({
							icon: 'error',
							title: result.message
						})
					}
				}
			})

		},
		methods: {
			refreshAvatar() {
				let that = this;
				uni.getUserProfile({
					desc: "获取个人信息",
					success: (res) => {
						console.log(res.userInfo)
						that.avatar = res.userInfo.avatarUrl;
						that.nickname = res.userInfo.nickName;
						// 修改用户数据
						uniCloud.callFunction({
							name: "get-update-user",
							data: {
								uid: that.uid,
								avatar: res.userInfo.avatarUrl,
								nickname: res.userInfo.nickName
							},
							success: async ({
								result
							}) => {
								console.log(result);
							}
						})
					},
				})
			},
			clearMainpwd() {
				let that = this;
				uni.showModal({
					title: '注意',
					content: '清除主密码后，使用该主密码加密的数据将无法解密！确认要清除主密码吗？',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorage({
								key: 'mainpwd'
							})
							that.modalName = 'DialogModal1';
						}
					}
				});
			},
			clearLockpwd() {
				let that = this;
				uni.showModal({
					title: '注意',
					content: '为了保护您的隐私，每次打开小程序都会进入锁屏页面，是否需要清除并重设锁屏密码？',
					success: function(res) {
						if (res.confirm) {
							uni.removeStorage({
								key: 'lockPwd'
							})
							uni.removeStorage({
								key: 'isLock'
							})
							that.lockModalStep = 1;
							that.modalName = 'DialogModal3';
						}
					}
				});
			},
			setMainpwd() {
				this.modalName = 'DialogModal1';
			},
			sendMainpwd() {
				if (!this.email) {
					uni.showToast({
						icon: 'error',
						title: '请先设置邮箱'
					})
					return;
				}
				let that = this;
				uni.showModal({
					title: '注意',
					content: '将向您的邮箱发送包含主密码的邮件，确认要发吗？',
					success: function(res) {
						if (res.confirm) {
							const mainpwd = uni.getStorageSync('mainpwd');
							uniCloud.callFunction({
								name: "sendmail",
								data: {
									to: that.email,
									subject: '密码生成管理簿主密码',
									text: '主密码：\r\n' + mainpwd
								},
								success: (e) => {
									console.log(e.result)
									uni.showToast({
										title: '邮件已发送'
									})
								},
								fail: () => {
									uni.showToast({
										icon: 'error',
										title: '邮件发送失败'
									})
								}
							})
						}
					}
				});
			},
			showAbout() {
				uni.showModal({
					title: '使用说明',
					showCancel: false,
					content: '本程序在客户端使用AES-256加密，主密码为密钥。服务端只保存密文，不存储也不传送任何密钥。\r\n请妥善保存主密码，如若丢失则数据将永久无法解密！',
				});
			},
			changeUser(code, name) {
				let that = this;
				uni.showModal({
					title: '修改用户' + name,
					editable: true,
					placeholderText: name,
					success(res) {
						if (res.cancel) {
							console.log('用户点击取消');
							return;
						}
						console.log(res.content)
						if (code == 'mobile') {
							if (!/^1[3-9]\d{9}$/.test(res.content)) {
								uni.showToast({
									icon: 'error',
									title: '手机号格式错误'
								})
								return;
							}
						}
						if (code == 'email') {
							if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(res.content)) {
								uni.showToast({
									icon: 'error',
									title: '邮箱格式错误'
								})
								return;
							}
						}

						// 修改用户数据
						uniCloud.callFunction({
							name: "get-update-user",
							data: {
								uid: that.uid,
								[code]: res.content
							},
							success: async ({
								result
							}) => {
								console.log(result);
								if (result && result.code == '200') {
									that[code] = res.content
									uni.showToast({
										title: result.message
									})
								} else {
									uni.showToast({
										icon: 'error',
										title: result.message
									})
								}
							}
						})
					}
				})
			},
			toLogin() {
				const uid = uni.getStorageSync('uid');
				if (uid) {
					console.log('已登录')
					if (this.modalName == 'DialogModal2') {
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
								code: res.code,
							},
							success: async ({
								result
							}) => {
								console.log(result);
								if (result && result._id) {
									uni.setStorage({
										key: 'uid',
										data: result._id
									});
									that.uid = result._id
									that.modalName = ''
									console.log('登录成功：' + result._id)
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
			moveStop(){
				
			},
		},
	}
</script>

<style>

</style>
