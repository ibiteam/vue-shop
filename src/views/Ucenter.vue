<template>
    <main class="ucenter-main-container">
        <div class="ucenter-head-fix" v-if="head_opacity > 0" :style="{opacity: head_opacity}">我的</div>
        <div class="ucenter-head">
            <template v-if="user_load">
                <div class="head-info-box s-flex">
                    <div class="head-tx">
                        <img src="https://cdn.toodudu.com/uploads/2022/01/12/portait.jpeg" alt="">
                    </div>
                </div>
            </template>
            <template v-else>
                <!--            用户信息-未登录-->
                <div class="head-info-box s-flex" v-if="unLogin">
                    <div class="head-tx">
                        <img src="https://cdn.toodudu.com/uploads/2022/01/12/portait.jpeg" alt="">
                    </div>
                    <div class="user-info flex-1">
                        <div class="s-flex jc-bt">
                            <div class="info-name" style="margin-top: 0.38rem">
                                <span>登录/</span><span>注册</span>
                            </div>
                            <div class="info-set">
                                <img src="https://cdn.toodudu.com/uploads/2023/10/20/set.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <!--            用户信息-已登录-->
                <div class="head-info-box s-flex" v-else>
                    <div class="head-tx">
                        <van-image :src="userInfo.portrait" class="portrait">
                            <template v-slot:loading>
                                <img src="https://cdn.toodudu.com/uploads/2022/01/12/portait.jpeg" alt="">
                            </template>
                            <template v-slot:error>
                                <img src="https://cdn.toodudu.com/uploads/2022/01/12/portait.jpeg" alt="">
                            </template>
                        </van-image>
                    </div>
                    <div class="user-info flex-1">
                        <div class="s-flex jc-bt">
                            <div>
                                <div class="info-name" v-if="userInfo.nickname">{{userInfo.nickname}}</div>
                                <div class="info-name" v-else>未设置昵称</div>
                                <div class="user_name">用户名：{{userInfo.user_name}}</div>
                            </div>
                            <div class="info-set">
                                <img src="https://cdn.toodudu.com/uploads/2023/10/20/set.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </template>
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
                    <div class="order-head s-flex">
                        <div class="s-flex ai-ct jc-ct">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/26/good-attention.png" alt="">
                            <div class="MR10">商品关注</div>
                            <div>10</div>
                        </div>
                        <div class="s-flex ai-ct jc-ct">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/26/shop_attention.png" alt="">
                            <div class="MR10">店铺关注</div>
                            <div>10</div>
                        </div>
                    </div>
                    <div class="order-join s-flex ai-ct jc-bt">
                        <strong>我的订单</strong>
                        <p class="s-flex ai-ct">全部 <em class="iconfont">&#xe60b;</em></p>
                    </div>
                    <div class="order-main s-flex">
                        <div class="order-model">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/25/组 503@3x.png" alt="">
                            <div>待确认</div>
                            <!--                        <div class="order-model-num" v-if="ite.count && ite.count < 100">{{ite.count}}</div>-->
                            <div class="order-model-num">99+</div>
                        </div>
                        <div class="order-model">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/25/组 503@3x.png" alt="">
                            <div>待付款</div>
                            <div class="order-model-num">99+</div>
                        </div>
                        <div class="order-model">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/25/组 503@3x.png" alt="">
                            <div>待收货</div>
                            <div class="order-model-num">99+</div>
                        </div>
                        <div class="order-model">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/25/组 503@3x.png" alt="">
                            <div>待评价</div>
                            <div class="order-model-num">99+</div>
                        </div>
                        <div class="order-model">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/25/组 503@3x.png" alt="">
                            <div>退款/售后</div>
                        </div>
                    </div>
                </div>
                <!--            我的资产模块-->
                <div class="assert-box">
                    <div class="assert-join s-flex ai-ct jc-bt">
                        <strong>我的资产</strong>
                        <p class="s-flex ai-ct">全部 <em class="iconfont">&#xe60b;</em></p>
                    </div>
                    <div class="assert-main s-flex jc-bt">
                        <div class="assert-model">
                            <div :class="unLogin?'no-fw':''">
                                {{unLogin?'--':100}}
                                <span v-if="!unLogin" class="assert-model-txt">张</span>
                            </div>
                            <div>优惠券</div>
                        </div>
                        <div class="assert-model">
                            <div :class="unLogin?'no-fw':''">
                                {{unLogin?'--':100}}
                                <span v-if="!unLogin" class="assert-model-txt">张</span>
                            </div>
                            <div>红包</div>
                        </div>
                        <div class="assert-model">
                            <div :class="unLogin?'no-fw':''">
                                <span v-if="!unLogin" class="assert-model-txt fw_b">￥</span>
                                {{unLogin?'--':100}}
                            </div>
                            <div>100可抵</div>
                        </div>
                        <div class="assert-model">
                            <div :class="unLogin?'no-fw':''">{{unLogin?'--':10000}}</div>
                            <div>积分</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </main>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
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
</script>

<style lang='scss' scoped>
.ucenter-main-container {
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
        background-image: url("https://cdn.toodudu.com/uploads/2023/10/26/mine_back.png");
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-color: #F8F8F8;
        padding-bottom: 0.2rem;
        min-height: 100vh;
        width: 100%;
        //头部icon模块
        .head-icon-box{
            padding-top: 0.36rem;
            height: 0.36rem;
            >div:nth-child(1){
                width: 0.33rem;
                height: 0.36rem;
                margin-right: 0.4rem;
            }
            >div>img{
                width: 100%;
                height: 100%;
            }
        }
        //用户信息模块
        .head-info-box{
            padding-top: 0.4rem;
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
                    background-image: url("https://cdn.toodudu.com/uploads/2023/10/26/user_improve.png");
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
            margin: 0.35rem 0.2rem 0;
            padding: 0 0.2rem;
            border-radius: 0.2rem;
            .order-head{
                border-bottom: 1px solid #E5E5E5;
                >div{
                    width: 50%;
                    margin:0.25rem 0;
                    font-size: 0.24rem;
                    color: #333333;
                    img{
                        width: 0.3rem;
                        height: 0.3rem;
                        margin-right: 0.2rem;
                    }
                    >div{
                        color: #333333;
                        font-size: 0.24rem;
                    }
                }
                >div:nth-child(1){
                    border-right: 1px dashed #D8D8D8;
                }
            }

            .order-join {
                padding: 0.3rem 0.1rem 0 0.1rem;
                strong { font-size: 0.28rem; font-weight: bold;color: #333333 }
                p { font-size: 0.26rem; color: #666666; }
                p em { margin-left: 0.1rem; font-size: 0.4rem; }
            }
            .order-main{
                padding: 0.46rem 0 0.4rem;
                .order-model{
                    width: 20%;
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
            margin: 0.1rem 0.2rem 0;
            border-radius: 0.2rem;
            padding: 0 0.2rem ;
            .assert-join{
                padding: 0.3rem 0.1rem 0 0.1rem;
                strong { font-size: 0.28rem; font-weight: bold;color: #333333 }
                p { font-size: 0.26rem; color: #666666; }
                p em { margin-left: 0.1rem; font-size: 0.4rem; }
            }
            .assert-main{
                padding: 0.4rem 0 0.35rem;
                .assert-model{
                    width: 25%;
                    text-align: center;
                    >div:nth-child(1){
                        font-size: 0.4rem;
                        color: #3D3D3D;
                        height: 0.48rem;
                        line-height: 0.48rem;
                        font-weight: bold;
                    }
                    >div:nth-child(2){
                        font-size: 0.26rem;
                        color: #3D3D3D;
                        margin-top: 0.4rem;
                    }
                    .assert-model-txt{
                        font-size: 0.26rem;
                        color: #3D3D3D;
                    }
                    .no-fw{
                        font-weight: normal!important;
                    }
                }
            }
        }
    }
}
</style>
