<template>
    <div class="set-wrap">
        <common-header :title="title" :is_show_more="false"></common-header>
        <nav class="user-center">
            <ul class="user-basic MB20" @click="handleClickRouterLinkBefore({ name: 'userInfo' })">
                <li>
                    <div class="logo-img">
                        <img :src="portrait" v-if="portrait"/>
                        <img src="@/assets/images/ucenter/header_photo_1.png" v-else/>
                    </div>
                    <div class="user_name">
                        <template v-if="is_login">
                            <p class="text" v-if="nickname">{{ nickname }}</p>
                            <p class="username" v-else>未设置昵称</p>
                            <p class="text">用户名：{{user_name}}</p>
                        </template>
                        <template v-else>
                            <h1>登录/注册</h1>
                        </template>
                    </div>
                    <van-icon name="arrow" class="fr"/>
                </li>
            </ul>
            <van-cell-group style="border-radius: 0.2rem;overflow: hidden;">
                <van-cell title="账户与安全" is-link @click="handleClickRouterLinkBefore({ name: 'accountSecurity' })"/>
            </van-cell-group>
            <van-cell-group style="border-radius: 0.2rem;overflow: hidden;">
                <van-cell title="意见反馈" is-link @click="handleClickRouterLinkBefore({ name: 'feedback' })"/>
            </van-cell-group>
            <div style="position: fixed;bottom: 0.94rem;left: 0;right: 0;margin: auto; width: 6.9rem;height: 0.88rem;" class="breathe" v-if="is_login">
                <div class="botom" @click="logOut()">退出账号</div>
            </div>
        </nav>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
const cns = getCurrentInstance().appContext.config.globalProperties
import { showToast } from 'vant';
import {logOutAxios} from "@/api/account.js";
const title = ref('用户设置')
const nickname = ref('')
const portrait = ref('')
const user_name = ref('')
const is_login = ref(true)

onMounted(() => {

})

const handleClickRouterLinkBefore = async() => {
    is_login.value = await cns.$public.requestLogin()
    if (is_login.value) {
        const { name, query, params } = data
        cns.appRoute(name, params, query)
    } else {
        cns.appRoute('login')
    }
}
const logOut = () => {
    logOutAxios().then(res => {
        if (res.code == 200) {
            cns.$cookies.remove('app_token')
            localStorage.removeItem('wxUserInfo')
            localStorage.setItem('wxlogout','true')
            cns.appRoute('ucenter',{},{},'replace')
        }else {
            showToast(res.message)
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
    padding: 0.3rem 0.3rem 0.3rem 0.46rem;
}

.user-center ul li:last-child {
    border-bottom: none;
}
:deep(.user-center) {
    .van-cell {
        padding: 0.3rem 0.3rem;
        line-height: 0.45rem;
    }
    .van-cell::after{
        border-color: #e5e5e5;
    }
    .van-cell-group {
        margin-bottom: 0.2rem;
    }

    .van-cell__value {
        flex: 2;
    }

    .van-cell__title {
        line-height: 0.4rem;
        display: flex;
        align-items: center;
        span {
            font-size: 0.30rem;
            color: #333;
            line-height: 0.45rem;
            height: 0.45rem;
            display: inline-block;
        }
    }
}

.user-basic {
    height: 1.75rem;
    overflow: hidden;
    position: relative;

    .van-icon {
        position: absolute;
        right: 0.30rem;
        top: 50%;
        margin-right: 0.2px;
        margin-top: -0.15rem;
        font-size: 16px;
        color: #969799;
    }
}

.user-basic li .logo-img {
    width: 1.08rem;
    height: 1.08rem;
    border: 1px solid #ccc;
    border-radius: 1rem;
    -moz-border-radius: 1rem;
    float: left;
    overflow: hidden;
    text-align: center;
    position: relative;
}

.user-basic li .logo-img img {
    width: auto;
    height: auto;
    max-height: 100%;
    max-width: 100%;
    vertical-align: middle;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}

.user-basic li .user_name {
    line-height: 0.55rem;
    padding-top: 0.05rem;
    padding-left: 1.28rem;

}
.user-basic li .user_name ::v-deep .username,
.user-basic li .user_name h1 { font-weight: bold; font-size: 0.36rem; color: #444444; }
.user-basic li .user_name h1 { line-height: 1.08rem; }

.user-basic li .user_name>.text {
    height: 0.55rem;
    color: #666666;
    overflow: hidden;
    font-size: 0.26rem;
}

.user-basic li .user_name>.text:first-child {
    font-size: 0.36rem;
    color: #333;
    font-weight: bold;
}

.log_pssw {
    float: left;
}

.botom {
    width: 6.9rem;
    height: 0.88rem;
    line-height: 0.88rem;
    font-size: 0.32rem;
    text-align: center;
    color: var(--color);
    background: #fff;
    border-radius: 3.3rem;
    border: 1px solid var(--color);
    font-weight: bold;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
    border-width: 0;
}
</style>
