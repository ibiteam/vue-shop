import $http from '@/utils/http.js'


export function  getDataAxios() {
  return $http.doGet('v1/cart/list')
}

export function deleteAxios(){
  return new Promise.resolve({"message":"\u5220\u9664\u6210\u529f","code":200,"data":[]})
}

export function newAddAttensionAxios(){
  return new Promise.resolve({"message":"\u5173\u6ce8\u6210\u529f","code":200,"data":[]})
}

export function editByShopAxios(){
  return  $http.doPost('v3/cart/editByShop', {seller_id: item.seller_id, is_pay: item.shop_select ? '1' : '0'})
}

export function editByGoodsAxios(params){
  return $http.doPost('v1/cart/change_check', params)
}

export function emptyInvalidAxios(){
  return $http.doPost('v3/cart/emptyInvalid')
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
  return $http.doGet('v3/cart/placeOrder')
}

export function cartAxios(){
  return $http.doGet('v3/buried/data/cart')
}
