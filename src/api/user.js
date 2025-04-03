import $http from '@/utils/http'

export function accountLogin(data) {
    return $http.doPost('v1/auth/login/password', data)
}

export function checkPhone(phone) {
    return $http.doGet('v1/auth/check-phone', {phone: phone})
}

export function registerOrPhoneLogin({info, action, is_register}) {
    const URL = 'v1/auth/login/phone'
    return $http.doPost(URL, info)
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

export function verifyPhone(info) {
    return $http.doPost('v1/primary/phone', info)
}

export function updatePhone(info) {
    return $http.doPost('v1/account_set/phone', info)
}
