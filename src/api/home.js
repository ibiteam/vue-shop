import $http from '@/utils/http.js'

export function getHomeData() {
    return $http.doGet('v4/home')
}