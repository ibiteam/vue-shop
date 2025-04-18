<template>
    <div></div>
</template>

<script setup>
import {ref, onMounted ,getCurrentInstance} from "vue";
const cns = getCurrentInstance().appContext.config.globalProperties
import { appRoute } from "@/router/appRoute.js";
import { wechatAuth } from "@/api/user.js";
import { useRoute } from "vue-router";
import { isSuccessCode } from "@/utils/constant.js";

const route = useRoute()

const authSuccess = ()=> {
	let toName = localStorage.getItem('wxRedirectUrl') ? JSON.parse(localStorage.getItem('wxRedirectUrl')) : {
		name: 'home',
		query: {}
	}
	localStorage.removeItem('wxRedirectUrl')
	appRoute(toName.name, toName.query, 'replace')
}

onMounted(() => {
	if (!/micromessenger/i.test(navigator.userAgent)) { // 如果不是微信访问
		cns.$toast('非微信环境下不支持访问本页，即将跳转首页')
		setTimeout(() => {
			appRoute('home', {}, 'replace')
		}, 2000)
		return
	}
	if (!route.query.code) {
		appRoute('home', {}, 'replace')
	} else {
		let code = route.query.code
		//if(localStorage.getItem('wxCode') && localStorage.getItem('wxCode') == code){
		//	authSuccess()
		//	return;
		//}
		wechatAuth(code).then(res => {
			alert(res.code)
			if (isSuccessCode(res)) {
				localStorage.setItem('wxCode',code)
				localStorage.setItem('wxUserInfo', JSON.stringify(res.data))
				if (res.data.token) {
					cns.$cookies.set('m-token', res.data.token)
				}
				localStorage.setItem('wxopenid', res.data.openid)
				authSuccess()
			} else {
				cns.$toast(res.message)
				// 授权失败跳转首页
				appRoute('home', {}, 'replace')
			}
		}).catch(err => {
			alert(err)
			console.log(err)
		})

	}
})
</script>
