import $http from '@/utils/http.js'

export function getAddress() {
    return $http.doPost('v1/address/list')
}

export function setAddressDefault(id) {
    return $http.doPost('v1/address/default', { id })
}

export function deleteAddress(id) {
    return $http.doPost('v1/address/destroy', { id })
}