import $http from '@/utils/http.js'

export function getData() {
    return $http.doGet('v4/user/my')
}

export function getUserData() {
    return $http.doGet('v3/user')
}
