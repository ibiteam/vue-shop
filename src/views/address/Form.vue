<template>
    <div class="address-form-container">
        <common-header v-bind="{title: route.params.id == 0 ? '新增收货地址' : '修改收货地址'}"></common-header>
        <!-- <van-notice-bar :scrollable="false" left-icon="warning-o" color="#FF9001" background="#FFFAF5" text="示例：店小二，185********，北京市丰台区XX路XX号" /> -->
        <div class="form-wrapper">
            <p class="fs30 fw-b">联系人信息</p>
            <van-field v-model="form.consignee" class="item-inline" style="margin-right: 10%;" label-width="0" placeholder="姓名" />
            <van-field v-model="form.mobile_phone" class="item-inline" label-width="0" placeholder="电话" />
            <van-field v-model="form.addressSelectedText" label-width="0" placeholder="省市区县乡镇等" readonly right-icon="arrow" @click="handleAddressSelectOpen" />
            <van-field v-model="form.address" label-width="0" placeholder="详细地址  街道、楼牌号等" />
            <van-cell-group :border="false">
                <div class="s-flex ai-ct jc-bt" style="padding-top: .3rem">
                    <van-checkbox v-model="form.used_check" icon-size="16" checked-color="var(--main-color)">
                        <p class="co-666">设为默认地址</p>
                        <p class="fs22" style="color: var(--main-color)">提醒：每次下单会默认推荐使用该地址</p>
                    </van-checkbox>
                    <p class="co-666">清空</p>
                </div>
            </van-cell-group>
        </div>
        <van-button class="address-add-btn">保存</van-button>
        <address-select v-bind="{show: addressSelectShow, value: [form.province_id, form.city_id, form.district_id]}" @close="handleAddressSelectClose" @select="handleAddressSelect"></address-select>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import AddressSelect from '@/components/common/AddressSelect'

const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute();

const form = reactive({
    consignee: '', // 姓名
    mobile_phone: '', // 电话
    address: '', // 详细地址
    addressSelectedText: '', // 省市区
    province_id: '', // 省份id
    province: '', // 省份
    city_id: '', // 市id
    city: '', // 市
    district_id: '', // 区id
    district: '', // 区
    used_check: 0, // 是否默认地址
})

const addressSelectShow = ref(false)


const handleAddressSelectOpen = () => {
    addressSelectShow.value = true
}
const handleAddressSelectClose = () => {
    addressSelectShow.value = false
}
const handleAddressSelect = (res) => {
    form.addressSelectedText = res.label.join(' ')
    form.province_id = res.value[0]
    form.province = res.label[0]
    form.city_id = res.value[1]
    form.city = res.label[1]
    form.district_id = res.value[2]
    form.district = res.label[2]
    handleAddressSelectClose()
}

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