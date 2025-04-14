<template>
    <div class="orderDetail-wrap">
        <common-header :title="title"></common-header>
        <section v-if="page_load" style="height:100vh;border:1px solid transparent" class="bg-fff">
            <section class="">
                <p style="width:6rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 MT20 ML20"></p>
                <p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
                <p style="width:3rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
            </section>
            <section style="margin-top: 0.6rem;">
                <p style="width:6rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 MT20 ML20"></p>
                <p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
            </section>
            <section style="margin-top: 0.6rem;">
                <div class="MT10">
                    <div class="goods_list s-flex ai-ct">
                        <div class="img-box bg-f2"></div>
                        <div class="s-flex flex-dir flex-1" style="height:1.82rem">
                            <p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB30 bg-f2 ML20"></p>
                            <div style="width:2rem;height:0.5rem;border-radius:0.06rem" class="bg-f2 ML20"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section  style="margin-top: 0.7rem;">
                <div style="width:7.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:6.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:5.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:4.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:3.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
        </section>
        <section v-else style="padding: 0 0.2rem;">
            <div class="order-wrap" v-if="has_data">
                <!--物流信息-->
                <div class="wuliu MB20" @click="toWuliu">
                    <div class="wuliu-icon">
                        <img src="@/assets/images/order/m-car.png">
                        <p class="trace" >运输中</p>
                    </div>
                    <div class="wuliu-con">
                        <p class="wuliu-info">当前订单已拆分成0个运单运输，点击可以查看物流轨迹</p>
                        <p class="wu-time">2025-4-14</p>
                    </div>
                    <div class="right"><i class="iconfont">&#xe60b;</i></div>
                </div>
                <!--买家信息-->
                <div class="com-buyer MB20" v-if="orderDetailData.is_show_receipt_address">
                    <div class="s-flex ai-ct" style="margin-bottom: 0.06rem;">
                        <img class="MR20" src="@/assets/images/order/m-location.png" style="width:0.31rem;height:0.30rem;">
                        <span class="van-ellipsis fs28 co-333">{{orderDetailData.consignee}}</span>
                        <span class="mobile fs28 co-333">{{orderDetailData.mobile}}</span>
                    </div>
                    <p class="address fs26 co-999 elli-2">地址：{{orderDetailData.address}}</p>
                </div>
                <!--商品信息-->
                <div class="com-goods MB20">
                    <div class="goods-rap" >
                        <template v-for="(item,index) in orderDetailData.goods">
                            <div class="">
                                <div class="goods-box" @click="routerPath(orderDetailData.type == 'integral_shop' ? 'integral_good' : (orderDetailData.type == 'jingpai' ? 'jingpai' : (orderDetailData.type == 'fight' ? 'fight' : (orderDetailData.type == 'pre_sale' ? 'pre_sale' : 'goods'))),{'goods_id':item.goods_id}, item)" :key="index">
                                    <div class="img-box"><img :src="item.image" alt=""></div>
                                    <div class="left s-flex flex-dir jc-bt">
                                        <div>
                                            <div class="top" >{{item.goods_name}}</div>
                                            <div class="goods-attr elli-2" >{{item.goods-attr}}</div>
                                            <div></div>
                                        </div>
                                        <div class="bottom MB10">
                                            <div class="price">
                                                <form-price :price="(item.goods_price + '')" weight="bold"></form-price>
                                            </div>
                                            <div class="number">x{{item.goods_number}}<span v-if="item.unit" style="color:#333333;">{{item.unit}}</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="order-after-sale s-flex jc-fe" v-if="item.is_show_after_sales != 0">
                                    <div class="order-after-btn" @click="handleClickAppleAfterSale('myorder_refundIndex', orderId, item.value, item.is_show_after_sales,item.sku_id)">{{ item.is_show_after_sales == '2' ? '退款中' : item.is_show_after_sales == '3' ? '退款成功' : '申请售后' }}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <!--订单信息-->
                <div class="com-order-info MB20">
                    <div class="orderinfo_box" v-if="!expand" style="border-bottom: none;">
                        <div class="divs d-first s-flex ai-ct jc-bt" style="height:0.54rem;">
                            <span class="color_one_999">应付款：</span>
                            <form-price :price="orderDetailData.order_amount" weight="600" sign_size="24" INT_size="36" DF_size="24"></form-price>
                        </div>
                        <div class="divs d-first s-flex ai-ct jc-bt" style="height:0.54rem;">
                            <span class="color_one_999">订单号：</span>
                            <div class="s-flex ai-ct">
                                <span class="color_one">{{orderDetailData.order_sn}}</span>
                                <div class="copy_order s-flex ai-ct jc-ct" :data-clipboard-text="copyOrder" @click="copyOrders" style="margin-left: 0.2rem;">复制</div>
                            </div>
                        </div>
                        <div class="divs s-flex ai-ct jc-bt">
                            <span class="color_one_999">订单状态：</span>
                            <span class="color_one">{{orderDetailData.orderstatus}}</span>
                        </div>
                        <div class="s-flex jc-ct expand">
                            <span style="width: 2.2rem" @click="expand = !expand ">展开完整信息<img src="https://cdn.toodudu.com/2024/09/19/B0fstiTQwed3Z9tBZMQp1ZAuSNt695q9qYjWjyrV.png" alt="" style="width: 0.16rem;height: 0.1rem;margin-left: 0.06rem"></span>
                        </div>
                    </div>
                    <template v-if="expand">
                        <div class="orderinfo_box">
                            <div class="divs d-first s-flex ai-ct" style="height:0.54rem;">
                                <span class="color_one_999">订单号：</span>
                                <span class="color_one">{{orderDetailData.order_sn}}</span>
                                <div class="copy_order s-flex ai-ct jc-ct" :data-clipboard-text="copyOrder" @click="copyOrders">复制</div>
                            </div>
                            <div class="divs">
                                <span class="color_one_999">订单状态：</span>
                                <span class="color_one">{{orderDetailData.orderstatus}}</span>
                            </div>
                            <div class="divs" v-if="orderDetailData.order_add_time">
                                <span class="color_one_999">下单时间：</span>
                                <span class="color_one">{{orderDetailData.order_add_time}}</span>
                            </div>
                        </div>
                        <div class="orderinfo_box" style="padding-top: 0.3rem;">
                            <div class="divs d-first">
                                <span class="color_one_999">支付方式：</span>
                                <span class="color_one">{{ orderDetailData.pay_name }}</span>
                            </div>
                            <div class="divs d-first" v-if="orderDetailData.pay_time">
                                <span class="color_one_999">支付时间：</span>
                                <span class="color_one">{{ orderDetailData.pay_time  }}</span>
                            </div>
                        </div>
                        <!--买家留言-->
                        <div class="com-buyernote">
                            <p><span class="co-999">缺货处理：</span>{{orderDetailData.how_oos}}</p>
                            <p><span class="co-999">买家留言：</span>{{orderDetailData.postscript}}</p>
                        </div>
                    </template>
                </div>
                <template v-if="expand">
                    <!--联系客服-->
                    <!--                    <div class="service s-flex ai-ct jc-ct MB20" @click="goKf">-->
                    <!--                        <img src="@/assets/images/myorder/service.png" alt="" style="width:0.34rem;height:0.28rem;">-->
                    <!--                        <a class="ML20 fs26 co-333">联系客服</a>-->
                    <!--                    </div>-->
                    <!--货币信息-->
                    <div class="com_currency MB20">
                        <div class="currency_box">
                            <div>
                                <span class="co-999">商品总额</span>
                                <span class="co-333 fw_b">{{orderDetailData.goods_amount}}</span>
                            </div>
                            <div  v-if="orderDetailData.type != 'pre_sale'">
                                <span class="co-999">已付款</span>
                                <span class="co-333 fw_b">{{orderDetailData.money_paid}}</span>
                            </div>
                            <div  v-if="orderDetailData.gb_coupon">
                                <span class="co-999">国家补贴</span>
                                <span class="co-333 fw_b">{{orderDetailData.gb_coupon}}</span>
                            </div>
                            <div>
                                <span class="co-999">运费</span>
                                <span class="co-333 fw_b">{{orderDetailData.shipping_fee}}</span>
                            </div>
                            <div v-if="orderDetailData.type == 'manjian'">
                                <span class="co-999">满减</span>
                                <span class="co-333 fw_b">{{orderDetailData.discount}}</span>
                            </div>
                            <div v-if="orderDetailData.coupon && orderDetailData.type != 'pre_sale'">
                                <span class="co-999">优惠券</span>
                                <span class="co-333 fw_b">{{orderDetailData.coupon}}</span>
                            </div>
                            <div v-if="orderDetailData.bonus && orderDetailData.type != 'pre_sale'">
                                <span class="co-999">红包</span>
                                <span class="co-333 fw_b">{{orderDetailData.bonus}}</span>
                            </div>
                            <div v-if="orderDetailData.integral && orderDetailData.type != 'pre_sale'">
                                <span class="co-999">{{ shopConfig.integral_name }}</span>
                                <span class="co-333 fw_b">{{orderDetailData.integral}}</span>
                            </div>
                            <div v-if="orderDetailData.is_group">
                                <span class="co-999">拼团优惠</span>
                                <span class="co-333 fw_b">{{orderDetailData.group_discount}}</span>
                            </div>
                            <div v-if="orderDetailData.show_discount_money">
                                <span class="co-999">优惠</span>
                                <span class="co-333 fw_b">{{orderDetailData.discount_money}}</span>
                            </div>
                        </div>
                        <div class="due">
                            <span class="co-333 fw_b">应付款：</span>
                            <form-price :price="orderDetailData.order_amount" weight="600" sign_size="24" INT_size="34" DF_size="24"></form-price>
                        </div>
                        <div class="s-flex jc-ct expand">
                            <span @click="expand = !expand ">收起<img src="https://cdn.toodudu.com/2024/09/19/MVOGSL0ZuzTvFcHDrb2n54hc8e97mlIhb9xpY7Af.png" alt="" style="width: 0.16rem;height: 0.1rem;margin-left: 0.06rem"></span>
                        </div>
                    </div>
                </template>
                <div class="bg_fff service-bot" v-if="orderDetailData.help_button_data&&orderDetailData.help_button_data.length">
                    <p class="co-333 fs28 fw_b" style="padding: 0.36rem 0 0.1rem;">遇到问题？</p>
                    <div class="s-flex jc-ct expand">
                        <span @click="showChatAction(item)" v-for="item in orderDetailData.help_button_data">{{ item.button_name }}</span>
                    </div>
                </div>
            </div>
            <div class="noData" v-else>
                <img src="@/assets/images/nodata.png">
                <p>{{ page_title }}</p>
            </div>
        </section>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import {getOrderDetail,} from "@/api/order.js";
import { useRoute } from 'vue-router'
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const title = ref('订单详情')
const page_load = ref(true)
const expand = ref(false)
const orderNo = ref('')
const orderDetailData = ref({})
const has_data = ref(true)
const page_title = ref('请求出错了')

onMounted(() => {
    getData()
})

const getData = () => {
    getOrderDetail({no:route.query.no}).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            page_load.value = false
            orderDetailData.value = res.data
            has_data.value = true
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            page_load.value = false
            has_data.value = false
            page_title.value = res.message
        }
    }).catch(err => {
        console.log(err)
    })
}


</script>

<style scoped lang="scss">
body,html{
    background-color:#eeeeee;
}
.orderDetail-wrap{
    .expand{
        padding: 0.2rem 0;
        display: flex;
        justify-content: center;
    }
    .expand span{
        width: 1.2rem;
        height: 0.44rem;
        padding-left: 0.1rem;
        background: #FFFFFF;
        border: 1px solid #999999;
        border-radius: 2.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        box-sizing: border-box;
        font-size: 0.24rem;
    }
    .service-bot{
        padding: 0 0.3rem 0.25rem;
    }
    .service-bot .expand{display: flex;justify-content:  center;}
    .service-bot .expand span{
        width: 3.15rem;
        height: 0.6rem;
        font-size: 0.28rem;
        color: #333333;
        border-radius: 0.34rem;
        padding-left: 0;
        margin: 0 0.1rem;
    }
    .img-box{
        width:1.76rem;
        height:1.76rem;
        background-position:center;
        background-size:100% 100%;
        box-shadow: 0 0 15px 0 rgba(233, 233, 233, 0.55);
        border-radius: 10px;
        margin-left: 0.2rem;
        background-color: #f8f8f8;
    }
    .order-wrap{
        >div{
            border-radius: 0.2rem;
            box-sizing:border-box;
            font-size:0.28rem;
            color:#333;
        }
        .com-order-info{
            width:100%;
            padding:0.33rem 0.28rem 0.1rem 0.28rem;
            background-color:#fff;
            position:relative;
            box-sizing:border-box;
            >div{
                padding-bottom: 0.3rem;
                border-bottom: 1px solid #f2f2f2;
                &:last-of-type{
                    border-bottom: none;
                }
            }
            .orderinfo_box{
                .divs{
                    line-height:0.54rem;
                    font-size:0.24rem;
                    span{
                        font-size:0.28rem;
                    }
                }
                .color_one{
                    color:#333;
                }
                .color_one_999{
                    color:#999;
                }
                .color_two{
                    color:#ec2e48;
                }
                .color_three{
                    color:#999;
                }
                .ziying{
                    position:absolute;
                    top:0.26rem;
                    right:0.2rem;
                    width:0.64rem;
                    height:0.3rem;
                    line-height:0.3rem;
                    border:1px solid #ccc;
                    text-align:center;
                    font-size:0.2rem;
                    color:#ec2e48;
                    border-radius:2px;
                }
                &.active_order{
                    margin-top:0.1rem;
                }
            }
        }
        .com-buyer{
            width:100%;
            box-sizing:border-box;
            padding:0.24rem 0.28rem 0.2rem;
            margin-top:0.2rem;
            background-color:#fff;
            >p{
                line-height:0.43rem;
                font-size:0.24rem;
                color:#999;
            }
            .mobile{
                display:inline-block;
                margin-left:0.3rem;
            }
        }
        .com-goods{
            width:100%;
            margin-top:0.1rem;
            background-color:#fff;
            .goods-rap{
                margin:0 0.28rem;
                .goods-box{
                    width:100%;
                    display:flex;
                    box-sizing:border-box;
                    padding:0.2rem 0rem;
                    .img-box{
                        width:1.76rem;
                        height:1.76rem;
                        vertical-align:middle;
                        margin-left: 0;
                        flex-shrink:0;
                        box-shadow: 0 0 0.08rem 0 rgba(200,200,200,0.47);
                        img{
                            width:100%;
                            height:100%;
                            vertical-align:middle;
                            border-radius: 10px;
                        }
                    }
                    .left{
                        flex-shrink:1;
                        flex-grow:1;
                        margin-left:0.2rem;
                        width: 4.8rem;
                        .top{
                            font-size:0.26rem;
                            color:#333;
                            width:100%;
                            max-height:0.62rem;
                            line-height:0.32rem;
                            overflow:hidden;
                            display: -webkit-box;
                            -webkit-line-clamp:2;
                            -webkit-box-orient: vertical;
                        }
                        .bottom{
                            display:flex;
                            justify-content:space-between;
                            height:0.4rem;
                            margin-top:0.22rem;
                            .price{
                                font-size:0.28rem;
                                color:#F61D4A;
                                .symbol{
                                    font-size:0.24rem;
                                    font-weight:bold;
                                }
                                .integer{
                                    margin-right:-0.05rem;
                                    font-size:0.30rem;
                                    font-weight:bold;
                                }
                                .decimal{
                                    font-size:0.24rem;
                                }
                            }
                            .number{
                                font-size:0.24rem;
                            }
                        }
                    }
                    &:last-child{
                        border-bottom:none;
                    }
                }
                .goods-attr {
                    max-height: 0.62rem;
                    margin: 0.15rem 0;
                    font-size: 0.24rem;
                    color: #999999;
                }
            }
        }
        .com-buyernote{
            background-color:#fff;
            padding:0.3rem 0;
            p{
                line-height:0.34rem;
                padding: 0.1rem 0;
                font-size:0.28rem;
                color:#666;
                span{
                    font-size: 0.28rem;
                    .btn{
                        width: 1.72rem;
                        height: 0.44rem;
                        font-size: 0.22rem;
                        background: #FFFFFF;
                        border: 1px solid #999999;
                        border-radius: 3.4rem;
                        color: #333333;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                }
            }
        }
        .com_currency{
            margin-top:0.2rem;
            background-color:#fff;
            padding:0 0.28rem;
            .currency_box{
                padding:0.2rem 0;
                div{
                    height:0.6rem;
                    line-height:0.6rem;
                    font-size:0.28rem;
                    color:#666;
                    display:flex;
                    justify-content:space-between;
                }
                span{
                    font-size:0.28rem;
                }
            }
            .due{
                height:0.84rem;
                line-height:0.84rem;
                display:flex;
                justify-content:flex-end;
                font-size:0.28rem;
                color:#333;
                .co-333{
                    font-size:0.28rem;
                }
            }
        }
    }
    .address {
        margin-left: 0.52rem;
        word-break: break-all;
    }
    /*物流信息*/
    .wuliu {
        width: 100%;
        background: #fff;
        margin-top: 0.2rem;
        padding: 0.2rem 0.3rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
        .wuliu-icon {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: left;
            color: #fff;
            flex-wrap: nowrap;
            padding: 0.2rem 0 0.2rem;
            flex: 1 1;
            img{
                width: 0.43rem;
                height: 0.36rem;
            }
            p{
                font-size: 0.28rem;
                line-height: 0.36rem;
                margin-left: 0.2rem;
                color: #333;
                font-weight: 600;
            }
        }
        .trace {
            font-size: 0.24rem;
        }
        .wuliu-info {
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            word-break: break-all;
            overflow: hidden;
            color: #999;
            font-size: 0.26rem;
            line-height: 0.36rem;
            padding-bottom: 0.1rem;
        }
        .right {
            position: absolute;
            right: 0.1rem;
            top: 0;
            bottom: 0;
            margin: auto;
            color: #999;
            display: flex;
            align-items: center;
        }
        .wu-time {
            color: #333;
            font-size: 0.24rem;
            padding-bottom: 0.10rem;
        }
    }
    .iconfont {
        font-size: 0.44rem;
        .iconfont{  font-size: 0.46rem;}
    }
    /*联系客服*/
    .service {
        padding: 0.28rem;
        background: #fff;
        border-radius: 0  0   0.2rem  0.2rem;
        box-shadow: 0 -4px 21px 0 rgba(233, 233, 233, 0.55);
    }
    /*没有数据*/
    .noData {
        margin-top: 2.4rem;
    }
    .copy_order {
        width: 0.75rem;
        height: 0.46rem;
        line-height: 0.46rem;
        border-radius: 0.23rem;
        font-size: 0.24rem !important;
        color: #333;
        background: #F2F2F2;
        box-sizing: border-box;
        margin-left: 0.4rem;
    }
    /*申请售后按钮*/
    .order-after-sale { padding: 0.2rem 0; }
    .order-after-sale .order-after-btn { width: 1.6rem; height: 0.60rem; line-height: 0.62rem; text-align: center; border: 1px solid #333; border-radius: 333px; font-size: 0.28rem; color: #333333; }
    .order-after-sale .order-after-btn.status { border: 1px solid #F71111; color: #F71111; }
}
</style>
