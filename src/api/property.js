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

export function getRedPackListAxios(info) {
    return $http.doGet('v3/bonus',info)
}

export function getIntegralListAxios(info) {
    return $http.doGet('v3/integration/detail',info)
}