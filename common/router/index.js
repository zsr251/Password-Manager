// router.js
import {
	RouterMount,
	createRouter
} from './uni-simple-router.js';

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	applet: {
		animationDuration: 0 //默认 300ms 
	},
	routerErrorEach: ({
		type,
		msg
	}) => {
		switch (type) {
			case 3: // APP退出应用
				// #ifdef APP-PLUS
				router.$lockStatus = false;
				uni.showModal({
					title: '提示',
					content: '您确定要退出应用吗？',
					success: function(res) {
						if (res.confirm) {
							plus.runtime.quit();
						}
					}
				});
				// #endif
				break;
			case 2:
			case 0:
				router.$lockStatus = false;
				break;
			default:
				break;
		}

	},
	// 通配符，非定义页面，跳转404
	routes: [...ROUTES,
		{
			path: '*',
			redirect: (to) => {
				return {
					name: '404'
				}
			}
		},
	]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// 权限控制登录
	if (to.meta && to.meta.auth) {
		const uid = uni.getStorageSync('uid');
		if (uid) {
			next()
		} else {
			console.log("被拦截")
			next()
			// uni.showModal({
			// 	content: "这是没有登录提示"
			// })
		}
	} else {
		next()
	}
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('跳转结束')
})

export {
	router,
	RouterMount
}
