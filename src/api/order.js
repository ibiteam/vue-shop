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