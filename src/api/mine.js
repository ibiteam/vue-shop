import $http from '@/utils/http.js'

export function collectGoodsAxios(info) {
    return $http.doGet('v3/collect/goods',info)
}

export function eidtCollectGoodsAxios(info) {
    return $http.doPost('v3/collect/goods/edit',info)
}