<template>
    <main class="ucenter-main-container">
        <div class="ucenter-head-fix" v-if="head_opacity > 0" :style="{opacity: head_opacity}">我的</div>
        <div class="ucenter-head">
            <div class="ucenter-head-main" v-if="user_load">
                <div class="head-icon-box s-flex jc-fe ai-ct"></div>
                <div class="head-info-box s-flex">
                    <div class="head-tx">
                        <img src="@/assets/images/ucenter/portait.jpeg" alt="">
                    </div>
                </div>
            </div>
            <div class="ucenter-head-main" v-else>
                <div class="head-icon-box s-flex jc-fe ai-ct">
                    <div @click="toPage('set')" class="s-flex ai-ct">
                        <img src="@/assets/images/ucenter/set.png" alt="">
                        <div>设置</div>
                    </div>
                </div>
                <!--            用户信息-未登录-->
                <div class="head-info-box s-flex" v-if="unLogin">
                    <div class="head-tx">
                        <img src="@/assets/images/ucenter/portait.jpeg" alt="">
                    </div>
                    <div class="user-info flex-1">
                        <div class="s-flex jc-bt">
                            <div class="info-name" style="margin-top: 0.38rem">
                                <span @click="toPage('login')">登录/</span><span @click="toPage('register')">注册</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!--            用户信息-已登录-->
                <div class="head-info-box s-flex" v-else>
                    <div class="head-tx" @click="toPage('userInfo')">
                        <van-image :src="userInfo.portrait" class="portrait">
                            <template v-slot:loading>
                                <img src="@/assets/images/ucenter/portait.jpeg" alt="">
                            </template>
                            <template v-slot:error>
                                <img src="@/assets/images/ucenter/portait.jpeg" alt="">
                            </template>
                        </van-image>
                    </div>
                    <div class="user-info flex-1">
                        <div class="s-flex jc-bt">
                            <div @click="toPage('userInfo')">
                                <div class="info-name" v-if="userInfo.nickname">{{userInfo.nickname}}</div>
                                <div class="info-name" v-else>未设置昵称</div>
                                <div class="user_name">用户名：{{userInfo.user_name}}</div>
                            </div>
                            <div class="info-improve" @click="toPage('userInfo')">完善信息<i class="iconfont" style="vertical-align: bottom">&#xe60b;</i></div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="component_load">
                <div class="bg-fff" style="border-radius: 0.2rem;margin: 0.35rem 0.2rem 0;padding: 0.4rem 0.2rem">
                    <div class="s-flex jc-ad">
                        <div style="width: 1.5rem;height: 0.5rem;background: #f8f8f8"></div>
                        <div style="width: 1.5rem;height: 0.5rem;background: #f8f8f8"></div>
                    </div>
                    <div class="s-flex jc-bt MT40">
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                    </div>
                </div>
                <div class="bg-fff" style="border-radius: 0.2rem;margin: 0.1rem 0.2rem 0;padding: 0.4rem 0.2rem">
                    <div class="s-flex jc-bt">
                        <div style="width: 1.6rem;height: 0.5rem;background: #f8f8f8"></div>
                        <div style="width: 1.2rem;height: 0.5rem;background: #f8f8f8"></div>
                    </div>
                    <div class="s-flex jc-bt MT40">
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                    </div>
                </div>
                <div class="bg-fff" style="border-radius: 0.2rem;margin: 0.1rem 0.2rem 0;padding: 0.4rem 0.2rem">
                    <div class="s-flex jc-bt">
                        <div style="width: 1.8rem;height: 0.5rem;background: #f8f8f8"></div>
                    </div>
                    <div class="s-flex jc-bt MT40">
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                    </div>
                    <div class="s-flex jc-bt MT20">
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                        <div style="width: 1rem;height: 1rem;background: #f8f8f8"></div>
                    </div>
                </div>
            </div>
            <template v-else>
                <!--            订单模块-->
                <div class="order-box">
                    <div class="order-join s-flex ai-ct jc-bt">
                        <strong>订单</strong>
                        <p class="s-flex ai-ct" @click="toPage('orderList','all')">全部 <em class="iconfont">&#xe60b;</em></p>
                    </div>
                    <div class="order-main s-flex">
                        <div class="order-model" @click="toPage('orderList','not_pay')">
                            <img src="@/assets/images/ucenter/order_2.png" alt="">
                            <div>待付款</div>
                            <div class="order-model-num">99+</div>
                        </div>
                        <div class="order-model" @click="toPage('orderList','wait_receive')">
                            <img src="@/assets/images/ucenter/order_3.png" alt="">
                            <div>待收货</div>
                            <div class="order-model-num">99+</div>
                        </div>

                        <div class="order-model" @click="toPage('orderList','wait_evaluate')">
                            <img src="@/assets/images/ucenter/order_4.png" alt="">
                            <div>待评价</div>
                            <div class="order-model-num">99+</div>
                        </div>
                        <div class="order-model" @click="toPage('refundList')">
                            <img src="@/assets/images/ucenter/order_5.png" alt="">
                            <div>退款/售后</div>
                        </div>
                    </div>
                </div>
                <!--            我的资产模块-->
                <div class="assert-box">
                    <div class="assert-join s-flex ai-ct jc-bt">
                        <strong>资产</strong>
                    </div>
                    <div class="assert-main s-flex jc-bt">
                        <div class="assert-model" @click="toPage('coupon')">
                            <img src="@/assets/images/ucenter/coupon.png" alt="">
                            <div>优惠券</div>
                        </div>
                        <div class="assert-model" @click="toPage('redPack')">
                            <img src="@/assets/images/ucenter/redPack.png" alt="">
                            <div>红包</div>
                        </div>
                        <div class="assert-model" @click="toPage('integral')">
                            <img src="@/assets/images/ucenter/integral.png" alt="">
                            <div>积分</div>
                        </div>
                        <div class="assert-model" @click="toPage('balance')">
                            <img src="@/assets/images/ucenter/balance.png" alt="">
                            <div>余额</div>
                        </div>
                    </div>
                </div>
<!--                菜单模块-->
                <div class="menu-box">
                    <div class="menu-main s-flex flex-wrap">
                        <div class="menu-model" @click="toPage('address')">
                            <img src="@/assets/images/ucenter/address.png" alt="">
                            <div>收货地址</div>
                        </div>
                        <div class="menu-model" @click="toPage('attention')">
                            <img src="@/assets/images/ucenter/attention.png" alt="">
                            <div>商品收藏</div>
                        </div>
                        <div class="menu-model" @click="toPage('record')">
                            <img src="@/assets/images/ucenter/history.png" alt="">
                            <div>浏览记录</div>
                        </div>
                        <div class="menu-model">
                            <img src="@/assets/images/ucenter/chat.png" alt="">
                            <div>联系客服</div>
                        </div>
                    </div>
                </div>
                <recommend-column></recommend-column>
            </template>
        </div>
    </main>
</template>

<script setup>
import RecommendColumn from '../../components/recommendColumn/RecommendColumn'
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
const cns = getCurrentInstance().appContext.config.globalProperties
const head_opacity = ref(0)
const user_load = ref(true)
const unLogin = ref(true)
const component_load = ref(true)
const userInfo =ref({
    "user_id": 68378,
    "pay_points": 0,
    "bonus": 0,
    "coupon": 0,
    "user_money": "0.00",
    "user_name": "\u94b1\u70ef\u8c6a",
    "seller_id": 0,
    "user_type": 1,
    "mobile_phone": "15052129209",
    "portrait": "https:\/\/cdn.toodudu.com\/2024\/07\/31\/5ghssxz6iQxgUo5RHgqkApyk0hgiygR0SKZWXvY5.png",
    "nickname": "\u94b1\u70ef\u8c6a",
    "cert_status": 3,
    "company": "3****************6",
    "is_attestation": 1,
    "trader_user": "",
    "trader_id": "",
    "trader_phone": "",
    "cart_number": 1,
    "wait_comment_count": 0,
    "all_integral": 839040,
    "wait_confirm": 0,
    "wait_pay": 0,
    "wait_receive": 0,
    "my_assert_url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/myAsset",
    "wait_comment_link": "https:\/\/test-tooduduh5.ptdplat.com\/#\/myEvaluate",
    "my_coupon_link": "https:\/\/test-tooduduh5.ptdplat.com\/#\/coupon",
    "my_bonus_link": "https:\/\/test-tooduduh5.ptdplat.com\/#\/redPacket",
    "my_goods_link": "https:\/\/test-tooduduh5.ptdplat.com\/#\/attention?type=good",
    "my_shop_link": "https:\/\/test-tooduduh5.ptdplat.com\/#\/attention?type=shop",
    "collect": {
        "shop_num": "0",
        "goods_num": "0"
    }
})

onMounted(() => {
    setTimeout(() => {
        user_load.value = false
        setTimeout(() => {
            unLogin.value = false
            component_load.value = false
        }, 1000)
    }, 1000)
})

const toPage = (name,type) => {
    if (unLogin.value && name != 'set' && name != 'register'){
        cns.appRoute('login')
    }else{
        if (name == 'orderList'){
            cns.appRoute(name,{type:type})
        }else{
            cns.appRoute(name)
        }
    }
}
</script>

<style lang='scss' scoped>
.ucenter-main-container {
    background: #F8F8F8;
    .ucenter-head-fix{
        position: fixed;
        width: 7.5rem;
        height: 0.88rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        z-index: 100;
        box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.08);
        font-size: 0.32rem;
    }
    .ucenter-head{
        background-color: #F8F8F8;
        width: 100%;
        .ucenter-head-main{
            height: 2.4rem;
            background-image: url("@/assets/images/ucenter/ucenter-back.png");
            background-repeat: no-repeat;
            background-size: 100% auto;
        }
        //头部icon模块
        .head-icon-box{
            height: 1rem;
            >div{
                margin-right: 0.4rem;
                >img{
                    width: 0.32rem;
                    height: 0.32rem;
                }
                >div{
                    font-size: 0.24rem;
                    color: #3D3D3D;
                    margin-left: 0.1rem;
                }
            }
        }
        //用户信息模块
        .head-info-box{
            .head-tx{
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                background: #fff;
                overflow: hidden;
                box-sizing: border-box;
                margin-top: 0.08rem;
                margin-left:0.3rem;
                ::v-deep img{
                    width: 1rem;
                    height: 1rem;
                }
            }
            .user-info{
                margin-left:0.2rem;
                .info-name{
                    color: #333333;
                    font-weight: 600;
                    font-size: 0.36rem;
                    margin-top: 0.1rem;
                    span{
                        color: #333333;
                        font-weight: 600;
                        font-size: 0.32rem;
                    }
                }
                .info-set{
                    width: 0.33rem;
                    height: 0.36rem;
                    margin-right: 0.4rem;
                    margin-top: 0.38rem;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .info-improve{
                    width: 1.8rem;
                    height: 0.6rem;
                    background-image: url("@/assets/images/ucenter/improve.png");
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    color: #966526;
                    font-size: 0.28rem;
                    padding-left: 0.28rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 0.3rem 0 0 0.3rem;
                    box-sizing: border-box;
                    overflow: hidden;
                    margin-top: 0.1rem;
                }
                .user_name{
                    font-size: 0.22rem;
                    color: #666666;
                    margin-top: 0.1rem;
                }
            }
        }
        //订单模块
        .order-box{
            background: #ffffff;
            margin: 0.25rem 0.2rem 0;
            padding: 0 0.2rem;
            border-radius: 0.2rem;
            .order-join {
                padding: 0.3rem 0.1rem 0 0.1rem;
                strong { font-size: 0.28rem; font-weight: bold;color: #333333 }
                p { font-size: 0.26rem; color: #666666; }
                p em { margin-left: 0.1rem; font-size: 0.4rem; }
            }
            .order-main{
                padding: 0.46rem 0 0.4rem;
                .order-model{
                    width: 25%;
                    text-align: center;
                    position: relative;
                    img{
                        width: 0.48rem;
                        height: 0.48rem;
                    }
                    div{
                        color: #3D3D3D;
                        font-size: 0.26rem;
                        margin-top: 0.2rem;
                    }
                    .order-model-num{
                        position: absolute;
                        min-width: 0.28rem;
                        height: 0.28rem;
                        text-align: center;
                        line-height: 0.28rem;
                        color: #ffffff;
                        font-size: 0.2rem;
                        background: #FF3406;
                        border-radius: 0.2rem 0.2rem 0.2rem 0;
                        top: -0.14rem;
                        right: 0.28rem;
                        margin-top: 0;
                    }
                }
            }
        }
        //资产模块
        .assert-box{
            background: #ffffff;
            margin: 0.2rem 0.2rem 0;
            border-radius: 0.2rem;
            padding: 0 0.2rem ;
            .assert-join{
                padding: 0.3rem 0.1rem 0 0.1rem;
                strong { font-size: 0.28rem; font-weight: bold;color: #333333 }
                p { font-size: 0.26rem; color: #666666; }
                p em { margin-left: 0.1rem; font-size: 0.4rem; }
            }
            .assert-main{
                padding: 0.4rem 0 0.2rem;
                .assert-model{
                    width: 25%;
                    text-align: center;
                    >img{
                        width: 0.6rem;
                        height: 0.6rem;
                    }
                    >div{
                        font-size: 0.26rem;
                        color: #3D3D3D;
                        margin-top: 0.2rem;
                    }
                }
            }
        }
        //菜单模块
        .menu-box{
            background: #ffffff;
            margin: 0.4rem 0.2rem 0;
            border-radius: 0.2rem;
            padding: 0 0.2rem ;
            .menu-main{
                padding: 0.4rem 0 0.2rem;
                .menu-model{
                    width: 25%;
                    text-align: center;
                    >img{
                        width: 0.6rem;
                        height: 0.6rem;
                    }
                    >div{
                        font-size: 0.26rem;
                        color: #3D3D3D;
                        margin-top: 0.2rem;
                    }
                }
            }
        }
    }
}
</style>
