import $http from '@/utils/http.js'

export function getGoodData(id, sku_id) {
    return $http.doGet(`v1/goods/${id}`,{ sku_id })
}

export function updateSku({no, unique}) {
    return $http.doGet(`v1/goods/${no}/${unique}`)
}

export function checkNumber({no, sku_id, number}){
    return $http.doGet(`v1/goods/${no}/check_number`,{sku_id, number})
}

export function goodsCollect({ no, value }) {
    const URL = value ? 'v1/goods/follow' : 'v1/goods/unfollow'
    return $http.doGet(URL, { no })
}