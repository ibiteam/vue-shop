import $http from '@/utils/http.js'

export function getCheckoutData(params) {

    const URL = params ? 'v1/order/direct/init' : 'v1/order/cart/init'
    return $http.doGet(URL, params || {})
}

export function checkoutDone(params) {
    const URL = params && params.no ? 'v1/order/direct/done' : 'v1/order/cart/done'
    return $http.doPost(URL, params || {})
}

export function getOrderSuccess(no){
  return $http.doGet('v1/order/done/success',{no})
}

export function payInit(no){
  return $http.doGet('v1/order/cash',{no})
}

export function wxPay(params){
  return $http.doPost('v1/order/cash/wechat/pay',params)
}

export function getOrderList(params){
    return $http.doGet('v1/order/my/index',params || {})
}

export function cancelOrderAxios(params){
    return $http.doPost('v1/order/my/cancel',params || {})
}

export function deleteOrderAxios(params){
    return $http.doPost('v1/order/my/destroy',params || {})
}

export function confirmOrderAxios(params){
    return $http.doPost('v1/order/my/receive',params || {})
}

export function editOrderAddressAxios(params){
    return $http.doGet('v1/order/my/address/edit',params || {})
}

export function updateOrderAddressAxios(params){
    return $http.doPost('v1/order/my/address/update',params || {})
}

export function getOrderDetail(params){
    return $http.doGet('v1/order/my/detail',params || {})
}

export function initEvaluate(params){
    return $http.doGet('v1/order/my/evaluate/init',params || {})
}

export function storeEvaluate(params){
    return $http.doPost('v1/order/my/evaluate/store',params || {})
}
