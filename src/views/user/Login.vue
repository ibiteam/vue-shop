<template>
	<div class="login-wrap">
		<div class="login-header">
			<span class="iconfont" @click="router.back()">&#xe605;</span>
		</div>
		<div class="login-company">
            <span>
                <img :src="wap_logo_color" v-if="wap_logo_color"/>
                <h4 v-else class="no"/>
            </span>
			<p>买好货上{{ shop_name }}</p>
		</div>
		<div class="login-form">
			<van-form @submit="onSubmit" v-if="loginType">
				<van-field
					left-icon="friends-o"
					v-model="username"
					name="username"
					placeholder="请输入用户名"
				/>
				<div class="password-input">
					<van-field
						v-model="password"
						left-icon="manager-o"
						:type="showPassword?'text':'password'"
						name="password"
						placeholder="请输入密码"
						maxlength="16"
						@click-right-icon="changeShowPassword"
					>
						<template #right-icon>
							<em class="iconfont">{{ showPassword ? '&#xe736;' : '&#xe733;' }}</em>
						</template>
					</van-field>
				</div>
				<div style="margin: 0.7rem 0.45rem 0.3rem;">
					<van-button round block type="info" native-type="submit" id="login_btn">
						登 录
					</van-button>
				</div>
			</van-form>
			<van-form @submit="onSubmitPhone" v-else>
				<van-field
					v-model="phone"
					type="tel"
					name="phone"
					left-icon="phone-o"
					placeholder="请输入手机号"
				/>
				<div style="margin: 0.7rem 0.45rem 0.3rem;">
					<van-button round block type="info" native-type="submit" id="login_btn">
						{{ loginType ? '登 录' : '登 录' }}
					</van-button>
				</div>
			</van-form>
			<p><span @click="appRoute('register')">新用户注册</span><span
				@click="loginType=!loginType">{{ loginType ? '短信验证码登录' : '账号密码登录' }}</span><span
				class="no-password" @click="appRoute('getPassword',{type:4},{type:4})" v-if="loginType">忘记密码</span>
			</p>
		</div>
	</div>
</template>

<script setup>
import md5 from 'js-md5'
import {ref, onMounted, getCurrentInstance, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useConfigStore} from '@/stores'
import { accountLogin, checkPhone} from "@/api/user.js";

const cns = getCurrentInstance().appContext.config.globalProperties

const router = useRouter()
const route = useRoute()
const configStore = useConfigStore()
const shopConfig = computed(() => configStore.shopConfig)

const wap_logo_color = computed(() => shopConfig.value.wap_logo_color || '')
const shop_name = computed(() => shopConfig.value.shop_name || '')
const username = ref('')
const password = ref('')
const phone = ref('')
const showPassword = ref(false)
const loginType = ref(true) // true:代表账号密码登录，false：代表手机号登录
const fromPath = ref('')
const isRegistered = ref('0')

const changeShowPassword = () => {
	showPassword.value = !showPassword.value
}

/*账号登录提交*/
const onSubmit = (values) => {
	if (values.username == '') {
		cns.$toast('请输入用户名')
		return
	}
	if (values.password == '') {
		cns.$toast('请输入密码')
		return
	}
	loginPassword()
}

const loginPassword = () => {
	let data = {
		'user_name': cns.$public.filterWhitespace(username.value),
		'password': md5(password.value),
	}
	accountLogin(data).then(res => {
		if (res.code == 200) {
			cns.$cookies.set('app_token', res.data.token)
			let redirect = route.query.redirect
			if (redirect) {
				cns.appRoute(redirect, {}, 'replace')
			} else if (fromPath.value.name && (fromPath.value.name != 'getPassword' || fromPath.value.name != 'articleDetail' || fromPath.value.name != 'register' || fromPath.value.name != 'phone_getPassword')) {
				cns.appRoute(fromPath.value.name, fromPath.value.query, 'replace')
			} else {
				cns.appRoute('ucenter', {}, 'replace')
			}
		} else {
			cns.$toast(res.message)
		}
	})
}

const onSubmitPhone = (values) => {
	if (values.phone == '') {
		cns.$toast('请输入手机号码')
		return
	}
	if (!cns.$public.isTelPhone(phone.value)) {
		cns.$toast('请输入正确的手机号码')
		return
	}
	checkPhone(phone.value).then(res=>{
		isRegistered.value = res.code == 1003 ? '1' : '0'
		if (isRegistered.value == '1') {
			goToPhone()
		} else {
			cns.$dialog.confirm({
				message: '该手机号未注册,是否创建账号？',
				confirmButtonText: '同意',
				cancelButtonText: '不同意'
			}).then(() => {
				goToPhone()
			}).catch(() => {
			})
		}
	})
}

const goToPhone = () => {
	sessionStorage.setItem('can_send_code', true)
	let redirect = route.query.redirect

	let query = {}
	if (redirect) {
		console.log(redirect)
	} else if (fromPath.value.name && fromPath.value.name != 'getPassword' && fromPath.value.name != 'register' && fromPath.value.name != 'phone_getPassword') {
		redirect = fromPath.value.name
		query = fromPath.value.query
	} else {
		redirect = 'ucenter'
	}
	cns.appRoute('phone', {phone: phone.value, type: '9', redirect: redirect, queryO: query, is_registered: isRegistered.value}, 'replace')
}

onMounted(() => {
})

router.beforeEach((to, from, next) => {
	fromPath.value = from
	next()
})
</script>

<style scoped lang="scss">

.login-wrap {
	height: 100vh;
	background: #fff url("@/assets/images/user/bj.png") no-repeat top center;
	background-size: 100% 5.2rem;

	.login-header {
		height: 0.8rem;
		line-height: 0.8rem;

		.iconfont {
			font-size: 0.4rem;
		}

		padding-left: 0.2rem;
	}

	.login-company {
		padding-top: 0.4rem;
		text-align: center;
		padding-bottom: 0.3rem;

		img {
			width: auto;
			height: 1.51rem;
		}

		h4 {
			width: 1.1rem;
			height: 1.1rem;
			border-radius: 50%;
			background: #eee;
			display: inline-block;
		}

		p {
			line-height: 3;
			font-size: 0.24rem;
			color: #333;
		}
	}

	.login-form {
		padding: 0 0.3rem;

		:deep(.van-field__left-icon) {
			margin-right: 0.25rem;
		}

		:deep(.van-icon.van-icon-arrow::before) {
			font-weight: bold;
			color: #333;
			font-size: 0.38rem !important;
		}

		:deep(.van-field__right-icon em) {
			color: #333;
			font-size: 0.36rem;
		}

		.van-field {
			margin-bottom: 0.3rem;
			padding: 0.30rem 0.40rem;
		}

		:deep(.van-field__body) {
			align-items: unset;
		}

		:deep(.van-icon-friends-o:before) {
			content: '';
			width: 0.4rem;
			height: 0.4rem;
			background: url("@/assets/images/user/user.png") no-repeat center;
			background-size: 0.26rem 0.3rem;
		}

		:deep(.van-icon-manager-o:before) {
			content: '';
			width: 0.4rem;
			height: 0.4rem;
			background: url("@/assets/images/user/password.png") no-repeat center;
			background-size: 0.26rem 0.27rem;
		}

		.van-cell {
			margin-bottom: 0.3rem;
			padding: 0.30rem 0.40rem;
			background: #F8F8F8;
			border-radius: 0.5rem;
			height: 1rem;

			&::after {
				display: none;
			}
		}

		:deep(.van-cell__title) {
			color: #000;

			span {
				font-size: 0.30rem;
			}
		}

		:deep(.van-cell__value) {
			font-size: 0.30rem;

			span {
				font-size: 0.28rem;
				color: #333;
			}
		}

		:deep(.van-field__control) {
			font-size: 0.30rem;
			height: 0.4rem;
			color: #000;
			background: none !important;

			&:autofill {
				background: #F8F8F8;; // 支持火狐
			}

			// 支持chrome
			&:-webkit-autofill,
			&:-webkit-autofill:hover,
			&:-webkit-autofill:focus,
			&:-webkit-autofill:active {
				transition-delay: 99999s;
				transition: background-color 99999s ease-out;
			}
		}

		:deep(.van-cell--clickable) {
			padding: 0.26rem 0.40rem;
		}

		:deep(.van-cell--clickable .van-cell__title) {
			color: #999999;
		}

		:deep(.van-icon) {
			font-size: 0.35rem;
		}

		.van-button {
			height: 0.9rem;
			line-height: 0.9rem;
			background: var(--main-color);
			border-color: transparent;
			color: #fff;

			:deep(span) {
				font-size: 0.32rem;
			}
		}

		.password-input {
			position: relative;

			.no-password {
				position: absolute;
				right: 0.40rem;
				top: 0.4rem;
				line-height: 0.24rem;
				color: #666;
				font-size: 0.26rem;
				display: inline-block;
			}

			.no-password:active {
				background: rgba(0, 0, 0, 0.1);
			}
		}

		p {
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-between;
			margin: 0 0.7rem;

			span {
				width: auto;
				font-size: 0.24rem;
				color: #333;
				line-height: 1.2;
				cursor: pointer;
			}
		}
	}
}
</style>