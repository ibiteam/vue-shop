import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import request from './request'
import md5 from "js-md5";
import Loading from './loading'

const { cookies } = useCookies()

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
// 请求超时时间
axios.defaults.timeout = 15000

// 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
// axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_APP_URL
// post请求头
axios.defaults.headers.Accept = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['source'] = 'H5'

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
        let token = cookies.get('m-token')
        let visitorId = ''
        if (localStorage.getItem('visitorId')) {
            visitorId = localStorage.getItem('visitorId')
        } else {
            visitorId = generateUUID()
            localStorage.setItem('visitorId', visitorId)
        }
        config.headers['Device-Id'] = visitorId
        config.headers['System-Type'] = 'other'
        config.headers['Authorization'] = token ? 'Bearer ' + token : ''
        if(config.method=='get'){
            config.params = createParams(config.params)
        }else {
            config.data = createParams(config.data)
            if(config.url == 'v1/sms-action'){
                let phoneVerify = config.data.phone ? `${config.data.phone}${config.data.action}${config.data.timestamp}` : `${config.data.action}${config.data.timestamp}`
                config.headers['phone-verify'] = md5(phoneVerify)
            }
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
            if (response.data.code === 401) {
                cookies.remove('m-token')
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
                reject(err)
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
                reject(err)
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
function doFile(url, param, method = 'post') {
    changeBaseUrl(url);

    let params = param || {};
    let formData = new FormData();

    if (!params.file) {
        return Promise.reject('File is required');
    }

    formData.append('file', params.file);
    formData.append('auth', params.auth ? 1 : 0);
    formData.append('timestamp', Math.floor(Date.now() / 1000));

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
    doFile
}
