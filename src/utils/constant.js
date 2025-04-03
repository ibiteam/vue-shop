const isSuccessCode = (res) => {
    return res.code == 200
}

const isUnLoginCode = (res) => {
    return res.code == 401
}

export default {
    isSuccessCode,
    isUnLoginCode
}