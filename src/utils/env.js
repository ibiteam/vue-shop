function isLocal() {
    return getMode() === 'local'
}

function isDev() {
    return getMode() === 'development'
}

function isProd() {
    return getMode() === 'production'
}

function isTest() {
    return getMode() === 'production'
}

function getMode() {
    return import.meta.env.VITE_USER_NODE_ENV
}

function getDomain() {
    return import.meta.env.VITE_APP_DOMAIN
}

function getLogo() {
    return import.meta.env.VITE_APP_LOGO
}

function getAppName() {
    return import.meta.env.VITE_APP_NAME
}

export default {
    getDomain,
    isLocal,
    isDev,
    isProd,
    isTest,
    getLogo,
    getAppName
}
