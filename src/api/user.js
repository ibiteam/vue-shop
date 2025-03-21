import $http from '@/utils/http'

export function accountLogin(data) {
    return $http.doPost('v4/user/login', data)
}

export function checkPhone(phone) {
    return $http.doGet('v3/user/checkPhone', {mobile_phone: phone})
}

export function registerOrPhoneLogin({info, type, is_register}) {
    let url = type == '9' ? is_register == 0 ? 'v3/user/phoneLoginOrRegister' : 'v3/user/phoneLogin' : 'v3/user/register'
    return $http.doPost(url, info)
}

export function sendCode(info) {
    return $http.doPost('v3/user/sendCode', info)
}