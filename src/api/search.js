import $http from '@/utils/http'


export function searchShopAxios(params){
  return $http.doPost("v3/search/shop", params)
}

export function searchAxios(params){
  return $http.doPost("v1/search/goods", params)
}

export function searchKeywordsAxios(params){
  return $http.doGet("v1/search/keywords",params)
}

