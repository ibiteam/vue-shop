<template>
    <div class="address-form-container">
        <common-header v-bind="{title: route.params.id == 0 ? '新增收货地址' : '修改收货地址'}"></common-header>
        <!-- <van-notice-bar :scrollable="false" left-icon="warning-o" color="#FF9001" background="#FFFAF5" text="示例：店小二，185********，北京市丰台区XX路XX号" /> -->
        <div class="form-wrapper">
            <p class="fs30 fw-b">联系人信息</p>
            <van-field v-model="form.consignee" class="item-inline" style="margin-right: 10%;" label-width="0" placeholder="姓名" />
            <van-field v-model="form.phone" class="item-inline" label-width="0" placeholder="电话" />
            <van-field v-model="form.addressSelectedText" label-width="0" placeholder="省市区县乡镇等" readonly right-icon="arrow" @click="handleAddressSelectOpen" />
            <van-field v-model="form.address_detail" label-width="0" placeholder="详细地址  街道、楼牌号等" />
            <van-cell-group :border="false">
                <div class="s-flex ai-ct jc-bt" style="padding-top: .3rem">
                    <van-checkbox v-model="form.is_default" icon-size="16" checked-color="var(--main-color)">
                        <p class="co-666">设为默认地址</p>
                        <p class="fs22" style="color: var(--main-color)">提醒：每次下单会默认推荐使用该地址</p>
                    </van-checkbox>
                    <p class="co-666" @click="handleReset">清空</p>
                </div>
            </van-cell-group>
        </div>
        <van-button class="address-add-btn" :disabled="formDisabled" @click="handleSubmit">保存</van-button>
        <address-select v-bind="{show: addressSelectShow, value: [form.province, form.city, form.district]}" @close="handleAddressSelectClose" @select="handleAddressSelect"></address-select>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AddressSelect from '@/components/common/AddressSelect'
import { updateAddress, getAddressDetail } from "@/api/address.js";

const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute();
const router = useRouter()

const form = reactive({
    id: 0,
    consignee: '', // 姓名
    phone: '', // 电话
    address_detail: '', // 详细地址
    addressSelectedText: '', // 省市区
    provinceText: '', // 省份
    province: '', // 省份id
    cityText: '', // 市
    city: '', // 市id
    districtText: '', // 区
    district: '', // 区id
    is_default: false, // 是否默认地址
})
const formDisabled = ref(false)
const addressSelectShow = ref(false)
const isBack = ref(route.query.back)


const handleAddressSelectOpen = () => {
    addressSelectShow.value = true
}
const handleAddressSelectClose = () => {
    addressSelectShow.value = false
}
const handleAddressSelect = (res) => {
    form.addressSelectedText = res.label.join(' ')
    form.province = res.value[0]
    form.provinceText = res.label[0]
    form.city = res.value[1]
    form.cityText = res.label[1]
    form.district = res.value[2]
    form.districtText = res.label[2]
    handleAddressSelectClose()
}

const handleReset = () => {
    form.consignee = ''
    form.phone = ''
    form.address_detail = ''
    form.is_default = false
    form.addressSelectedText = ''
    form.province = ''
    form.provinceText = ''
    form.city = ''
    form.cityText = ''
    form.district = ''
    form.districtText = ''
}

const handleSubmit = () => {
    if (formDisabled.value) return
    formDisabled.value = true
    updateAddress({
        ...form,
        is_default: form.is_default ? 1 : 0
    }).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            cns.$toast('保存成功')
	        if(!!isBack){
		        router.back()
	        }else {
		        cns.appRoute('address', {}, 'replace')
	        }
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
        formDisabled.value = false
    }).catch(() => {
        formDisabled.value
    })
}

onMounted(() => {
    form.id = route.params.id || 0
    form.id && form.id != 0 && getAddressDetail(form.id).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            form.consignee = res.data.consignee
            form.phone = res.data.phone
            form.address_detail = res.data.address_detail
            form.is_default = res.data.is_default ? true : false
            form.province = res.data.province_id
            form.provinceText = res.data.province
            form.city = res.data.city_id
            form.cityText = res.data.city
            form.district = res.data.district_id
            form.districtText = res.data.district
            form.addressSelectedText = res.data.province + '  ' + res.data.city + '  ' + res.data.district
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    })
})

</script>

<style lang='scss' scoped>
.address-form-container {
    padding: .2rem;
    .form-wrapper {
        width: 100%;
        padding: 0.5rem .3rem .3rem;
        border-radius: .3rem;
        background: #fff;
        .item-inline {
            width: 45%;
            display: inline-flex;
        }
        :deep(.van-cell) {
            padding: .3rem 0;
        }
        :deep(.van-cell:after) {
            right: 0;
            left: 0;
        }
    }
    .address-add-btn {
        display: block;
        width: 3rem;
        height: 0.88rem;
        margin: 0.5rem auto;
        line-height: 0.88rem;
        text-align: center;
        border-radius: 0.6rem;
        background: var(--main-color);
        box-shadow: 0 6px 20px 0 var(--main-color-30);
        font-size: 0.32rem!important;
        color: #ffffff;
        :deep(.van-button__text) {
            font-size: .32rem;
        }
    }
}
</style>