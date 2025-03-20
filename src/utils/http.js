import axios from 'axios'
import VueCookies from 'vue-cookies'
import request from './request'
import router from '@/router'
import {JSEncrypt} from 'encryptlong'
import { useConfigStore } from '@/stores'
import md5 from 'js-md5'
import dialog from "./dialog";
import publics from "./public";
import Loading from './loading'

function generateUUID() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(36)
    })
    return uuid
}

if (!localStorage.getItem('visitorId')) {
    localStorage.setItem('visitorId', generateUUID())
}
let encrypt = new JSEncrypt()
// 请求超时时间
axios.defaults.timeout = 15000

const lang = localStorage.getItem('locale')

// 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_APP_URL
// post请求头
axios.defaults.headers.Accept = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Access-From'] = 'h5'

function createParams(params = {}) {
    if (Object.prototype.toString.call(params).slice(8, -1) != 'FormData') {
        const info = { ...params }
        const signParams = request.sign(params, localStorage.getItem('visitorId'))
        const data = Object.assign({}, info, signParams)
        return data
    } else {
        return params
    }
}

// 请求拦截器
axios.interceptors.request.use(
    config => {
        if (config.loading) {
            Loading.start()
        }
        let token = VueCookies.get('access_token')
        let visitorId = ''
        if (localStorage.getItem('visitorId')) {
            visitorId = localStorage.getItem('visitorId')
        } else {
            visitorId = generateUUID()
            localStorage.setItem('visitorId', visitorId)
        }
        config.headers['Access-Token'] = token
        config.headers['Device-Id'] = visitorId
        config.headers['System-Type'] = 'other'

        if(config.method=='get'){
            config.params = createParams(config.params)
        }else {
            config.data = createParams(config.data)
        }
        return config
    },
    error => {
        return Promise.error(error)
    }
)

// 响应拦截器
axios.interceptors.response.use(
    response => {
        Loading.close()
        if (response.status === 200) {
            if (response.data.code === 403) {
                VueCookies.remove('app_token')
            } else if (response.data.code === 405) {
                dialog.alert({
                    message: '您没有权限访问'
                }).then(() => {
                    router.replace('/')
                })
            } else if (response.data.code === 4019) { // 代表加密方式有更改，需要重新请求config接口
                publics.getShopConfig().then((config)=>{
                    localStorage.setItem('sign_verify_type',config.sign_verify_type?config.sign_verify_type:'1')
                    window.location.reload()
                })
            } else if (response.data.code === 404) { // 需要重新请求config接口
                publics.getShopConfig()
            }
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        return Promise.reject(error)
    }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function doGet(url, param) {
    let params = param || {}

    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: request.sign(params),
            loading: true
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 */
function doPost(url, param) {
    let params = param || {}

    return new Promise((resolve, reject) => {
        axios.post(url, request.sign(params), {
            loading: true
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

/**
 * get方法，对应get请求，没有加载条
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function getNotLoading(url, param) {
    let params = param || {}

    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: request.sign(params),
            loading: false
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })

}

/**
 * post方法，对应post请求，没有加载条
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function postNotLoading(url, param) {
    let params = param || {}

    return new Promise((resolve, reject) => {
        axios.post(url, request.sign(params), {
            loading: false
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

/**
 * post方法，对应post请求，入参有空值不去除
 * @param {String} url [请求的url地址]
 */
function doPostNotRemove(url, param) {
    let params = param || {}

    return new Promise((resolve, reject) => {
        axios.post(url, request.signNotRemove(params), {
            loading: false
        })
            .then(res => {
                if (res.data.code !== 403) {
                    resolve(res.data)
                }else {
                    reject('403')
                }
            })
            .catch(err => {
                reject(err.data)
            })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 */
function doUpload(url, param) {
    let params = param || {}
    return new Promise((resolve, reject) => {
        axios.post(url, params, {
            loading: true
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.data)
            })
    })
}
/**
 * image 文件流上传
 * @param {String} url [请求的url地址]
 */
function doFile(url, param, method = 'post',other={}) {
    let params = param || {}
    var formData = new FormData()
    params.forEach(item => {
        formData.append("files[]", item, item.name);
    })
    // 增加其他需要上传参数
    if(Object.keys(other).length>0){
        Object.keys(other).map(its => {
            formData.append(its,other[its])
        })
    }
    return new Promise((resolve, reject) => {
        axios[method](url, formData, {
            loading: true,
            headers: {
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
                'type': 'file'
            },
            maxBodyLength: Infinity,
        }).then(res => {
            resolve(res.data)
        })
            .catch(err => {
                reject(err.data.data)
            })
    })

}
function changeBaseUrl(url) {
    const baseUrl = import.meta.env.VITE_APP_URL;

    if (!baseUrl) {
        return;
    }
    axios.defaults.baseURL = baseUrl;
}
/**
 * image 图片上传上传
 * @param {String} url [请求的url地址]
 */
function doFileNew(url, param, method = 'post') {
    changeBaseUrl(url);

    let params = param || {};
    let formData = new FormData();

    if (!params.file) {
        return Promise.reject('File is required');
    }

    formData.append('file', params.file);
    formData.append('auth', params.auth ? 1 : 0);
    formData.append('timeStamp', Math.floor(Date.now() / 1000));

    return axios({
        method,
        url,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(res => res.data)
        .catch(err => {
            return Promise.reject(err);
        });
}

export default {
    doPost,
    doGet,
    getNotLoading,
    postNotLoading,
    doPostNotRemove,
    doUpload,
    doFile,
    doFileNew
}
