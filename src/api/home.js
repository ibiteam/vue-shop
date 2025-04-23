import $http from '@/utils/http.js'

export function getHomeData() {
    return $http.doGet('v1/home')
}

export function getHomePreviewData(data) {
    return $http.doGet('v1/preview', data)
}

export function getSpecialData(query) {
    return $http.doGet('v1/special', query)
}