<template>
    <div class="address-list-container">
        <common-header v-bind="{title: '收货地址'}"></common-header>
        <van-list class="address-list-wrapper" :loading="address.loading" :finished="address.finished" finished-text="没有更多了">
            <div class="address-item" v-for="item in address.list" :key="item.address_id">
                <van-text-ellipsis :content="item.province + item.city + item.district" />
                <van-text-ellipsis :content="item.address" />
                <p>
                    <span>{{ item.consignee }}&emsp;</span>
                    <span class="co-999">{{ item.mobile }}&emsp;</span>
                    <!-- <van-tag class="address-type" :color="addressTypeColor(item.address_type)">{{ item.address_type }}</van-tag> -->
                </p>
                <van-divider style="border-color: #e5e5e6" />
                <div class="address-tools s-flex ai-ct jc-bt">
                    <van-checkbox v-model="item.used" icon-size="16" style="flex: 1;" checked-color="var(--main-color)">{{item.used ? '已' : ''}}设为默认</van-checkbox>
                    <p @click="handleClickDelete(item)">删除</p>
                    <p>修改</p>
                </div>
            </div>
            <van-empty class="address-empty" :image-size="['5.3rem', '3rem']" description="您还没有地址哦,快来添加吧～">
                <template #image>
                    <img src="@/assets/images/address/nodata.png" alt="empty" />
                </template>
                <router-link to="/address/0" class="address-add-btn">新增收货地址
                </router-link>
            </van-empty>
        </van-list>
        <van-sticky :offset-bottom="0" position="bottom" >
            <div class="address-bottom-wrapper">
                <van-button class="address-add-btn">新增收货地址</van-button>
            </div>
        </van-sticky>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue';

const cns = getCurrentInstance().appContext.config.globalProperties

const address = reactive({
    loading: false,
    finished: false,
    list: [
        {
            "address_id": 4849,
            "user_id": 68376,
            "consignee": "\u9b4f\u68a6\u5353",
            "zipcode": "000000",
            "country": "\u4e2d\u56fd",
            "province": "\u5317\u4eac",
            "city": "\u5317\u4eac",
            "address": "\u624b\u52a8\u6321",
            "tel": "",
            "mobile": "132****8119",
            "used": 1,
            "district": "\u4e1c\u57ce\u533a",
            "address_type": "\u5bb6",
            "area_code": "86",
            "all_mobile_phone": "13222908119",
            "is_selected": 0
        },
        {
            "address_id": 4853,
            "user_id": 68376,
            "consignee": "\u9b4f\u68a6\u5353",
            "zipcode": "000000",
            "country": "\u4e2d\u56fd",
            "province": "\u5e7f\u4e1c\u7701",
            "city": "\u5e7f\u5dde\u5e02",
            "address": "\u6c34\u7535\u8d39\u65b9\u6cd5",
            "tel": "",
            "mobile": "132****8119",
            "used": 0,
            "district": "\u5929\u6cb3\u533a",
            "address_type": "\u5bb6",
            "area_code": "86",
            "all_mobile_phone": "13222908119",
            "is_selected": 0
        },
        {
            "address_id": 4852,
            "user_id": 68376,
            "consignee": "\u9b4f\u68a6\u5353",
            "zipcode": "000000",
            "country": "\u4e2d\u56fd",
            "province": "\u7518\u8083\u7701",
            "city": "\u5170\u5dde\u5e02",
            "address": "\u8bd5\u8bd5\u6c34",
            "tel": "",
            "mobile": "132****8119",
            "used": 0,
            "district": "\u768b\u5170\u53bf",
            "address_type": "\u5bb6",
            "area_code": "86",
            "all_mobile_phone": "13222908119",
            "is_selected": 0
        },
        {
            "address_id": 4850,
            "user_id": 68376,
            "consignee": "\u9b4f\u68a6\u5353",
            "zipcode": "000000",
            "country": "\u4e2d\u56fd",
            "province": "\u5b89\u5fbd\u7701",
            "city": "\u5b89\u5e86\u5e02",
            "address": "\u704c\u704c\u704c\u704c",
            "tel": "",
            "mobile": "132****8119",
            "used": 0,
            "district": "\u8fce\u6c5f\u533a",
            "address_type": "\u5bb6",
            "area_code": "86",
            "all_mobile_phone": "13222908119",
            "is_selected": 0
        }
    ],
});

// 删除单个地址
const handleClickDelete = (item)  => {
    cns.$dialog.confirm({
        message: '确定要删除地址吗？',
        confirmButtonText: '删除',
    }).then(() => {

    })
}
const addressTypeColor = (type)  => {
    switch (type) {
        case '家':
            return '#49CF94';
        case '公司':
            return '#2172F7';
        case '仓库':
            return '#FEB700';
        default:
            return '#49CF94';
    }
}
</script>

<style lang='scss' scoped>
.address-list-container {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    .address-list-wrapper {
        width: 100%;
        padding: .14rem .2rem 1.7rem .2rem;
        position: relative;
        .address-item{
            width: 100%;
            margin-top: .2rem;
            padding: .3rem;
            border-radius: .2rem;
            background: #fff;

            .address-type {
                min-width: .6rem;
                justify-content: center;
            }
            .address-tools {
                >p {
                    line-height: 0.4rem;
                    padding-left: .3rem;
                }
            }
        }
    }
    .address-add-btn {
        display: block;
        width: 4.12rem;
        height: 0.88rem;
        margin: 0 auto;
        line-height: 0.88rem;
        text-align: center;
        border-radius: 0.6rem;
        background: linear-gradient(
            to right,
            var(--main-color),
            var(--main-color-30)
        );
        box-shadow: 0 6px 20px 0 var(--main-color-30);
        font-size: 0.32rem!important;
        color: #ffffff;
    }
    .address-empty {
        .address-add-btn{
            margin: 0.9rem auto;
        }
    }
    :deep(.van-sticky){
        width: 100%;
    }
    .address-bottom-wrapper {
        width: 7.5rem;
        height: 1.5rem;
        text-align: center;
        padding: 0.3rem 0.2rem;
        box-sizing: border-box;
        box-shadow: 0 -0.2rem 0.2rem -0.22rem rgb(0 0 0 / 20%);
        background: #fff;
        .address-add-btn{
            width: 7.1rem;
            background: var(--main-color);
        }
        :deep(.van-button__text) {
            font-size: .32rem;
        }
    }
}
</style>