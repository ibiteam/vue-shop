import $http from '@/utils/http.js'

export function refundListAxios(params){
    return $http.doGet('v1/order/apply_refund/list',params || {})
}

export function refundHistoryAxios(params){
    return $http.doGet('v1/order/apply_refund/log',params || {})
}

export function refundInitAxios(params){
    return $http.doGet('v1/order/apply_refund/init',params || {})
}

export function refundDetailAxios(params){
    return $http.doGet('v1/order/apply_refund/detail',params || {})
}

export function refundRevokeAxios(params){
    return $http.doPost('v1/order/apply_refund/revoke',params || {})
}

export function refundVerifyAxios(params){
    return $http.doGet('v1/order/apply_refund/verify',params || {})
}
