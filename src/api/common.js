import $http from '@/utils/http'

/**
 * 全局公用接口
 */

// 获取页面配置信息
export const shopCommonConfig = () => {
    return $http.getNotLoading('v1/shop/config')
}

export const getChatUrl = (params) => {
    return $http.getNotLoading('v1/chat/url', params)
}

// 上传图片
export function uploadFileAxios(info) {
    return $http.doFile('v1/upload', info)
}
