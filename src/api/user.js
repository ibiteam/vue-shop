import $http from '@/utils/http'

export function accountLogin(data) {
    const openid = localStorage.getItem('wxopenid') || ''
    return $http.doPost('v1/auth/login/password', {...data, openid})
}

export function registerOrPhoneLogin(data) {
    const openid = localStorage.getItem('wxopenid') || ''
    return $http.doPost('v1/auth/login/phone', {...data, openid})
}

// 退出登录
export function logOutAxios() {
    return $http.doPost('v1/auth/logout')
}

export function sendCode(info) {
    if(info.action == 'password-edit') delete info.phone
    return $http.doPost('v1/sms-action', info)
}

export function updatePassword(info, action) {
    const URL = action == 'password-forget' ? 'v1/auth/forget/password' : 'v1/auth/edit/password'
    if(action == 'password-edit') delete info.phone
    return $http.doPost(URL, info)
}

export function verifyPhone(info) {//验证手机号
    return $http.doPost('v1/check/action/code', info)
}

export function updatePhone(info) {//绑定/修改手机号
    return $http.doPost('v1/account_set/phone', info)
}

export function wechatAuth(code) {
    return $http.doGet('v1/wechat/auth', {code})
}