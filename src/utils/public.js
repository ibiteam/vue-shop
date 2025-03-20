import $env from './env'
import $http from './http'
import { useConfigStore } from "@/stores/index.js"
import { Toast } from "vant";

function openVConsole() {
    if (($env.isTest() || $env.isDev())) {
        const script = document.createElement('script')
        script.src = "https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js"
        document.body.appendChild(script)
        script.onload = function () {
            new VConsole()
        }
    }
}

/** 手机号校验 **/
function isTelPhone (value) {
    let isPhone = /^(13|14|15|17|18|16|19)\d{9}$/
    if (!isPhone.test(value)) {
        return false
    } else {
        return true
    }
}

/** 密码类型校验 **/
function isPassWord (value) {
    let status = 0
    let isPwdLen = value.length >= 16 || value.length < 6
    let isTrim = /^[^\s].*[^\s]$/
    let isLetterNumber = /^(?!\d{6,8}$)(?! )(?=.*[A-Za-z])[a-zA-Z0-9_]|[^a-zA-Z0-9-=+_., *]{6,16}$/
    let test = /[`~!@#$%^&*()<>?:"{}\/;'[\]]/im
    if (isPwdLen || !isTrim.test(value)) {
        status = 1
    } else if (!isLetterNumber.test(value) && (!isLetterNumber.test(value) || test.test(value))) {
        status = 2
    } else if (test.test(value)) {
        status = 3
    } else {
        status = 0
    }
    return status
}

/**
 * 获取缓存数据
 * @param key  缓存的名称
 * @param value 如果为null是清除缓存，为false是获取缓存，有值的话是设置值
 * @returns {*}
 */
export function cache (key, value) {
    if (arguments.length === 1) {
        value = false
    }
    if (arguments.length === 2 && value === null) {
        return localStorage.removeItem(key)
    } else if (arguments.length === 1 && value === false) {
        // 浏览器缓存一天
        const timestamp = Date.parse(new Date()) / 1000
        const cacheTime = localStorage.getItem('cacheTime')
        if (!cacheTime || timestamp - cacheTime > 86400) {
            localStorage.setItem('cacheTime', timestamp)
            return false
        }
        return JSON.parse(localStorage.getItem(key))
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}
export function formatCash(str) {
    str = (str || 0).toString();
    if (str.length <= 3) {
        return str;
    }
    if(str.length%3==0){
        let l=str.length/3
        let arr=[]
        for(var j=0;j<l;j++){
            arr.push(str.substr(j,3))
        }
        return arr.join(",");
    }
    var arr = [];

    for (var i = 1, len = str.length; i < len; i++) {
        if (str.length % 3 && i === 1) {
            arr.push(str.substr(0, str.length % 3));
        }
        if (i % 3 === 0) {
            arr.push(str.substr(i - 2, 3));
        }

    }

    return arr.join(",");
}
export function copyText(text){ //复制到剪切栏
    if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(text);
    } else {
        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        // 隐藏此输入框
        textarea.style.position = 'fixed';
        textarea.style.clip = 'rect(0 0 0 0)';
        textarea.style.top = '10px';
        // 赋值
        textarea.value = text;
        // 选中
        textarea.select();
        // 复制
        document.execCommand('copy', true);
        // 移除输入框
        document.body.removeChild(textarea);
    }
}

/**
 * 对多为小数进行四舍五入，保留 v 位小数
 * @param num 需处理的数字
 * @param v   要保留的的小数位数
 */
const decimal = (num, v = 2) => {
    var vv = Math.pow(10, v) // 获取10的v次幂
    if (num <= 0) {
        num = 0
        num = num.toFixed(v)
    }
    return (Math.round(num * vv) / vv).toFixed(v)
}

/**
 * 格式化金额
 * @param price  金额,支持小数
 * @param num    保留几位小数，默认保留两位
 * @returns {string}
 * 12345格式化为12,345.00   12345.6格式化为12,345.60   12345.67格式化为 12,345.67
 * 调用：formatCurrency("12345.675910", 3)，返回12,345.676
 */
const formatCurrency = (price, num) => {
    num = num > 0 && num <= 20 ? num : 2
    let minus = String(price).indexOf('-') >= 0 ? '-' : ''
    price = String(price).indexOf('-') >= 0 ? String(price).replace('-','') : price
    price = parseFloat((price + '').replace(/[^\d\.-]/g, '')).toFixed(num) + ''
    var l = price.split('.')[0].split('').reverse(),
        r = price.split('.')[1]
    var t = ''
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '')
    }
    return minus + t.split('').reverse().join('') + '.' + r
}

function isEmail(value) {
    let email = /^([a-zA-Z\d])((\w|-)+\.?)+@([a-zA-Z\d]+\.)+[a-zA-Z]{2,6}$/
    if (!email.test(value)) {
        return false
    } else {
        return true
    }
}

/**
 * 获取加密的手机号
 * phone
 * 例如 13355558888 -> 133****8888
 **/

const getPrivacyPhone = (phone)=>{
    return phone.substr(0,3) + '****' + phone.substr(7,4)
}

/** 获取页面配置信息 */
const getShopConfig = () => {
    const session_name = 'shop-config'
    return new Promise(resolve => {
        // $http.doGet('v4/common_config').then(res => {
        //     if (res.code == 200) {
        //         if (sessionStorage.getItem(session_name)) {
        //             sessionStorage.removeItem(session_name)
        //         }
        //         const shopConfig = res.data
        //         shopConfig.expires_time = data.expires_time
        //         sessionStorage.setItem(session_name, JSON.stringify(shopConfig))
        //         resolve(res.data)
        //     } else {
        //         Toast(res.message)
        //         resolve('')
        //     }
        // })
        let data = {
            "privacy_policy": "52585",
            "shop_color": "#1050A9",
            "shop_desc": "多多22",
            "shop_logo": "",
            "shop_name": "涂多多",
            "user_agree": "78248",
            "wap_logo": "",
            "wap_logo_color": "",
            "platform_id": "toodudu",
            "expires_time": 1742486399
        }
        if (sessionStorage.getItem(session_name)) {
            sessionStorage.removeItem(session_name)
        }
        const shopConfig = data
        shopConfig.expires_time = data.expires_time
        sessionStorage.setItem(session_name, JSON.stringify(shopConfig))
        resolve(data)
    })
}

const initShopConfig = () => {
    const session_name = 'shop-config'
    return new Promise(async resolve => {
        let shopConfig = {}
        if (sessionStorage.getItem(session_name)) {
            //  判断当 shop_config 缓存时间大于等于1天，则清除重新获取
            shopConfig = JSON.parse(sessionStorage.getItem(session_name))
            const now_time = Math.round(new Date() / 1000)
            if (((now_time - shopConfig.expires_time) / 3600 / 24) >= 1) {
                sessionStorage.removeItem(session_name)
                shopConfig = await getShopConfig()
            }
        } else {
            shopConfig = await getShopConfig()
        }
        let root = document.querySelector(":root")
        root.style.setProperty("--main-color", shopConfig.shop_color)
        root.style.setProperty("--main-color-30", shopConfig.shop_color+'30')
        root.style.setProperty("--main-color-90", shopConfig.shop_color+'90')
        useConfigStore().setShopConfig(shopConfig)
        resolve(shopConfig)
    })
}
/** 校验用户是否登录 **/
function requestLogin() {
    return new Promise(resolve => {
        $http.doGet('v3/user/checkLogin').then(res=>{
            if (res.code == 200) {
                resolve(res.data.is_login)
            } else {
                resolve(false)
            }
        })
    })
}
async function checkUserLogin() {
    let is_login = await requestLogin()
    return is_login
}

function filterWhitespace(str){
    let newStr = str.replace(/\s*/g,"")
    return newStr;
}
export default {
    openVConsole,
    isTelPhone,
    isPassWord,
    cache,
    decimal,
    formatCurrency,
    isEmail,
    getShopConfig,
    initShopConfig,
    checkUserLogin,
    filterWhitespace
}
