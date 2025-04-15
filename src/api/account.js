import $http from '@/utils/http.js'

// 用户信息
export function getUserInfoAxios() {
    return $http.doGet('v1/account_set/get_info')
}

// 更换头像
export function updatePortraitAxios(url) {
    return $http.doPost('v1/account_set/avatar', {avatar: url})
}

// 修改用户名
export function updateUserNameAxios(user_name) {
    return $http.doPost('v1/account_set/user_name', {user_name: user_name})
}

// 修改昵称
export function updateNickNameAxios(nickname) {
    return $http.doPost('v1/account_set/nickname', {nickname: nickname})
}

