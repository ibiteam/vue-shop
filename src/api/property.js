import $http from '@/utils/http.js'

export function getCouponListAxios(info) {
    return $http.doGet('v1/my/coupons',info)
}

export function getRedPackListAxios(info) {
    return $http.doGet('v3/bonus',info)
}

export function getIntegralListAxios(info) {
    return $http.doGet('v3/integration/detail',info)
}