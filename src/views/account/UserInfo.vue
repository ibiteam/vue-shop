<template>
    <div class="userInfo-wrap" v-if="page_loading">
        <common-header :title="title"></common-header>
        <nav class="user-center">
            <van-cell-group>
                <van-cell title="头像" is-link clickable class="logo-cell">
                    <div class="s-flex jc-fe">
                        <van-uploader :before-read="beforeRead" :after-read="afterRead">
                            <div class="logo-img">
                                <img :src="portrait" onerror="return onerror=null,src='@/assets/images/ucenter/portait.jpeg'" v-if="portrait"/>
                                <img src="@/assets/images/ucenter/header_photo_1.png" v-else/>
                            </div>
                        </van-uploader>
                    </div>
                </van-cell>
                <van-cell title="用户名" :value="user_name" is-link @click="showUpdateUser"/>
                <van-cell title="昵称" :value="nickname" is-link @click="showUpdateNickname"/>
            </van-cell-group>
        </nav>
        <van-dialog v-model:show="showUsername" title="修改用户名" :show-confirm-button="false"
                    :show-cancel-button="false">
            <div style="padding:0 0.3rem 0.3rem;margin-bottom: 0.1rem;">
                <p style="padding: 0.2rem 0;color: #F71111;">用户名作为登录账户使用，仅支持修改一次哦！</p>
                <van-cell-group>
                    <van-field v-model="editUsername" placeholder="请输入用户名" label="" style="line-height: normal;" maxlength="22"/>
                </van-cell-group>
            </div>
            <div class="s-flex jc-ct">
                <div class="btn-com btn-left" @click="cancelUpdateUser">取消</div>
                <div class="btn-com btn-right" @click="updateUserName">确认</div>
            </div>
        </van-dialog>
        <van-dialog v-model:show="showNickname" title="修改昵称" :show-confirm-button="false" :show-cancel-button="false">
            <div style="padding:0.3rem;margin-bottom: 0.1rem;">
                <van-cell-group>
                    <van-field v-model="editNickname" placeholder="请输入昵称" label="" style="line-height: normal;" maxlength="8"/>
                </van-cell-group>
            </div>
            <div class="s-flex jc-ct">
                <div class="btn-com btn-left" @click="cancelUpdateNick">取消</div>
                <div class="btn-com btn-right" @click="updateNickname">确认</div>
            </div>
        </van-dialog>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
const cns = getCurrentInstance().appContext.config.globalProperties
import {
    getUserInfoAxios, updateNickNameAxios, updatePortraitAxios, updateUserNameAxios
} from "@/api/account.js";
import {uploadFileAxios} from "@/api/common.js";
const title = ref('用户信息')
const page_loading = ref(false)
const portrait = ref('')
const nickname = ref('')
const user_name = ref('')
const is_modify = ref('0')
const showNickname = ref(false)
const showUsername = ref(false)
const editUsername = ref('')
const editNickname = ref('')

onMounted(() => {
    getUserInfo()
})
const getUserInfo = () => {
    getUserInfoAxios().then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            page_loading.value = true
            is_modify.value = res.data.is_modify
            nickname.value = res.data.nickname||'未设置昵称'
            portrait.value = res.data.avatar
            user_name.value = res.data.user_name
            editNickname.value = res.data.nickname
            editUsername.value = res.data.user_name
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        console.log(err)
    })
}

const beforeRead = (file) => {
    if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/png"
    ) {
        cns.$toast("请上传 jpg/jpeg/png 格式图片");
        return false;
    }
    return true;
}

const afterRead = (file) => {
    let info = {
        file: file.content,
    };
    uploadFileAxios(info).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            updatePortrait(res.data.url);
        } else {
            cns.$toast('上传失败，请重试')
        }
    }).catch(err => {
        console.log(err)
    })
}
const updatePortrait = (url) => {
    updatePortraitAxios(url).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            cns.$toast('修改成功')
        }
        portrait.value = url;
        setTimeout(() => {
            getUserInfo()
        }, 500)
    }).catch(err => {
        console.log(err)
    })
}
const showUpdateUser = () => {
    if (is_modify.value == '1') {
        cns.$toast('用户名只能修改一次哦')
        return
    }
    showUsername.value = true
}
const cancelUpdateUser = () => {
    showUsername.value = false
    editUsername.value = user_name.value
}
const updateUserName = () => {
    let regExp = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
    if (editUsername.value == '') {
        cns.$toast('请输入您的用户名')
        return
    }
    if(regExp.test(editUsername.value)){
        cns.$toast('输入的用户名不能包含特殊字符。')
        return
    }
    if(!isNaN(Number(editUsername.value))){
        cns.$toast('用户名不能设置为纯数字')
        return
    }
    if (editUsername.value.length > 22 || editUsername.value.length < 3 || !cns.$public.isUserNameV3(editUsername.value)) {
        cns.$toast('用户名3-22个字符，建议使用“_”、数字或字母（区分大小写）组合')
        return
    }
    if (!cns.$public.isUserName(editUsername.value)) {
        cns.$toast('用户名不能设置为纯数字')
        return
    }
    if (editUsername.value.charAt(0) == '_') {
        cns.$toast('用户名不能以“_”开头')
        return
    }
    updateUserNameAxios(editUsername.value).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            cns.$toast('修改成功')
            showUsername.value = false
            setTimeout(() => {
                getUserInfo()
            }, 300)
        } else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        console.log(err)
    })
}
const showUpdateNickname = () => {
    showNickname.value = true
}
const cancelUpdateNick = () => {
    showNickname.value = false
    if(nickname.value !='未设置昵称'){
        editNickname.value = nickname.value
    }else {
        editNickname.value = ''
    }
}
const updateNickname = () => {
    let regExp = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
    if (editNickname.value == '') {
        cns.$toast('请设置您的昵称')
        return
    }
    if(regExp.test(editNickname.value)){
        cns.$toast('输入的昵称不能包含特殊字符')
        return
    }
    updateNickNameAxios(editNickname.value).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            cns.$toast('修改成功')
            showNickname.value = false
            setTimeout(() => {
                getUserInfo()
            }, 300)
        } else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        console.log(err)
    })
}
</script>

<style scoped lang="scss">
.userInfo-wrap{
    .user-center {
        border-radius: 0.2rem;
        overflow: hidden;
        margin: 0.2rem 0;

        .van-cell {
            padding: 0.3rem;
        }

        :deep(.van-cell:first-of-type) {
            .van-cell__title {
                line-height: 1.08rem;
            }
            .van-cell__left-icon, .van-cell__right-icon {
                line-height: 1.08rem;
            }
        }
        .van-cell-group {
            margin-bottom: 0;
        }
        .van-cell__value {
            flex: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            word-break: break-all;
            margin-right: 0.1rem;
            line-height: 0.45rem;
            span{
                font-size: 0.28rem;
                color: #999999;
            }
        }
        :deep(.van-cell__title) {
            line-height: 0.45rem;
            span {
                font-size: 0.32rem;
                color: #333333;
            }
        }
        .logo-cell.van-cell {
            padding: 0.2rem 0.3rem;
        }
        .van-cell--clickable:active{
            background: unset;
        }
    }
    .logo-img {
        width: 1.06rem;
        height: 1.06rem;
        border: 1px solid #ccc;
        border-radius: 1rem;
        overflow: hidden;
        line-height: 1rem;
        text-align:center;
        position: relative;
        .van-uploader__upload {
            width: 100%;
        }
        img{
            width: auto;
            height: auto;
            max-height: 100%;
            max-width: 100%;
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            vertical-align: middle;
        }
    }
    .van-dialog__confirm,.van-dialog__confirm:active{
        color: var(--main-color);
    }

    .van-cell__right-icon{
        width: 0.48rem;
    }
    :deep(.van-dialog){
        width: 5.4rem;
        .van-dialog__header {
            font-size: 0.34rem;
            color: #333;
            padding: 0.35rem 0.25rem 0;
            line-height: 0.48rem;
            font-weight: bold;
        }
        .van-field__label {
            width: 4.7em;
        }
        .van-field__label span {
            font-size: 0.28rem;
        }
        .van-field__body input {
            font-size: 0.28rem;
        }
        .van-dialog__content {
            .van-cell {
                line-height: normal;
                background: #F2F3F5;
                border-radius: 8px;
                border: none;
            }
            .van-field__label {
                span {
                    line-height: normal;
                }
            }
            .van-field__body {
                height: 100%;
                input {
                    height: 100%;
                }
            }
        }
    }
    .btn-com {
        width: 50%;
        height: 0.88rem;
        line-height: 0.88rem;
        text-align: center;
        color: #3D3D3D;
        border-top: 1px solid rgba(0,0,0,0.08);
        font-size: 0.3rem;
        box-sizing: border-box;
    }

    .btn-left {
        border-right: 1px solid rgba(0,0,0,0.08);
    }

    .btn-right {
        color: var(--main-color);
    }
}

</style>
