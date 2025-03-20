import $http from '@/utils/http'

export function accountLogin(data) {
    return $http.doPost('v4/user/login', data)
}

export function checkPhone(phone) {
    return $http.doGet('v3/user/checkPhone',{mobile_phone: phone})
}