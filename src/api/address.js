import $http from '@/utils/http.js'

export function getAddress(data) {
    return $http.doPost('v1/address/list', data)
}

export function setAddressDefault(id) {
    return $http.doPost('v1/address/default', { id })
}

export function deleteAddress(id) {
    return $http.doPost('v1/address/destroy', { id })
}

export function updateAddress(data) {
    return $http.doPost('v1/address/update', data)
}

// 省市区分组
export function getRegionGroup() {
    return $http.doPost('v1/region/group')
}

// 省市区
export function getRegion() {
    return $http.doPost('v1/region')
}

export function getAddressDetail(id) {
    return $http.doPost('v1/address/show', { id })
}