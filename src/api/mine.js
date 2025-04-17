import $http from '@/utils/http.js'

export function collectGoodsAxios(info) {
    return $http.doGet('v1/my/collect',info)
}

export function eidtCollectGoodsAxios(info) {
    return $http.doPost('v1/my/batch/unfollow',info)
}

export function viewsHistoryAxios(info) {
    return $http.doGet('v1/my/views',info)
}

export function editHistoryAxios(info) {
    return $http.doGet('v1/my/batch/unfollow',info)
}