<template>
	<view >
		<!-- 纯展示 -->
		<view v-if="type == '1'" class="padding bg-white">
			<view class=" solids-bottom padding-bottom-lg">
				<view class="flex justify-center"><text class="text-xxl text-olive text-shadow text-bold">{{item_type}}</text></view>
				<view class="flex justify-end"><text>点击可复制</text></view>
			</view>
			<view @tap="setClipboard(item_title)" class="padding-top-lg padding-bottom solid-bottom">
				<view class="flex justify-between padding-lr ">
					<view><text class="text-xl ">主题</text></view>
				</view>
				<view class="padding flex flex-wrap justify-center">
					<text class="text-xl text-bold">{{item_title}}</text>
				</view>
			</view>
			<view v-if="item_type == '记事'">
				<view @tap="setClipboard(notes_text)" class="padding-bottom-lg" >
					<view class="padding"><text class="text-lg ">记事</text></view>
					<view class="flex justify-center flex-wrap basis-xl padding-lr-sm" >
						<text class="text-lg">{{notes_text}}</text>
					</view>
				</view>
			</view>
			<view v-else>
				<view @tap="setClipboard(username_text)" class="padding-bottom">
					<view class="padding"><text class="text-lg ">账号</text></view>
					<view class="flex justify-center flex-wrap padding-lr-sm">
						<text class="text-xl">{{username_text}}</text>
					</view>
				</view>
				<view @tap="setClipboard(password_text)" class="padding-bottom">
					<view class="padding"><text class="text-lg ">密码</text></view>
					<view class="flex justify-center flex-wrap padding-lr-sm">
						<text class="text-xl">{{password_text}}</text>
					</view>
				</view>
				<view @tap="setClipboard(comment)"  class="padding-bottom">
					<view class="padding"><text class="text-lg ">备注</text></view>
					<view class="flex justify-center flex-wrap basis-xl padding-lr-sm" >
						<text class="text-lg">{{comment}}</text>
					</view>
				</view>
			</view>
			<view class="flex justify-around padding-top-xl solid-top">
				<button @tap="setEditType" class="cu-btn round lines-blue lg margin-tb-sm" v-if="type == '1'">修改</button>
				<button @tap="deleteNote" :disabled="!canDelete" class="cu-btn round line-red lg  margin-tb-sm" v-if="type == '1'">删除</button>
			</view>
		</view>
		<!-- 新增或编辑 -->
		<view v-else class="padding bg-white">
			<view class="flex justify-center solids-bottom padding-bottom-lg">
				<picker @change="PickerChange" :value="index" :range="picker" v-if="type != '1'">
					<view class="picker text-xxl text-olive text-bold text-shadow padding-sm solids">
						{{index>-1?picker[index]:'请点击选择类型'}}
					</view>
				</picker>
			</view>
			<view class="padding-top-lg padding-bottom solid-bottom">
				<view class="flex justify-between padding-lr padding-bottom-sm">
					<text class="text-lg ">主题</text>
				</view>
				<view class="padding-lr text-xl">
					<input placeholder="输入有助于区分的主题" name="input" maxlength="30" v-model="item_title"></input>
				</view>
			</view>
			<view v-if="item_type == '记事'">
				<view class="padding-top-lg padding-bottom solid-bottom">
					<view class="flex justify-between padding-lr padding-bottom-sm">
						<text class="text-lg ">记事</text>
					</view>
					<view class="flex justify-between padding-lr text-xl">
						<textarea maxlength="1000"  v-model="notes_text" placeholder="记事内容"></textarea>
					</view>
				</view>
			</view>
			<view v-else>
				<view class="padding-top-lg padding-bottom solid-bottom">
					<view class="flex justify-between padding-lr padding-bottom-sm">
						<text class="text-lg ">账号</text>
					</view>
					<view  class="padding-lr text-xl">
						<input placeholder="输入账号" name="input" v-model="username_text"></input>
					</view>
				</view>
				<view class="padding-top-lg padding-bottom solid-bottom">
					<view class="flex justify-between align-end padding-lr padding-bottom-sm">
						<view><text class="text-lg ">密码</text></view>	
						<view @tap="randomPwd" class="cu-avatar sm round margin-left padding-sm" style="background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAALoUExURUdwTNgeBtgdBtcdBdcdBdgeBtgeBtcdBdgeBtYdBNoeBtgdBdgeBtoeBtceBdceBtcbA9ceBtgeBdcdBtcdBtcfB9cdBtceBt0hC9gdBdgeBtgeBtceBtceBdgbBdgdBdceBdgdBtgdBdgeBdYcBdgeBeAeCtcdBtccBdceBdcdBdYfBNgdBtgeB9geBt8fANAXANYdB9ofBNQqANceBdgcBtgeB9gdBtcfB9geBtkeB9YcBdcdBdYdBtgdBdYdBdceBtgdBtgeBt0cBdgdBtcdBdgdBdcdBtYeCtceBtcdBdQVANgeBtgfBtkcBdcdBdgdBdcdBtYaANceBdgeBdceBdceBswZANcdBtkeBdgcB9cdBdYcBNofBdcdBdccBdsfBNceBtQfCtcdBdkeBtgdBtcdBtYaBtYeBtcdBtcdBdkgBf8AANceBtgeBtceBtgeBtIeBdcdBdgcBMgkANoYANkeB9cdBdceBtgdBdYdBdceBdokANgfBtkfBtgeBtgdBtokDNYeBtgeBdgdBdgdBdgdBtceBtUeB9YeB9gdBdgdBtgdBdUdBdkcBNcfBdceBtkfBdkfBtcdBtceBv8/ANceBtcdBtgeBdIhC9geBtIeB9MfBtcfBtkeBtgeBtgdBtcdBucXANggBdYdBdceBdcfBcYcANUbBtgeBtYdBdkbA9gdBdgdBNcdBtgdBtkdBtgeBtceBtQcANgeBtccB9geBtkdBtIeANceCtcdBtgeBdceBtgeBNgdBdceBdYeB9kfBdgeBtgeBtgcBNgdBdgZANgeBdYfBNceBNgeBtceBdgdBNcfBtceBtodB9gdBtgeBuEeANcdBdceB9ceBdceBtcdB9YdBtgdBtYdBdkeBtceBdkfBtceBtcdBuIcANceBtMdB9geBtcdBdceBdgdBdgdBtgfBdceBtgdBtMaCNcTANgeBtcnANcfB9gdBtkeB9geBdcdBdgeBdceBtcgBtgeBrJaQBkAAAD3dFJOUwCq+mDvVZ+Af3BMv9Qq43VAmeWcoiD40RfYzNPqry6L5KXvslljGe9hM7U4cWuXCAtGOAbcUCHvQctEWLxy5pL8x3Ytxejf9xmWlAz0SVm0rM8Thl2H0wp6ZUiJajHXmTluGOpL0qMmd5vWLwJTwPTsM5VqDhVsvaizq4gOKErtxhWesbSRz6lDbIz5tYI+YlRZUqbKBO3EhRd+IimUt/5P8QtX345aCSWmi0qtaW94esh0Eu5HoXkRM/DfwXeKj2swd9I14BS7OTqnW5qc9ka/+xHIbbn+aHjmv5WwKc/ICf0j9d7i4vKDw80dDfMNaJ5lwNVc6Sc4njb/AAADHElEQVRIx8WWVVQbQRSGh6Rk06DBnSIFCi3eQqFFitbd3d3d3d3d3d3d3d3dXf/Xzmp2Awl5Y87JOVf+b3fmzuydEFI4Q9ebYZgSFsvDvMCNTh26WCLPGACo+jOMJhtI71qw3iEB9v368qYP0K6zeXliOSDSVfTadwS6M1Gm5UMGAyOGySNtugFe1qb01uMAB+NgyRRgn13lfOSLnQGroXnjZSoCe05dzBPfag976d26oNCaWim1ly7M64qR3htYGyc6VbltsDJk77wFrir0mVnXLhg8Lb9xsrzdazipiULhLk/bsnpG/sTfeBNg8FydABt5OoQJd9bJ/J9/gXfp5yR/+43b9/D8qalyf/vFT/GoFCnL+WlPXuSr//AVKPaH6HFcCsXT+d5/CFSplFd+kNZP9YNb5w4pyBfkcQ6Qtc5Ir1EBzzJIqsZDiwpGAMk9TyfmuUQmX20PJOwnhG62nkF5JeBIf5s9KTKljxBetQxYHr6ekMs0qteipQKwwiXWXBRKp9wruWn9VhFTVwJrVrDBLRTQadFEAfgCm1g7blAaxOG2lM+3BlzoohsqgF1U0ILzerYV9MP9hLweddkqhSmAGKqoLfiNOb0qRlEvBnWUiy4FBIkBXxZoQIyAYKOyMjbS9xBB9fWiebtacRGwNt4H2WgGlJQOcqoAlDYDNAf4xhdM31VDAHRmgKJwE44GBdQC0MgsUERMwb0WZ01CkiWAFap78NZsOErpHnA1BRBJNWfyXMMZhtokII5ZGGNwistaik1kmfwA2hdkTSHECdMF04+2g2gRWDBPfNAEW2WXYIDR0zjLg5alkgBoxN4U5c8eV8VQ09zYhazlTr94HqAvgy0bmukNFWNcx9jxVMh+g9ZU5kiBQO4hzoTsdgEGxubTTWbMBzKvU8LJ9gsH0FP08RU54YOUiSYa1razQMAtoayBxM7Xv/Lnu4Bmg8kbKPfYTbhxzeQ7qnC3HHA62ewddyaANppE7lCryb9PgP+Bgm7R0keAjTvxEtm01o+SLLmoS8UDOaBX7vsHFv4TGDmK7c6HDp8snP8t/wFGXJ1qOJ1F5QAAAABJRU5ErkJggg==)"></view>
					</view>
					<view  class="padding-lr text-xl">
						<input placeholder="输入密码" name="input" v-model="password_text"></input>
					</view>
				</view>
				<view class="padding-top-lg padding-bottom solid-bottom">
					<view class="flex justify-between padding-lr padding-bottom-sm">
						<text class="text-lg ">备注</text>
					</view>
					<view class="flex justify-between padding-lr text-xl">
						<textarea maxlength="500" placeholder="备注内容" v-model="comment"></textarea>
					</view>
				</view>
			</view>
			<view class="padding-top-xl solid-top">
				<button type="primary" plain @tap="newNote" :disabled="!canAdd" class="round" v-if="type == '0'">生成记录</button>
				<button type="warn" plain @tap="editNote" :disabled="!canUpdate" class="round" v-if="type == '2'">保存修改</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		AES_CBC_ENCRYPT,
		AES_CBC_DECRYPT
	} from "@/common/common.js";
	import {
		generatePassword
	} from "@/common/password.js";
	export default {
		data() {
			return {
				id: '',
				uid: '',
				type: '0', // 0 新增 1 查看 2 修改
				index: -1,
				picker: ['记事', '工作', '网站', '邮箱', '游戏', '金融', '生活', '其他'],
				item_title: '',
				item_type: '',
				notes_text: '',
				username_text: '',
				password_text: '',
				comment: '',
				canDelete : true,
				canUpdate: true,
				canAdd:true,
			}
		},
		onLoad(...options) {
			console.log(options)
			this.type = options[0].type;
			if (options[0].id) {
				this.id = options[0].id;
				this.loadNote();
			}
		},
		methods: {
			setEditType() {
				this.type = '2';
			},
			newNote() {
				if(!this.checkInput()){
					return
				}
				const uid = uni.getStorageSync('uid');
				const mainpwd = uni.getStorageSync('mainpwd');
				let that = this;
				that.canAdd = false;
				uniCloud.callFunction({
					name: "account-note-edit",
					data: {
						uid,
						type: '0',
						itemTitle: that.item_title,
						itemType: that.item_type,
						notesText: AES_CBC_ENCRYPT(that.notes_text, mainpwd),
						usernameText: AES_CBC_ENCRYPT(that.username_text, mainpwd),
						passwordText: AES_CBC_ENCRYPT(that.password_text, mainpwd),
						comment: that.comment
					},
					success: async ({
						result
					}) => {
						if (result && result.code == 200) {
							console.log(result)
							that.type = '1';
							that.id = result.data._id;
							uni.showToast({
								title: "新建成功"
							})
						}
					},
					fail: (e) => {
						console.error(e)
						that.canAdd = true;
						uni.showToast({
							icon: 'error',
							title: '新建失败'
						})
					},
				})
			},
			editNote() {
				if(!this.checkInput()){
					return
				}
				let that = this;
				const uid = uni.getStorageSync('uid');
				const mainpwd = uni.getStorageSync('mainpwd');
				that.canUpdate = false;
				uniCloud.callFunction({
					name: "account-note-edit",
					data: {
						uid,
						type: '2',
						id: that.id,
						itemTitle: that.item_title,
						itemType: that.item_type,
						notesText: AES_CBC_ENCRYPT(that.notes_text, mainpwd),
						usernameText: AES_CBC_ENCRYPT(that.username_text, mainpwd),
						passwordText: AES_CBC_ENCRYPT(that.password_text, mainpwd),
						comment: that.comment
					},
					success: async ({
						result
					}) => {
						console.log(result);
						if (result && result.code == 200) {
							that.type = '1';
							that.canUpdate = true;
							uni.showToast({
								title: "修改成功"
							})
						}
					},
					fail: (e) => {
						console.error(e)
						that.canUpdate = true;
						uni.showToast({
							icon: 'error',
							title: '修改失败'
						})
					},
				})
			},
			deleteNote() {
				let that = this;
				const uid = uni.getStorageSync('uid');
				that.canDelete = false;
				uni.showModal({
					title: '注意',
					content: '是否确认要删除这条数据？',
					success: function(res) {
						if (res.confirm) {
							uniCloud.callFunction({
								name: "account-note-edit",
								data: {
									uid,
									type: '3',
									id: that.id,
								},
								success: async ({
									result
								}) => {
									console.log(result);
									if (result && result.code == 200) {
										uni.showToast({
											title: "删除成功",
											success() {
												uni.switchTab({
													url: '../book/book'
												})
											}
										})
									}
								},
								fail: (e) => {
									console.error(e)
									that.canDelete = true;
									uni.showToast({
										icon: 'error',
										title: '删除失败'
									})
								},
							})
						}else{
							that.canDelete = true;
						}
					}
				});
			},
			loadNote() {
				let that = this;
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				const uid = uni.getStorageSync('uid');
				uniCloud.callFunction({
					name: "account-note-edit",
					data: {
						uid,
						id: that.id,
						type: '1'
					},
					success: async ({
						result
					}) => {
						uni.hideLoading()
						console.log(result);
						if (result && result.code == 200) {
							const mainpwd = uni.getStorageSync('mainpwd');

							that.item_title = result.data.item_title;
							that.item_type = result.data.item_type;
							that.index = that.getTypeIndex(result.data.item_type);
							that.comment = result.data.comment;
							if (result.data.notes_text) {
								let realText = '';
								try{
									realText = AES_CBC_DECRYPT(result.data.notes_text, mainpwd);	
								}catch(e){}
								 
								console.log(realText)
								if (realText) {
									that.notes_text = realText;
								} else {
									uni.showToast({
										icon: 'error',
										title: '主密码错误'
									})
									return;
								}
							}
							if (result.data.username_text) {
								let realText = AES_CBC_DECRYPT(result.data.username_text, mainpwd);
								if (realText) {
									that.username_text = realText;
								} else {
									uni.showToast({
										icon: 'error',
										title: '主密码错误'
									})
									return;
								}
							}
							if (result.data.password_text) {
								let realText = AES_CBC_DECRYPT(result.data.password_text, mainpwd);
								if (realText) {
									that.password_text = realText;
								} else {
									uni.showToast({
										icon: 'error',
										title: '主密码错误'
									})
									return;
								}
							}

						} else {
							uni.showToast({
								icon: 'error',
								title: '记录未找到'
							})
						}
					}
				})
			},
			getTypeIndex(itemType) {
				for (let i = 0; i < this.picker.length; i++) {
					if (this.picker[i] == itemType) {
						return i;
					}
				}
				return -1;
			},
			PickerChange(e) {
				this.index = e.detail.value
				this.item_type = this.picker[this.index];
			},
			checkInput(){
				if(!this.item_type){
					uni.showToast({
						icon: 'error',
						title: '类型必须选择'
					})
					return false;
				}
				if(!this.item_title){
					uni.showToast({
						icon: 'error',
						title: '主题不能留空'
					})
					return false;
				}
				if(this.item_type == '记事'){
					if(!this.item_title){
						uni.showToast({
							icon: 'error',
							title: '记事内容不能空'
						})
						return false;
					}
				} else {
					if(!this.password_text && !this.username_text){
						uni.showToast({
							icon: 'error',
							title: '账号和密码为空'
						})
						return false;
					}
				}
				return true;
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
			randomPwd:function(){
				this.password_text = generatePassword(16,1,1,1,1,'!@#$%^&*_+?');
			},
		}
	}
</script>

<style>

</style>
