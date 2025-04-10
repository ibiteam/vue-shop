import $http from './http'
import { useConfigStore } from "@/stores/index.js"
import { isSuccessCode, isUnLoginCode} from "@/utils/constant.js";

/** 手机号校验 **/
export function isTelPhone (value) {
    let isPhone = /^(13|14|15|17|18|16|19)\d{9}$/
    if (!isPhone.test(value)) {
        return false
    } else {
        return true
    }
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
 * 格式化金额
 * @param price  金额,支持小数
 * @param num    保留几位小数，默认保留两位
 * @returns {string}
 * 12345格式化为12,345.00   12345.6格式化为12,345.60   12345.67格式化为 12,345.67
 * 调用：formatCurrency("12345.675910", 3)，返回12,345.676
 */
export const formatCurrency = (price, num) => {
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

export function isEmail(value) {
    let email = /^([a-zA-Z\d])((\w|-)+\.?)+@([a-zA-Z\d]+\.)+[a-zA-Z]{2,6}$/
    if (!email.test(value)) {
        return false
    } else {
        return true
    }
}

export function isUserNameV3(value) {
    let isVery = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_]+$)[\da-zA-Z_]{3,22}$/
    let isC = /^[A-Za-z]+$/
    return isVery.test(value) || isC.test(value)
}

export function isUserName(value) {
    for(var i in value){
        var asc = value.charCodeAt(i)
        if((asc>=65 && asc<=90) || (asc>=97&&asc<=122)){
            return true
        }
    }
    return false
}

/**
 * 获取加密的手机号
 * phone
 * 例如 13355558888 -> 133****8888
 **/

export const getPrivacyPhone = (phone)=>{
    return phone.substr(0,3) + '****' + phone.substr(7,4)
}

/** 获取页面配置信息 */
export const getShopConfig = () => {
    const session_name = 'shop-config'
    return new Promise(resolve => {
         $http.doGet('v1/shop/config').then(res => {
             if (isSuccessCode(res)) {
                 if (sessionStorage.getItem(session_name)) {
                     sessionStorage.removeItem(session_name)
                 }
                 const shopConfig = res.data
                 shopConfig.expires_time = res.data.expires_time
                 sessionStorage.setItem(session_name, JSON.stringify(shopConfig))
                 resolve(res.data)
             } else {
                 resolve('')
             }
         })
    })
}

export const initShopConfig = () => {
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
        let color_number = 10
        while (color_number < 100) {
            root.style.setProperty(`--main-color-${color_number}`, shopConfig.shop_color + color_number)
            color_number += 10
        }
        const favicon = document.getElementById('favicon');
        // 修改 href 属性
        favicon.href = shopConfig.shop_logo;
        document.title = shopConfig.shop_name
        useConfigStore().setShopConfig(shopConfig)
        resolve(shopConfig)
    })
}
/** 校验用户是否登录 **/
export function requestLogin() {
    return new Promise(resolve => {
        $http.doGet('v1/auth/check_login').then(res=>{
            if (isSuccessCode(res)) {
                resolve(res.data.is_login)
            } else {
                resolve(false)
            }
        }).catch(()=>{
            resolve(false)
        })
    })
}
async function checkUserLogin() {
    let is_login = await requestLogin()
    return is_login
}
function isLogin() {
    $http.getNotLoading('v1/auth/check_login').then(res=>{
        let is_login = false
        if (res.data && res.data.is_login) {
            is_login = res.data.is_login
        }
        return is_login
    }).catch((err)=>{
        console.log(err)
    })
}
export function filterWhitespace(str){
    let newStr = str.replace(/\s*/g,"")
    return newStr;
}

export const debounce = (fnc,delay) => {
  let timer = null
  return function (args){
    if(timer){
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(()=>{
      fnc.apply(this,args)
    },delay)
  }
}

export const throttle = (func,delay) => {
  let last = 0
  return function (args){
    let now = Date.now()
    if(now - last > delay){
      func.apply(this,args)
      last = now
    }
  }
}
export default {
    isTelPhone,
    formatCurrency,
    isEmail,
    isUserNameV3,
    isUserName,
    getShopConfig,
    initShopConfig,
    requestLogin,
    checkUserLogin,
    filterWhitespace,
    getPrivacyPhone,
    isLogin,
    debounce,
    throttle
}
