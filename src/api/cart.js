import $http from '@/utils/http.js'


export function  getDataAxios() {
  return $http.doGet('v1/cart/list')
}

export function deleteAxios(param){
  return $http.doPost('v1/cart/destroy',param)
}

export function newAddAttensionAxios(param){
  return $http.doPost('v1/cart/move_collect',param)
}

export function editByGoodsAxios(param){
  return $http.doPost('v1/cart/change_check', param)
}

export function emptyInvalidAxios(){
  return $http.doPost('v1/cart/empty_invalid')
}

export function getZhiRecommendAxios(){
  return $http.doGet('v3/home/getZhiRecommend')
}

export function getCouponAxios(param){
  return $http.doGet('v3/coupon/get_coupon', param)
}

export function usercouponAddAxios(param){
  return $http.doPost('v3/usercoupon/add', param)
}

export function placeOrderAxios(){
  return $http.doPost('v1/cart/place_order')
}

export function changeNumberAxios(param){
  return $http.doPost('v1/cart/change_number',param)
}

export function addGoodsToCart(param){
  return $http.doPost('v1/cart/store',param)
}