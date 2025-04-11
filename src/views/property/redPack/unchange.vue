<template>
    <div class="coupon-unchange-container" v-cloak>
        <common-header title="不可用红包"></common-header>
        <div class="coupon-dis">
            <div style="width:7.5rem;height:50px;">
                <div style="position:fixed;z-index:100;width:7.5rem;height:50px;" class="s-flex jc-ct bg-f2">
                    <van-tabs v-model="activeIndex" @click="handleClickTabs" line-width="1.06rem"
                              title-inactive-color="#333333">
                        <van-tab
                            :title="'已使用(' + (bonusCount.used_count < 99 ? bonusCount.used_count : '99+') + ')'"></van-tab>
                        <van-tab
                            :title="'已过期(' + (bonusCount.expired_count < 99 ? bonusCount.expired_count : '99+') + ')'"></van-tab>
                    </van-tabs>
                </div>
            </div>
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :immediate-check="false"
                    :finished-text="stateText"
                    @load="loadMore"
                >
                    <div class="coupon-list">
                        <div class="" v-for="(item, index) of redPackList" :key="index">
                            <div class="coupon-list-item" :class="{ disable: activeIndex != 0 }">
                                <div class="coupon-list-info s-flex">
                                    <div class="coupon-item-le flex-align-center s-flex">
                                        <div class="fs32 integer fw-b" :class="{co_999: activeIndex != 0, co_666: activeIndex == 0 }">{{item.money &&
                                        item.money.toString().split('.')[0]}}
                                            <p class="fs14 price fw-b" :class="{co_999: activeIndex != 0, co_666: activeIndex == 0 }">￥</p>
                                        </div>
                                        <div class="fs14 MT10 fw-b" :class="{co_999: activeIndex != 0, co_666: activeIndex == 0 }"
                                             v-if="item.money && item.money.toString().split('.')[1]">.{{item.money &&
                                        item.money.toString().split('.')[1]}}
                                        </div>
                                    </div>
                                    <div class="coupon-item-cen">
                                        <h1 class="s-flex"><label class="elli-2" :class="{co_999: activeIndex != 0, co_333: activeIndex == 0 }">{{item.name}}</label></h1>
                                        <h2 :class="{co_999: activeIndex != 0, co_666: activeIndex == 0 }">{{item.shop_name}}</h2>
                                        <h2 :class="{co_999: activeIndex != 0, co_666: activeIndex == 0 }">{{item.desc}}</h2>
                                        <p>{{item.start_time_format}}~{{item.end_time_format}} </p>
                                    </div>
                                    <div class="coupon-item-rg"></div>
                                </div>
                                <div class="coupon-desc flex-1" v-if="item.limit_shop_info != '' || item.limit_info != '' || (item.style_type == 3 && item.desc_show != '')">
                                    <div class="desc-p elli-2">
                                        <span v-if="item.style == 3 && item.list_desc != ''">{{item.list_desc}}<br></span>
                                        <span v-if="item.limit_shop_info != ''">{{item.limit_shop_title}}{{item.limit_shop_info}}<br></span>
                                        <span v-if="item.limit_info != ''">{{item.limit_title}}{{item.limit_info}}</span>
                                    </div>
                                    <em class="iconfont co_999" v-if="!item.isShowDesc">&#xe604;</em>
                                    <em class="iconfont co_999" v-else>&#xe61e;</em>
                                </div>
                                <div class="new-guest disabled" v-if="item.is_new_guest == '1'">新客专享</div>
                            </div>
                        </div>
                        <div v-if="noDataShow" class="no-Data">
                            <img src="@/assets/images/property/redPack/noRedPack.png" alt="" class="no-Img">
                            <span>暂无红包</span>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import $ from 'jquery'
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
import {couponUnchangeListAxios} from "@/api/property.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const activeIndex = ref(0)
const bonusCount = ref({
    expired_count: 0,
    used_count: 0,
})
const redPackList = ref([])
const noDataShow = ref(true)
const loading = ref(false)
const finished = ref(false)
const info = ref({
    page:1,
    type:2
})
const isLoading = ref(false)
const stateText = ref('仅显示近一年的红包数据')

onMounted(() => {
    // getListData()
})

const getListData = () => {
    couponUnchangeListAxios(info.value).then((res) => {
        loading.value = false
        finished.value = false
        stateText.value = '仅显示近一年的红包数据'
        if (cns.$constant.isSuccessCode(res)) {
            if (res.data.list.data.length > 0) {
                Array.from(res.data.list.data, (item) => {
                    item.isShowDesc = false
                })
                redPackList.value = res.data.list.data
                noDataShow.value = false
                info.page++

                nextTick(() => {
                    let pDom = Array.from($('.desc-p'))
                    if (pDom.length == 0) {
                        return false
                    }
                    pDom.forEach((item) => {
                        let spanDom = Array.from($(item).children())
                        let num = 0
                        spanDom.forEach((child) => {
                            if ($(item).width() >= $(child).width()) {
                                num ++
                            }
                        })
                        if (num == spanDom.length) {
                            $(item).siblings('em').css({display: 'none'})
                        }
                    })
                })
            } else {
                noDataShow.value = true
            }
            bonusCount.value = res.data.bonusCount
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login', {}, {}, 'replace')
        } else {
            cns.$toast(res.message)
        }
    })
}

const handleClickTabs = (index) =>{
    activeIndex.value = index
    noDataShow.value = false
    redPackList.value = []
    stateText.value = ''
    if (index == 1) {
        info.type = 3
    } else {
        info.type = 2
    }
    document.body.scrollTop = document.documentElement.scrollTop = 0
    info.page = 1
    // getListData()
}

const onRefresh = () => {
    setTimeout(() => {
        info.page = 1
        redPackList.value = []
        // getListData()
        isLoading.value = false
    }, 1000)
}

const loadMore = () =>{
    if (redPackList.value.length >= 10) {
        couponUnchangeListAxios(info.value).then((res) => {
            loading.value = false
            if (cns.$constant.isSuccessCode(res)) {
                if (res.data.list.data.length > 0) {
                    Array.from(res.data.list.data, (item) => {
                        item.isShowDesc = false
                        redPackList.value = redPackList.value.concat(item)
                    })

                    nextTick(() => {
                        let pDom = Array.from($('.desc-p'))
                        if (pDom.length == 0) {
                            return false
                        }
                        pDom.forEach((item) => {
                            let spanDom = Array.from($(item).children())
                            let num = 0
                            spanDom.forEach((child) => {
                                if ($(item).width() >= $(child).width()) {
                                    num ++
                                }
                            })
                            if (num == spanDom.length) {
                                $(item).siblings('em').css({display: 'none'})
                            }
                        })
                    })
                } else {
                    finished.value = true
                }
            } else if (res.code == 404 && res.message === "no data !") {
                finished.value = true
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login', {}, {}, 'replace')
            } else {
                cns.$toast(res.message)
            }
        })
        info.page++
    } else {
        loading.value = false
    }
}

</script>

<style scoped lang="scss">
.coupon-unchange-container {
    background-color: #f2f2f2;
    height: auto;
    min-height: 100vh;
    color: #333;
    z-index: 100;

    .flex-align-center {
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .exchange-bot {
        padding: 0.2rem;
        background-color: #ffffff;
    }

    .exchange-bot h1 {
        line-height: 0.64rem;
        font-size: 0.3rem;
        color: #333333;
    }

    .exchange-bot p {
        line-height: 0.36rem;
        font-size: 0.26rem;
        color: #666666;
    }

    .coupon-list {
        padding: 0 0 0.1rem;
    }
    .coupon-dis .coupon-list .coupon-list-item {
        width: 7.1rem;
        margin: 0.2rem auto auto;
    }

    .coupon-dis .coupon-list .coupon-list-item {
        box-shadow: 0 2px 10px -4px #cccccc;
        -weblit-box-shadow: 0 2px 10px -4px #cccccc;
        -moz-box-shadow: 0 2px 10px -4px #cccccc;
        -ms-box-shadow: 0 2px 10px -4px #cccccc;
        position: relative;
    }

    :deep(.van-tabs) {
        width: 100%;
    }

    :deep(.van-tabs__nav) {
        background-color: #f2f2f2;
    }
    :deep(.van-tabs__line){
        width: 0.5rem !important;
        height: .06rem;
        background: #0062EA;
    }

    .coupon-dis .van-tabs .van-tab {
        position: relative;
    }

    .coupon-dis .van-tabs .van-tab:before {
        content: "";
        width: 1px;
        height: 0.48rem;
        background-color: #e5e5e6;
        position: absolute;
        right: 0;
        top: 0.2rem;
    }

    .coupon-dis .coupon-list .coupon-list-item .coupon-list-info {
        padding: 0 0.25rem;
        background: url("@/assets/images/property/coupon/couponBack.jpg") center no-repeat;
        background-size: 100% 100%;
        position: relative;
    }

    .coupon-list-item .coupon-item-le {
        width: 2rem;
        line-height: 1.82rem;
        padding-left: 0.2rem;
        font-size: 0.36rem;
        color: #666666;
        position: relative;
    }

    .coupon-list-item .coupon-item-le {
        width: 2rem;
        line-height: 1.82rem;
        padding-left: 0.3rem;
        font-size: 0.36rem;
        color: #F81212;
        position: relative;
    }

    .coupon-list-item .coupon-item-le span {
        font-size: 0.36rem;
        position: absolute;
        left: 0;
        top: 0.14rem;
    }

    .coupon-list-item .coupon-item-le .integer {
        position: relative;
    }

    .coupon-list-item .coupon-item-le .price {
        position: absolute;
        top: -0.06rem;
        left: -0.2rem;
    }

    .coupon-list-item .coupon-item-cen {
        width: 3.22rem;
        padding: 0.32rem 0 0.32rem 0.26rem;
    }

    .coupon-list-item .coupon-item-cen h1 {
        line-height: 0.42rem;
        color: #333333;
    }

    .coupon-list-item .coupon-item-cen h1 label {
        font-weight: bold;
        font-size: 0.28rem;
        line-height: 0.32rem;
        max-width: 3rem;
    }

    .coupon-list-item .coupon-item-cen h1 span {
        font-size: 0.28rem;
        color: #666666;
    }

    .coupon-list-item .coupon-item-cen h2 {
        line-height: 0.38rem;
        font-size: 0.2rem;
        color: #999;
    }

    .coupon-list-item .coupon-item-cen p {
        line-height: 0.38rem;
        font-size: 0.2rem;
        color: #999999;
    }

    .coupon-list-item .coupon-item-rg {
        width: 1.16rem;
        text-align: right;
        padding: 0.48rem 0;
    }

    .coupon-list-item .coupon-item-rg h1 {
        line-height: 0.7rem;
        font-size: 0.26rem;
        color: #ffffff;
    }

    .coupon-list-item .coupon-item-rg p {
        line-height: 0.58rem;
        text-align: center;
        font-size: 0.2rem;
        color: #f61d4a;
    }

    .coupon-list-item .coupon-item-rg .coupon-btn {
        width: 100%;
        height: 0.48rem;
        line-height: 0.48rem;
        text-align: center;
        background-color: #f61d4a;
        font-size: 0.24rem;
        color: #ffffff;
        border-radius: 0.08rem;
    }

    .coupon-list .coupon-desc {
        width: 6.3rem;
        line-height: 0.3rem;
        padding: 0.14rem 0.56rem 0.14rem 0.22rem;
        margin: 0 auto;
        background-color: #fbfbfb;
        font-size: 0.2rem;
        color: #666666;
        position: relative;
    }

    .coupon-list .coupon-desc p {
        height: 0.28rem;
        overflow: hidden;
    }

    .coupon-list .coupon-desc p.viewLine {
        height: auto;
        overflow: inherit;
    }

    .coupon-list .coupon-desc em {
        font-size: 20px;
        position: absolute;
        right: 0.2rem;
        top: 0.15rem;
    }


    .coupon-add {
        width: 100%;
        height: 0.98rem;
        line-height: 0.98rem;
        color: #00a0e9;
    }

    .coupon-add.fixed {
        background-color: #f4f4fa;
        position: fixed;
        left: 0;
        bottom: 0;
    }

    .coupon-add a {
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        font-size: 0.24rem;
        color: #333333;
    }

    .coupon-add a:nth-of-type(1) {
        margin-right: 0.2rem;
        padding-right: 0.2rem;
        border-right: 1px solid #e5e5e6;
    }

    .coupon-dis .coupon-list .coupon-list-item .coupon-list-info:before {
        content: "";
        width: 1.2rem;
        height: 1.24rem;
        background: url("@/assets/images/property/coupon/couponUsed.png") center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .coupon-dis .coupon-list .coupon-list-item.disable .coupon-list-info:before {
        content: "";
        width: 1.2rem;
        height: 1.24rem;
        background: url("@/assets/images/property/coupon/couponDis.png") center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .coupon-dis .coupon-list .coupon-list-item .coupon-item-le {
        color: #999999;
    }

    /*无数据*/
    .no-Data {
        width: 100%;
        height: 80vh;
        text-align: center;
        font-size: 0.28rem;
        padding: 1rem auto !important;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .no-Img {
        width: 6.1rem;
        height: 2.73rem;
        margin-top: 3.17rem;
        margin-bottom: .75rem;
    }
}
.new-guest.disabled { padding: 4px 0.1rem; background: linear-gradient(to right, #CCCCCC, #DCDCDC); border-radius: 0.1rem 0; font-size: 0.24rem; color: #ffffff; position: absolute; left: 0; top: 0; }
</style>
