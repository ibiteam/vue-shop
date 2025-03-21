<template>
    <div class="login-wrap">
        <van-sticky>
            <div class="login-header">
                <span class="iconfont" @click="router.back()">&#xe605;</span>
            </div>
        </van-sticky>
        <div class="login-company">
            <span>
                <img :src="wap_logo_color" v-if="wap_logo_color"/>
                <h4 v-else class="no"/>
            </span>
	        <p>买好货上{{ shop_name }}</p>
        </div>
        <div class="login-form" style="padding-bottom: 1.4rem;">
            <van-form @submit="onSubmitRegister">
	            <div>
		            <van-field
			            v-model="phone"
			            type="tel"
			            left-icon="phone-o"
			            name="phone"
			            placeholder="请输入手机号"
		            />
	            </div>
	            <div style="margin: 0.7rem 0.45rem 0.3rem;">
		            <van-button round block type="info" native-type="submit">
			            下一步
		            </van-button>
	            </div>
            </van-form>
        </div>
    </div>
</template>

<script setup>
	import {useConfigStore} from '@/stores'
	const configStore = useConfigStore()
	import { checkPhone } from "@/api/user";

    import { ref, onMounted, getCurrentInstance, computed } from 'vue'
    import { useRouter } from 'vue-router'

    const cns = getCurrentInstance().appContext.config.globalProperties
    const router = useRouter()

    const phone = ref('')
	const wap_logo_color = computed(() => configStore.shopConfig.wap_logo_color || '')
	const shop_name = computed(() => configStore.shopConfig.shop_name || '')
    const onSubmitRegister = (values) => {
        if (values.phone === '') {
            cns.$toast('请输入手机号码')
            return
        }
        if (!cns.$public.isTelPhone(phone.value)) {
            cns.$toast('请输入正确的手机号码') 
            return
        }

        checkPhone(phone.value).then(res => {
            if (res.code == 200) {
                sessionStorage.setItem('can_send_code', true)
                let params = {
                    phone: phone.value,
                    action: 'register'
                }
                cns.appRoute('phone', params, params)
            } else {
                cns.$dialog.confirm({
                    message: '该手机号已注册，是否直接登录？',
                    confirmButtonText: '立即登录', 
                    cancelButtonText: '继续注册'
                }).then(() => {
                    cns.appRoute('login', {}, {}, 'replace')
                }).catch(() => {})
            }
        }).catch(() => {})
    }

    onMounted(() => {
        if(cns.$public.isLogin()){
            cns.appRoute('ucenter', {}, {}, 'replace')
        }
    })
</script>

<style scoped lang="scss">
@use "@/assets/css/login.scss" as *;
</style>
