export const isSuccessCode = (res) => {
    return res.code == 200
}

export const isUnLoginCode = (res) => {
    return res.code == 401
}

export const isTest = () => {
    return import.meta.env.VITE_APP_CURRENTMODE == 'stage'
}

export const isProd = () => {
    return import.meta.env.VITE_APP_CURRENTMODE == 'prod'
}

export default {
    isSuccessCode,
    isUnLoginCode
}