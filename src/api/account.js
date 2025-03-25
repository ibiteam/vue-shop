import $http from '@/utils/http.js'

export function getUserInfoAxios() {
    return $http.doGet('v3/set/getinfo')
}

export function uploadFileAxios(info) {
    return $http.doPost('upload', info)
}

export function updatePortraitAxios(url) {
    return $http.doPost('v3/set/portrait', {portrait: url})
}

export function updateUserNameAxios(user_name) {
    return $http.doPost('v3/set/user', {user_name: user_name})
}

export function updateNickNameAxios(nickname) {
    return $http.doPost('v3/set/nickname', {nickname: nickname})
}
