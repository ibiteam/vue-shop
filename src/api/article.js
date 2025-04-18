import $http from '@/utils/http.js'

// 协议详情
export function artilceDetailAxios() {
    return $http.doGet('v1/article/detail')
}



