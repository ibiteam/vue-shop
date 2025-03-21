import $http from '@/utils/http'

export function accountLogin(data) {
    return $http.doPost('v1/auth/login-by-password', data)
}

export function checkPhone(phone) {
    return $http.doGet('v1/auth/check-phone', {phone: phone})
}

export function registerOrPhoneLogin({info, action, is_register}) {
    const URL = action == 'register' ? is_register == 0 ? 'v1/auth/login-register-by-phone' : 'v1/auth/register-by-phone' : 'v1/auth/login-by-phone'
    return $http.doPost(URL, info)
}

export function sendCode(info) {
    return $http.doPost('v1/sms-action', info)
}

export function updatePassword(info, action) {
    const URL = action == 'password-forget' ? 'v1/auth/forget-password' : 'v1/auth/edit-password'
    return $http.doPost(URL, info)
}