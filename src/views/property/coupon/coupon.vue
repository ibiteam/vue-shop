<template>
    <div class="coupon-container" v-cloak>
        <common-header title="我的优惠券" :app_can_share="false" back_color="#f2f2f2"></common-header>
        <div style="width:7.5rem;height:1.2rem;">
            <div style="position:fixed;z-index:100;width:7.5rem;height:1.2rem;" class="s-flex jc-ct flex-dir bg-f2">
                <div style="width:7.5rem;height:0.1rem;"></div>
                <div class="exchange-top s-flex flex-align-center">
                    <div class="exchange-inp flex-1" style="">
                        <van-field v-model="coupon_sn" clearable placeholder="请输入10位数字的优惠券兑换码"/>
                    </div>
                    <div class="exchange-btn" :class="{ disabled: !is_can_exchange }" @click="handleClickExchange">兑换</div>
                </div>
                <div style="width:7.5rem;height:0.1rem;"></div>
            </div>
        </div>
        <div class="coupon-index">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了~"
                    :immediate-check="false"
                    @load="loadMore"
                >
                    <div class="coupon-list">
                        <div v-for="(item, index) of couponList" :key="index">
                            <div class="coupon-list-item" v-if="item.is_used == 0 || item.is_time == 0 || item.order == 3">
                                <div class="coupon-list-info s-flex" :style="{'border-radius': item.limit.length>0 ? '0.1rem 0.1rem 0 0' : '0.1rem'}">
                                    <div class="coupon-item-le flex-align-center s-flex">
                                        <div class="fs32 co-redF7 integer fw-b">{{item.money && item.money.toString().split('.')[0]}}
                                            <p class="fs14 co-redF7 price fw-b">￥</p>
                                        </div>
                                        <div class="fs14 co-redF7 MT10 fw-b" v-if="item.money && item.money.toString().split('.')[1]">.{{item.money && item.money.toString().split('.')[1]}}</div>
                                    </div>
                                    <div class="coupon-item-cen">
                                        <h1 class="s-flex"><label class="elli-2">{{item.name}}</label></h1>
                                        <h2>{{item.shop_name}}</h2>
                                        <h2>{{item.desc}}</h2>
                                        <p>{{item.start_time}}~{{item.end_time}} </p>
                                    </div>
                                    <div class="coupon-item-rg">
                                        <p v-if="item.order == 3">即将过期</p>
                                        <div class="coupon-btn" :style="{margin: item.order != 3?'0.34rem 0':'0'}">去使用</div>
                                    </div>
                                </div>
                                <div class="coupon-desc flex-1" v-if="item.limit_shop_info != '' || item.limit_info != '' || (item.style_type == 3 && item.desc_show != '')" @click="handleClickDesc(item)">
                                    <div :class="{ ellipsis: !item.isShowDesc, viewLine: item.isShowDesc }" class="desc-p">
                                        <span v-if="item.style_type == 3 && item.desc_show != ''">{{item.desc_show}}<br></span>
                                        <span v-if="item.limit_shop_info != ''">{{item.limit_shop_title}}{{item.limit_shop_info}}<br></span>
                                        <span v-if="item.limit_info != ''">{{item.limit_title}}{{item.limit_info}}</span>
                                    </div>
                                    <em class="iconfont icon-em" v-if="!item.isShowDesc">&#xe604;</em>
                                    <em class="iconfont icon-em" v-else>&#xe61e;</em>
                                </div>
                                <div class="new-guest" v-if="item.is_new_guest == '1'" :class="{ disabled: item.is_used == 1 || item.is_time == 1 }">新客专享</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="noDataShow" class="no-Data">
                        <img src="@/assets/images/property/coupon/noCoupon.png" alt="" class="no-Img">
                        <span>暂无可用优惠券</span>
                    </div>
                </van-list>
                <div class="coupon-add s-flex breathe" :class="{ 'fixed': couponList.length == 0 }">
                    <div style="display: table; margin: 0 auto;">
                        <a @click="appRoute('couponExplain')">优惠券使用说明</a>
                        <a @click="appRoute('couponUnchange')">查看不可用优惠券</a>
                    </div>
                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import $ from 'jquery'
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
import {couponExchangeAxios, getCouponListAxios} from "@/api/property.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const coupon_sn = ref('')
const couponList = ref([])
const noDataShow = ref(true)
const loading = ref(false)
const finished =ref(false)
const page = ref(1)
const isLoading = ref(false)
const is_can_exchange = ref(true)

onMounted(() => {
    // getListData()
})

const getListData = () => {
    getCouponListAxios({page:page.value}).then((res) => {
        loading.value = false
        finished.value = false
        if (cns.$constant.isSuccessCode(res)) {
            is_can_exchange.value = res.data.is_can_exchange == '0' ? true : false
            if (res.data.data.length >0) {
                Array.from(res.data.data, (item) => {
                    item.isShowDesc = false
                })
                couponList.value = res.data.data
                page.value++
                noDataShow.value = false

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
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login', {}, {}, 'replace')
        } else {
            cns.$toast(res.message);
        }
    })
}

const handleClickExchange = () => {
    if (!is_can_exchange.value) return false
    if (coupon_sn.value === "") {
        cns.$toast("优惠券兑换码不能为空")
        return
    }
    if ((coupon_sn.value.toString()).indexOf(".") != -1 || isNaN(coupon_sn.value * 1)) {
        cns.$toast("优惠券兑换码只能为数字")
        return
    }
    if (coupon_sn.value.length > 10) {
        cns.$toast("请输入10位数的兑换码")
        return
    }
    couponExchange()
}

const couponExchange = () => {
    couponExchangeAxios({coupon_sn: coupon_sn.value}).then((res) => {
        if (cns.$constant.isSuccessCode(res)){
            cns.$toast("优惠券兑换成功")
            setTimeout(() => {
                page.value = 1
                coupon_sn.value = ''
                noDataShow.value = false
                loading.value = false
                finished.value = false
                couponList.value = []
                // getListData()
                document.body.scrollTop=document.documentElement.scrollTop=0
            }, 3000)
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login', {}, {}, 'replace')
        } else if (res.code == 1008) {
            cns.$toast(res.message)
            is_can_exchange.value = false
        } else {
            cns.$toast(res.message)
        }
    })
}

const handleClickDesc = (item) => {
    item.isShowDesc = !item.isShowDesc
}

const onRefresh = () => {
    setTimeout(() => {
        page.value = 1
        couponList.value = []
        // getListData()
        isLoading.value = false
    }, 1000)
}

const loadMore = () => {
    if (couponList.value.length >= 10) {
        getCouponListAxios({page:page.value}).then((res) => {
            loading.value= false
            if (cns.$constant.isSuccessCode(res)) {
                if (res.data.data.length > 0) {
                    Array.from(res.data.data, (item) => {
                        item.isShowDesc = false
                        couponList.value = couponList.value.concat(item)
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
            } else if(res.code == 404 && res.message === "no data !") {
                finished.value = true
            } else if(cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login', {}, {}, 'replace')
            } else {
                cns.$toast(res.message)
            }
        })
        page.value++
    } else {
        loading.value = false
    }
}

</script>

<style scoped lang="scss">
.coupon-container{
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
    .ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    :deep(.van-sticky--fixed) {
        top: inherit;
    }

    .exchange-top {
        height: 0.9rem;
        box-sizing: border-box;
        padding: 0.1rem 0.2rem;
        background-color: #fff;
        overflow: hidden;
        border-radius: 0.1rem;
        width: 7.1rem;
        margin: 0 auto;
    }
    .coupon-index ::v-deep .van-sticky--fixed{
        top:auto;
    }
    .coupon-index .van-cell {
        width: 5.6rem;
        height: 0.7rem;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .coupon-index .exchange-inp ::v-deep .van-cell{
        padding: 0;
    }
    .coupon-index .exchange-inp .van-field__label {
        font-size: 0.26rem;
    }
    .coupon-index .exchange-inp input {
        font-size: 0.24rem;
    }
    .exchange-btn {
        width: 1.16rem;
        height: 0.48rem;
        line-height: 0.48rem;
        text-align: center;
        background: #0062EA;
        border-radius: 0.04rem;
        font-size: 0.24rem;
        color: #ffffff;
    }
    .exchange-btn.disabled { background: #909399; }


    .coupon-index .van-nav-bar .van-nav-bar__left {
        left: 11px;
    }
    .coupon-index .van-nav-bar .van-icon {
        font-size: 24px;
        color: #333333;
    }
    .coupon-index .van-nav-bar .iconfont {
        color: #666666;
    }

    .coupon-index {
        margin-top: -0.1rem;
    }
    .coupon-index .coupon-list .coupon-list-item {
        width: 7.1rem;
        margin: 0.2rem auto auto;
        position: relative;
    }
    .coupon-index .coupon-list .coupon-list-item {
        box-shadow: 0 2px 10px -4px #cccccc;
        -weblit-box-shadow: 0 2px 10px -4px #cccccc;
        -moz-box-shadow: 0 2px 10px -4px #cccccc;
        -ms-box-shadow: 0 2px 10px -4px #cccccc;
        position: relative;
    }
    .coupon-index .coupon-list .coupon-list-item .coupon-list-info {
        padding: 0 0.25rem;
        background: url("@/assets/images/property/coupon/couponBack.jpg") center no-repeat;
        background-size: 100% 100%;
        border-radius: 0.1rem;
    }
    .coupon-list-item .coupon-item-le {
        width: 2rem;
        line-height: 1.82rem;
        padding-left: 0.2rem;
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
        display:flex;
        flex-direction: column;
        justify-content: center;
    }
    .coupon-list-item .coupon-item-cen h1 {
        line-height: 0.42rem;
        color: #333333;
    }
    .coupon-list-item .coupon-item-cen h1 label {
        font-weight: bold;
        font-size: 0.26rem;
        max-width: 3rem;
        line-height: 0.32rem;
        color: #343434;
    }
    .coupon-list-item .coupon-item-cen h1 span {
        font-size: 0.28rem;
        color: #999999;
    }
    .coupon-list-item .coupon-item-cen h2 {
        line-height: 0.38rem;
        font-size: 0.2rem;
        color: #666666;
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
        color: #F81212;
    }
    .coupon-list-item .coupon-item-rg .coupon-btn {
        width: 1.16rem;
        height: 0.48rem;
        line-height: 0.48rem;
        text-align: center;
        background: linear-gradient(270deg, #F71212, #FA6060);
        font-size: 0.24rem;
        color: #ffffff;
        border-radius: 0.04rem;
    }
    .coupon-list .coupon-desc {
        width: 6.3rem;
        line-height: 0.3rem;
        padding: 0.14rem 0.56rem 0.14rem 0.22rem;
        margin: 0.04rem auto 0;
        background-color: #fff;
        font-size: 0.2rem;
        color: #666666;
        position: relative;
        border-radius: 0 0 0.1rem 0.1rem;
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
        height: 1rem;
        line-height: 1.3rem;
        color: #00a0e9;
    }
    .coupon-add.fixed {
        background-color: #f2f2f2;
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
        height: 0.4rem;
        line-height: 0.4rem;
    }
}

/*无数据*/
.no-Data{
    width: 100%;
    height: 80vh;
    text-align: center;
    font-size: 0.28rem;
    padding: 1rem auto!important;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.no-Img{
    width: 6.1rem;
    height: 2.73rem;
    margin-top: 3.17rem;
    margin-bottom: .75rem;
}
.new-guest { padding: 4px 0.1rem; background: linear-gradient(to right, #FCB011, #FDC95E); border-radius: 0.1rem 0; font-size: 0.24rem; color: #ffffff; position: absolute; left: 0; top: 0; }
.new-guest.disabled { background: linear-gradient(to right, #CCCCCC, #DCDCDC); }
</style>
