import $http from '@/utils/http'


const searchShopAxios = (params) => {
  return $http.doPost("v3/search/shop", params)
}

const searchAxios = (params) => {
  return $http.doPost("v3/search", params)
}

const searchKeywordsAxios = (params) => {
  return $http.doPost("v3/search/keywords",params)
}

export default {
  searchShopAxios,
  searchAxios,
  searchKeywordsAxios
}
