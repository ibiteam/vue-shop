import $http from '@/utils/http.js'

export function getCouponListAxios(info) {
    return $http.doGet('v3/usercoupon',info)
}

export function couponExchangeAxios(info) {
    return $http.doPost('v3/coupon/exchange',info)
}

export function couponUnchangeListAxios(info) {
    return $http.doPost('v3/usercoupon/newList',info)
}
