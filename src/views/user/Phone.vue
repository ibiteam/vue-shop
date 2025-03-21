<template>
	<div class="login-wrap">
		<common-header :title="title" :is_show_more="false"></common-header>
		<div class="login-company">
			<span><img src="@/assets/images/user/login-phone.png"/></span>
			<div class="fs36 co-333" style="padding:0.32rem 0;">请输入验证码</div>
			<div style="padding:0 0 0.2rem;" class="co-999 fs26">已发送至<span style="line-height:1;font-size:0.26rem;" class="co-333">{{ phone_hide }}</span></div>
		</div>
		<div class="login-form">
			<van-password-input
				:value="phoneCode"
				:gutter="10"
				:focused="showKeyboard"
				:mask="false"
				@focus="showKeyboard = true"
			/>
			<van-number-keyboard
				v-model="phoneCode"
				:show="showKeyboard"
				@blur="showKeyboard = false"
			/>
			<p :class="{'clicked':second==0}" @click="sendPhoneCode">重新发送<span v-if="second">({{ second }})</span></p>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted, getCurrentInstance, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {registerOrPhoneLogin, sendCode} from '@/api/user'

const cns = getCurrentInstance().appContext.config.globalProperties
const router = useRouter()
const route = useRoute()

const phoneCode = ref('')
const showKeyboard = ref(false)
const second = ref(0)
const timer = ref(null)
const phone = ref('')
const phone_hide = ref('')
const action = ref('')
const title = ref('手机号快捷登录')
const fromPath = ref({})

// Watch phoneCode
watch(phoneCode, (val, old) => {
	if (val.length > 6) {
		phoneCode.value = old
	}
	if (val.length == 6) {
		codeSubmit()
	}
})

const countTime = () => {
	timer.value = setInterval(() => {
		second.value--
		if (second.value == 0) {
			clearInterval(timer.value)
		}
	}, 1000)
}

const sendPhoneCode = () => {
	if (second.value > 0) {
		return
	}
	second.value = 60
	let info = {
		phone: phone.value,
		action: action.value
	}
	sendCode(info).then(res => {
		sessionStorage.removeItem('can_send_code')
		if (res.code == 200) {
			cns.$toast('短信已经发送')
			countTime()
		} else {
			cns.$toast(res.message)
		}
	}).catch(err => {
		router.back()
	})
}

const codeSubmit = () => {
	let info = {
		phone: phone.value,
		code: phoneCode.value
	}
	registerOrPhoneLogin({info, action: action.value, is_register: route.query.is_registered}).then(res => {
		if (res.code == 200) {
			cns.$toast(action.value == 'login' ? '登录成功' : '注册成功')
			cns.$cookies.set('m-token', res.data.token, res.data.expires_at)
			let redirect = route.query.redirect
			let query = route.query.query_page ? JSON.parse(route.query.query_page) : {}
			setTimeout(() => {
				if (redirect) {
					cns.appRoute(redirect, query, 'replace')
				} else {
					cns.appRoute('home', {}, 'replace')
				}
			}, 500)
		} else {
			cns.$toast(res.message)
			phoneCode.value = ''
		}
	}).catch(err => {
		router.back()
	})
}
onMounted(() => {
	phone.value = route.query.phone
	action.value = route.query.action
	phone_hide.value = cns.$public.getPrivacyPhone(route.query.phone)
	title.value = action.value == 'login' ? '手机号快捷登录' : '手机快速注册'
	if (sessionStorage.getItem('can_send_code')) {
	    sendPhoneCode()
	} else if (fromPath.value.name) {
	    router.back()
	} else if (action.value == 'register') {
	    cns.appRoute('register', {}, {}, 'replace')
	} else {
	    cns.appRoute('login', {}, {}, 'replace')
	}
})

router.beforeEach((to, from, next) => {
	fromPath.value = from
	next()
})
</script>

<style scoped lang="scss">
.login-wrap {
	height: 100vh;
	background: #fff;

	:deep(.van-number-keyboard) {
		width: 7.5rem;
		right: 0;
		margin: auto;
	}

	.login-form {
		p {
			padding: 0.5rem 0.3rem;
			color: var(--color-text-desc);
			span {
				color: var(--color-text-desc);
				font-size: 0.24rem;
			}
		}

		p.clicked {
			span{
				color: var(--color-text);
			}
			color: var(--color-text);
		}
	}

	.login-company {
		padding-top: 0.5rem;
		text-align: center;
		padding-bottom: 0.3rem;

		img {
			width: 2.1rem;
		}
	}

	:deep(.van-password-input__security li) {
		background: var(--page-bg-color);
		border-radius: 0.1rem;
		width: 0.8rem;
		height: 1rem;
	}
}
</style>
