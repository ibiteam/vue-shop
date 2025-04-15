import $http from '@/utils/http.js'

export function refundHistory(params){
    return $http.doGet('v1/order/apply_refund/log',params || {})
}
