import md5 from 'js-md5'

/**
 * 对数组进行过滤
 * @param params
 * @returns {*}
 */
function filter(params) {
    for (let index in params) {
        if (index == 'sign' || index == 'file') {
            delete params[index]
        }
    }
    return params
}

/**
 * 对数组进行过滤，不去除空值
 * @param params
 * @returns {*}
 */
function filterNotRemove(params) {
    for (let index in params) {
        if (index == 'sign' || index == 'file') {
            delete params[index]
        }
    }
    return params
}

/**
 * 对对象进行排序
 * @param paras 参数对象
 * @returns {{}} 排序后的对象
 */
function sort(params) {
    let arr = []
    let obj = {}
    for (let key in params) {
        arr.push({
            'key': key,
            'val': params[key]
        })
    }
    arr.sort(by('key'))
    for (let k in arr) {
        let key = arr[k]['key']
        obj[key] = arr[k]['val']
    }
    return obj
}

/**
 * 对数组进行排序，支持多个参数进行排序 如by('age',by('name'))
 * @param name
 * @param minor
 * @returns {Function}
 */
function by(name, minor) {
    return function (o, p) {
        let a, b
        if (o && p && typeof o === 'object' && typeof p === 'object') {
            a = o[name]
            b = p[name]
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1
            }
            return typeof a < typeof b ? -1 : 1
        } else {
            throw ('error')
        }
    }
}

/**
 * 对数据进行签名
 * @param paras
 * @param api_key
 * @returns {{}|*}
 */
function sign(paras, api_key) {
    paras = filter(paras)
    paras['timeStamp'] = Date.parse(new Date()) / 1000
    paras = sort(paras)
    let str = linkStr(paras).substr(1)
    let sign = md5(str + api_key)
    paras['sign'] = sign
    return paras
}

/**
 * 对数据进行签名，不去除空值
 * @param paras
 * @param api_key
 * @returns {{}|*}
 */
function signNotRemove(paras, api_key) {
    paras = filterNotRemove(paras)
    paras['timeStamp'] = Date.parse(new Date()) / 1000
    paras = sort(paras)
    let str = linkStr(paras).substr(1)
    let sign = md5(str + api_key)
    paras['sign'] = sign
    return paras
}

/**
 * 对数据进行验证签名
 * @param paras
 * @param api_key
 * @returns {boolean}
 */
function verify(paras, api_key) {
    let sign = paras['sign']
    paras = filter(paras)
    let data = sort(paras)
    let str = linkStr(data).substr(1)
    let mysign = md5(str + api_key)
    return mysign == sign
}

/**
 * 签名数据转变为url
 * @param host
 * @param paras
 * @param api_key
 * @returns {string}
 */
function signToUrl(host, paras, api_key) {
    let data = sign(paras, api_key)
    host = host.replace(/\?$/gi, '')// 去掉host中最后的?
    return host + '?' + linkStr(data).substr(1)
}

/**
 * 将对象或者数组转变为url的字符串如&name=jin&age=12
 * @param paras
 * @param key
 * @returns {string}
 */
function linkStr(paras, key) {
    let paramStr = ''
    let t = typeof (paras)
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + paras
    } else {
        for (let i in paras) {
            let k = key == null ? i : key + (paras instanceof Array ? '[' + i + ']' : '.' + i)
            paramStr += linkStr(paras[i], k)
        }
    }
    return paramStr
}

/**
 * 数据转为md5
 * @param str
 */
function toMd5(str) {
    return md5(str)
}

export default {
    filter,
    sort,
    sign,
    verify,
    signToUrl,
    toMd5,
    signNotRemove
}
