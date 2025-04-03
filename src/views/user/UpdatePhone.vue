<template>
    <div class="login-wrap">
        <common-header :title="title" :is_show_more="false"></common-header>
        <div class="phone-tip" v-if="phoneType == 'phone-bind'">绑定后可提高账号安全性，下次还可用该手机号进行登录</div>
        <div class="login-form">
            <van-form @submit="onSubmitGet">
                <van-field
                    v-model="phone"
                    type="tel"
                    name="phone"
                    :disabled="!isVeryPhone"
                    :placeholder="!isVeryPhone?'请输入手机号码':'请输入绑定的新手机号'"
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
                            <span v-if="!isFirst&&second>0">重新获取<i v-html="second" style="font-style: normal;"></i>s</span>
                            <span v-if="!isFirst&&second==0">重新获取</span>
                        </van-button>
                    </template>
                </van-field>
                <div style="margin: 1.3rem 0.4rem 0.3rem;">
                    <van-button round block type="info" native-type="submit">
                        {{!isVeryPhone?'下一步':'提 交'}}
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sendCode, verifyPhone, updatePhone} from "@/api/user";

const cns = getCurrentInstance().appContext.config.globalProperties

const route = useRoute()
const router = useRouter()

const phone = ref('')
const code = ref('')
const codeDisabled = ref(true)
const isFirst = ref(true)
const phoneType = ref('phone-bind')
const title = ref('绑定手机号')
const second = ref(0)
const timer = ref(null)
const isVeryPhone = ref(true)

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
    if (values.code == '') {
        cns.$toast('请输入短信验证码')
        return
    }
    values.phone = route.query.phone ? route.query.phone : phone.value
    if (isVeryPhone.value){//绑定手机号
        submitPhone(values)
    }else{//验证手机号
        doVerifyPhone(values)
    }
}
const doVerifyPhone = (values) => {
    verifyPhone(values).then(res => {
        if (res.code == 200) {
            isVeryPhone.value = true
            isFirst.value = true
            second.value = 0
            phone.value = ''
            code.value = ''
            clearInterval(timer.value)
        } else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        router.back()
    })
}
const submitPhone = (values) => {
    updatePhone(values, phoneType.value).then(res => {
        if (res.code == 200) {
            if (phoneType.value == 'phone-update') {
                cns.$toast('修改手机号成功！请重新登录账号。')
                cns.$cookies.remove('m-token')
                setTimeout(() => {
                    router.replace({name:'login'})
                }, 1000)
            } else {
                cns.$toast('绑定手机号成功！')
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
}
const sendPhoneCode = () => {
    if (!cns.$public.isTelPhone(phone.value) && !route.query.phone) {
        cns.$toast('请输入正确的手机号码')
        return
    }
    if (second.value) {
        return;
    }
    let info = {
        phone: route.query.phone ? route.query.phone : phone.value,
        action: phoneType.value
    }
    submitSendCode(info)
}

const submitSendCode = (info)=>{
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
}

onMounted(() => {
    phoneType.value = route.query.type?route.query.type:'phone-bind'
    if (route.query.phone) {
        phone.value = cns.$public.getPrivacyPhone(route.query.phone)
        isVeryPhone.value = false
    }
    title.value = phoneType.value == 'phone-update' ? '修改手机号' : '绑定手机号'
})
</script>


<style scoped lang="scss">
@use "@/assets/css/login.scss" as *;
.phone-tip{
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
                color: var(--color-text-desc);
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
                color: var(--color-text);
            }
        }
    }

}
</style>
