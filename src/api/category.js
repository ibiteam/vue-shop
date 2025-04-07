import $http from '@/utils/http'

export function getCategory(param){
  return $http.doGet('v1/category', param)
}

