import $http from '@/utils/http'

/**
 * 全局公用接口
 */

// 获取页面配置信息
export const shopCommonConfig = () => {
    return $http.getNotLoading('v4/common_config')
}
