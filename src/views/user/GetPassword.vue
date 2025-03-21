<template>
    <div class="login-wrap">
        <common-header :title="title"></common-header>
        <div class="password-tip">密码长度{{ minNumber }}-{{ maxNumber }}位</div>
        <div class="login-form">
            <van-form @submit="onSubmitGet">
                <van-field
                    v-model="phone"
                    type="tel"
                    name="phone"
                    :disabled="route.query.phone"
                    placeholder="请输入手机号"
                    label=""
                />
                <van-field
                    v-model="code"
                    type="tel"
                    name="code"
                    placeholder="请输入验证码"
                    label=""
                    autocomplete="new-password"
                >
                    <template #button>
                        <van-button size="small" :type="codeDisabled?'danger':'primary'" :disabled="codeDisabled"
                                    :class="{'codeing':!isFirst&&second>0}"
                                    @click.prevent="sendPhoneCode">
                            <span v-if="isFirst">获取验证码</span>
                            <span v-if="!isFirst&&second>0" style="color: #F71111;">重新获取<i v-html="second" style="font-style: normal;"></i>s</span>
                            <span v-if="!isFirst&&second==0" style="color: #F71111;">重新获取</span>
                        </van-button>
                    </template>
                </van-field>
                <van-field v-model="password" type="password" label="" placeholder="请输入新密码"
                           name="password"/>
                <van-field v-model="password_confirmation" type="password" label="" placeholder="请再次输入密码"
                           name="password_confirmation"/>
                <div style="margin: 1.3rem 0.4rem 0.3rem;">
                    <van-button round block type="info" native-type="submit">
                        提 交
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script setup>
	import md5 from "js-md5";
    import { ref, watch, onMounted, getCurrentInstance } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
	import { checkPhone, sendCode, updatePassword } from "@/api/user";

	const cns = getCurrentInstance().appContext.config.globalProperties

    const route = useRoute()
    const router = useRouter()

    const phone = ref('')
    const code = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const codeDisabled = ref(true)
    const isFirst = ref(true)
    const passwordType = ref('password-forget')
    const title = ref('修改密码')
    const second = ref(0)
    const timer = ref(null)
    const minNumber = ref(6)
    const maxNumber = ref(15)

    watch(() => phone.value, (val) => {
        if (val.length) {
            codeDisabled.value = false
        } else {
            codeDisabled.value = true
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

    const onSubmitGet = (values) => {
        if (values.phone == '') {
            cns.$toast('请输入手机号码')
            return
        }
        if (!cns.$public.isTelPhone(values.phone) && !route.query.phone) {
            cns.$toast('请输入正确的手机号码')
            return
        }
		checkPhone(route.query.phone ? route.query.phone : phone.value).then(res => {
            if (res.code == 200 && res.data.is_register) {
                if (values.code == '') {
                    cns.$toast('请输入短信验证码')
                    return
                }
                if (values.password == '') {
                    cns.$toast('请输入新密码')
                    return
                }
                if(values.password.length < minNumber.value || values.password.length > maxNumber.value){
                    let textNumber = '长度只能在' + minNumber.value + '-' + maxNumber.value + '个字符之间';
                    cns.$toast(textNumber)
                    return;
                }
                if (values.password_confirmation == '') {
                    cns.$toast('请再次输入密码')
                    return
                }
                if (values.password_confirmation !== values.password) {
                    cns.$toast('您两次输入的密码不同，请重试')
                    return
                }
                values.password = md5(values.password)
                values.password_confirmation = md5(values.password_confirmation)
                values.phone = route.query.phone ? route.query.phone : phone.value
	            updatePassword(values, passwordType.value).then(res => {
                    if (res.code == 200) {
                        if (passwordType.value == 'password-edit') {
                            cns.$toast('修改密码成功！请重新登录账号。')
                            cns.$cookies.remove('m-token')
                            setTimeout(() => {
                                router.replace({name:'login'})
                            }, 1000)
                        } else {
                            cns.$toast('重置密码成功！')
                            setTimeout(() => {
                                router.replace({name:'login'})
                            }, 1000)
                        }
                    } else {
                        cns.$toast(res.message)
                    }
                }).catch(err => {
                    router.back()
                })
            } else {
                cns.$toast('该手机号未注册，请重新输入')
            }
        })
    }

    const sendPhoneCode = () => {
        if (!cns.$public.isTelPhone(phone.value) && !route.query.phone) {
            cns.$toast('请输入正确的手机号码')
            return
        }
        if (second.value) {
            return;
        }
	    checkPhone(route.query.phone ? route.query.phone : phone.value).then(res => {
            if (res.code == 200 && res.data.is_register) {
                let info = {
                    phone: route.query.phone ? route.query.phone : phone.value,
                    action: passwordType.value
                }
	            sendCode(info).then(ret => {
                    isFirst.value = false
                    if (ret.code == 200) {
                        second.value = 60
                        countTime()
                        cns.$toast('短信已经发送')
                    } else {
                        cns.$toast(ret.message)
                    }
                }).catch(err => {
                })
            } else {
                cns.$toast('该手机号未注册，请重新输入')
            }
        })
    }

    onMounted(() => {
        passwordType.value = route.query.type
        if (route.query.phone) {
            phone.value = cns.$public.getPrivacyPhone(route.query.phone)
        }
        title.value = passwordType.value == 'password-edit' ? '修改密码' : '找回密码'
    })
</script>

<style scoped lang="scss">
@use "@/assets/css/login.scss" as *;
.password-tip{
	width: 100%;
	line-height: 0.4rem;
	background: #FFFAF5 url("@/assets/images/user/info.png") no-repeat 0.38rem 0.21rem;
	color: #FF9001;
	background-size: 0.28rem 0.28rem;
	padding:0.16rem 0.3rem .16rem .85rem;
	font-size: 0.24rem;
	box-sizing: border-box;
}
.login-wrap {
	background: #fff;

	.login-form {
		position: relative;
		padding:0.4rem 0.3rem;
		:deep(.van-field__button){
			display: flex;
			align-items: center;
		}

		:deep(.van-field .van-button){
			width: 2.1rem;
			height: 0.4rem;
			padding-left: 0.3rem;
			background: none;
			border: none;
			box-shadow: none;
			text-align: right;
			position: relative;
			span {
				font-size: 0.28rem;
				color: #999;
				line-height: 0.4rem;
			}
			&::after{
				content: '';
				height: 0.26rem;
				width: 1px;
				background: #e8e8e8;
				position: absolute;
				left: 0;
				top: 0;
				margin: auto;
				bottom: 0;
			}
		}
		:deep(.van-field .van-button--primary) {
			span {
				color: #333;
			}
		}
	}

}
</style>
