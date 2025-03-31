<template>
    <div class="security-wrap">
        <common-header :title="title" :is_show_more="false"></common-header>
        <nav class="user-center" v-if="page_loading">
            <van-cell-group style="margin-top: 0.2rem;border-radius: 0.2rem;overflow: hidden">
                <van-cell title="登录密码" value="* 建议您定期修改密码以确保帐户的安全" is-link @click="appRoute('getPassword',{},{type:'password-edit'})"/>
                <van-cell title="绑定注册手机" value="* 为了您的账户安全请尽快绑定手机号码" is-link @click="appRoute('updatePhone')" v-if="!phone"/>
                <van-cell title="修改注册手机" :value="mobile_phone" is-link v-if="phone" @click="appRoute('updatePhone',{},{phone:phone})"/>
            </van-cell-group>
        </nav>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick,getCurrentInstance } from 'vue'
const cns = getCurrentInstance().appContext.config.globalProperties
import {getUserInfoAxios} from "@/api/account.js";
const title = ref('账户安全')
const page_loading = ref(false)
const mobile_phone = ref('')
const phone = ref('')

onMounted(() => {
    getUserInfo()
})
const getUserInfo = () => {
    getUserInfoAxios().then(res => {
        page_loading.value=true
        if (res.code == 200) {
            mobile_phone.value = res.data.mobile_phone
            phone.value = res.data.phone
        }else if(res.code==401){
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        console.log(err)
    })
}
</script>

<style scoped lang="scss">
.user-center ul {
    background: #fff;
}

.user-center ul li {
    line-height: 1rem;
    margin-left: 0.3rem;
    margin-right: 0.25rem;
}

.user-center ul li:last-child {
    border-bottom: none;
}

:deep(.user-center) {
    .van-cell {
        padding: 0.3rem;
    }

    .van-cell-group {
        margin-bottom: 0.2rem;
        .van-cell:first-child{
            .van-cell__value {
                flex: 3;
            }
        }
    }

    .van-cell__value {
        flex: 2;
        margin-right: 0.1rem;
        span{
            font-size: 0.22rem;
            color: #999999;
        }
    }

    .van-cell__title {
        span {
            font-size: 0.3rem;
            color: #333333;
        }
    }
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
    border-width: 0;
}
</style>
