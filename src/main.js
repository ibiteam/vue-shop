import '@/assets/css/base.css'
import '@/assets/css/iconfont.css'
import 'vant/lib/index.css';
import { createApp } from 'vue'
import pinia from '@/stores/index'
import mitt from 'mitt'
import vant from 'vant'
import $http from '@/utils/http'
import $public from '@/utils/public'
import $dialog from '@/utils/dialog'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'
// 公用组件
import CommonHeader from '@/components/layout/Navbar'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vant)
app.config.globalProperties.$cookies = VueCookies
app.config.globalProperties.$bus = mitt()
app.config.globalProperties.$public = $public
app.config.globalProperties.$http = $http
app.config.globalProperties.$dialog = $dialog
app.component('CommonHeader', CommonHeader)
app.mount('#app')
