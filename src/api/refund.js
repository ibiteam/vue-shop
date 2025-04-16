import $http from '@/utils/http.js'

export function refundListAxios(params){
    return $http.doGet('v1/order/apply_refund/index',params || {})
}

export function refundHistoryAxios(params){
    return $http.doGet('v1/order/apply_refund/log',params || {})
}
