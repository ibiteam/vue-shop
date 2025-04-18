import { createRouter, createWebHistory } from 'vue-router'
import LayoutComponent from '@/components/layout/Layout'
import { getShopConfig } from '@/utils/public.js'
import page from "./page";
import user from "./user";
import account from "./account";
import good from "./good";
import property from "./property";
import mine from "./mine";
import order from "./order";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/',
            component: LayoutComponent,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('@/views/Home.vue'),
                },
                {
                    path: 'home/:id',
                    name: 'home_preview',
                    component: () => import('@/views/Home.vue'),
                },
                {
                    path: 'ucenter',
                    name: 'ucenter',
                    component: () => import('@/views/ucenter/Ucenter.vue'),
                },
                {
                  path: 'cart',
                  name: 'cart',
                  component: () => import('@/views/cart/Cart.vue'),
                },
                {
                  path: 'category',
                  name: 'category',
                  component: () => import('@/views/category/Category.vue'),
                  meta:{keepAlive:false}
                }
            ],
        },
        ...page,
        ...user,
        ...account,
        ...good,
        ...property,
        ...mine,
        ...order,
    ],
})

const goWechatAuth = async (to, next) => {
    // 保存当前路由地址，授权后还会跳到此地址
    let urlData = {name: to.name, query: to.query}
    localStorage.setItem('wxRedirectUrl', JSON.stringify(urlData))
    // 请求微信授权,并跳转到 /WxAuth 路由

    let appId = import.meta.env.VITE_APP_APP_ID
    if(appId){
        let redirectUrl = document.location.origin + '/auth'
        redirectUrl = encodeURIComponent(redirectUrl);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect`
    }else{
        next()
    }
}
router.beforeEach((to, from, next) => {
    if (!/micromessenger/i.test(navigator.userAgent)){
        next()
    }else {
        if (to.name === 'auth') {
            next()
            return
        }
        let wxUserInfo = localStorage.getItem('wxUserInfo')
        if (!wxUserInfo) {
            goWechatAuth(to, next)
        } else {
            let time = JSON.parse(wxUserInfo).time
            let now = new Date().getTime()
            if (now - time > 1800000) {
                localStorage.removeItem('wxUserInfo')
                goWechatAuth(to, next)
            } else {
                next()
            }
        }
    }

})

export default router
