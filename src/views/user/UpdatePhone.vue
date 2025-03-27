<template>
    <div class="login-wrap">
        <common-header title="修改注册手机" :is_show_more="false"></common-header>
        <h3 v-if="!phoneX&&loadend" class="login-form-h3">绑定后可提高账号安全性，下次还可用该手机号进行登录</h3>
        <div class="login-form" v-if="loadend">
            <van-form @submit="onSubmitGet">
                <van-field
                    v-model="phone"
                    type="tel"
                    label=""
                    name="phone"
                    :disabled="!isVeryPhone"
                    :placeholder="!isVeryPhone?'请输入手机号码':'请输入绑定的新手机号'"
                /><!-- :rules="[{ required: true, message: '请填写手机号' }]"-->
                <van-field
                    v-model="verify"
                    type="tel"
                    name="code"
                    label=""
                    class="code_label"
                    placeholder="请输入短信验证码"
                >
                    <template #button>
                        <van-button size="small" :type="codeDisabled?'danger':'primary'" :disabled="codeDisabled" :class="{'codeing':!isFirst&&second>0}"
                                    @click.prevent="sendPhoneCode">
                            <span v-if="isFirst">获取验证码</span>
                            <span v-if="!isFirst&&second>0" style="color: #F71111;">重新获取<i v-html="second" style="font-style: normal;"></i>s</span>
                            <span v-if="!isFirst&&second==0" style="color: #F71111;">重新获取</span>
                        </van-button>
                    </template>
                </van-field>
                <div style="margin: 1.3rem 0.4rem 0.3rem;">
                    <van-button round block type="info" native-type="submit">
                        {{!isVeryPhone?'下一步':'提交'}}
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script setup>
import md5 from "js-md5";
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
const cns = getCurrentInstance().appContext.config.globalProperties
import {getUserInfoAxios} from "@/api/account.js";
import {sendCode, updatePhone} from "@/api/user";
const title = ref('')
const isVeryPhone = ref(false)
const phone = ref('')
const phoneX = ref('')
const verify = ref('')
const codeDisabled = ref(true)
const isFirst = ref(true)
const second = ref(0)
const loadend = ref(true)
const timer = ref(null)

onMounted(() => {
    getUserInfoAxios().then(res => {
        if (res.code == 200) {
            if(res.data.phone){
                const str = res.data.phone
                phone.value = str.substr(0, 3) + "****" + str.substr(7);
                phoneX.value = str
                loadend.value = true
            }else{
                isVeryPhone.value = true
                loadend.value = true
            }
        }else if(res.code==403){
            cns.appRoute('login', {}, {}, 'replace')
        }else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        console.log(err)
    })
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
    if (!isVeryPhone.value) {
        values.phone = phoneX.value
        if(!values.code){
            cns.$toast('请输入短信验证码')
            return;
        }
        this.$http.doPost("v3/primary/phone", values).then(res => {
            if (res.code == 200) {
                isVeryPhone.value = true
                isFirst.value=true
                second.value=0
                clearInterval(timer.value)
                phone.value = ''
                verify.value = ''
            } else {
                cns.$toast(res.message)
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        if(values.phone==''){
            cns.$toast('请输入手机号码')
            return
        }
        if (!cns.$public.isTelPhone(values.phone)) {
            cns.$toast('请输入正确的手机号码')
            return
        }
        if(phoneX.value && values.phone == phoneX.value){
            cns.$toast('修改的手机号不能与原手机号一致，请修改成其他手机')
            return
        }
        if (!values.code) {
            cns.$toast('请输入短信验证码')
            return;
        }
        updatePhone(values).then(res => {
            if (res.code == 200) {
                if(phoneX.value){
                    cns.$toast('操作成功')
                }else{
                    cns.$toast('绑定成功')
                }
                setTimeout(()=>{
                    cns.appRoute('security')
                },500)
            } else {
                cns.$toast(res.message)
            }
        }).catch(err => {
            console.log(err)
        })
    }
}
const sendPhoneCode = () => {
    let phone_format = phone.value
    if (phoneX.value && !isVeryPhone.value) {
        phone_format = phoneX.value
    }
    if (!cns.$public.isTelPhone(phone_format)) {
        cns.$toast('请输入正确的手机号码')
        return
    }
    if(second.value){
        cns.$toast('短信已经发送')
        return;
    }
    if (isVeryPhone.value) {
        if(phoneX.value && phone_format == phoneX.value){
            cns.$toast('修改的手机号不能与原手机号一致，请修改成其他手机')
            return
        }
    }
    let info = {
        mobile_phone: phone_format,
    }
    sendCode(info).then(res => {
        isFirst.value=false
        if (res.code == 200) {
            second.value=60
            countTime()
            cns.$toast(res.message)
        } else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        console.log(err)
    })
}
</script>

<style scoped lang="scss">
    .login-wrap {
        height: 100vh;
        background: #fff;
        .login-form-h3{
            width: 100%;
            padding: 0.2rem 0.4rem;
            line-height: 0.34rem;
            background: linear-gradient(270deg, rgba(252, 176, 17, 0.1), rgba(253, 201, 94, 0.1));
            color: #CD6A00;
            box-sizing: border-box;
        }
        :deep(.login-form) {
            margin: 0.4rem 0.3rem 0.2rem;
            position: relative;
            .van-popup--right.van-popup--round {
                border-radius: 0;
            }
            .van-field {
                padding: 0.30rem 0.40rem;
            }

            .van-field__control {
                font-size: 0.30rem;
                color: #000;
                background: none !important;
            }
            .van-field__control:disabled{
                color: #000;
                -webkit-text-fill-color: #000;
            }
            .van-field__label {
                span {
                    font-size: 0.30rem;
                    color: #000;
                }

            }
            .van-cell {
                margin-bottom: 0.3rem;
                padding: 0.30rem 0.40rem;

            }
            .van-cell {
                margin-bottom: 0.3rem;
                padding: 0.30rem 0.40rem;
                background: #F8F8F8;
                border-radius: 0.5rem;
                height: 1rem;
                &::after{
                    display: none;
                }
            }
            .van-field__control {
                font-size: 0.30rem;
                color: #000;
                width: 72%;
                height: 0.4rem;
                background: none !important;
                line-height: 0.4rem;
            }

            .van-cell__title {
                color: #999;
                width: 1.6rem;
                span {
                    font-size: 0.30rem;
                    line-height: 0.4rem;
                }
            }
            .van-button--small{
                padding: 0;
            }
            .van-cell__right-icon{
                position: relative;
                top: -1px;
            }
            .van-icon.van-icon-arrow::before{
                font-weight: bold;
                color: #333;
                font-size: 0.38rem!important;
            }
            .van-cell__value {
                font-size: 0.30rem;
                color: #333;
                line-height: 0.42rem;

                span {
                    font-size: 0.28rem;

                }
            }
           .gray_color{
               .van-cell__value {
                   color: #999;
               }
            }
            .van-icon {
                font-size: 0.35rem;
            }
            /* 通用 */
            ::-webkit-input-placeholder {
                color: #999;
                font-size: 0.30rem;
            }

            ::-moz-placeholder {
                color: #999;
                font-size: 0.30rem;
            }

            /* firefox 19+ */
            :-ms-input-placeholder {
                color: #999;
                font-size: 0.30rem;
            }

            /* ie */
            input:-moz-placeholder {
                color: #999;
                font-size: 0.30rem;
            }

            .van-button {
                height: 0.9rem;
                line-height: 0.9rem;
                background: var(--color);
                border-color: var(--color);

                span {
                    font-size: 0.32rem;
                }
            }
            .van-button.codeing{
                color: var(--color);
            }
            .van-field__button{
                display: flex;
                align-items: center;
            }
            .van-button--primary {
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
                    color: #333;
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

            .van-button--danger {
                width: 1.9rem;
                height: 0.4rem;
                background: none;
                padding-left: 0.3rem;
                border: none;
                box-shadow: none;
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
            .code_label .van-field__label span{
                line-height: 0.6rem;
            }
        }

    }
</style>
