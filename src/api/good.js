import $http from '@/utils/http.js'

export function getGoodData(id) {
    return $http.doGet(`v1/goods/${id}`)
}

