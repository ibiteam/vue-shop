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
        <div class="order-main" v-else>
<!--            物流-->
            <div class="orderDetail-module order-wuliu" v-if="orderDetailData.logistics" @click="toWuliu">
                <div class="order-wuliu-head s-flex ai-ct jc-bt">
                    <div class="s-flex ai-ct">
                        <img src="@/assets/images/order/m-car.png">
                        <div>{{ orderDetailData.logistics.title }}</div>
                    </div>
                    <i class="iconfont">&#xe60b;</i>
                </div>
                <div class="order-wuliu-desc">{{ orderDetailData.logistics.description }}</div>
                <div class="order-wuliu-date" v-if="orderDetailData.logistics.shipped_at">{{ orderDetailData.logistics.shipped_at }}</div>
            </div>
<!--            地址-->
            <div class="orderDetail-module order-address" v-if="orderDetailData.address">
                <div class="order-address-head s-flex ai-ct">
                    <img src="@/assets/images/order/m-location.png">
                    <span>{{orderDetailData.address.consignee}}</span>
                    <span>{{orderDetailData.address.phone}}</span>
                </div>
                <div class="order-address-info elli-2">地址：{{orderDetailData.address.address}}</div>
            </div>
<!--            商品-->
            <div class="orderDetail-module order-goods">
                <div class="goods-wrap">
                    <template v-for="(item,index) in orderDetailData.items" :key="index">
                        <div class="goods-box s-flex" @click.stop="appRoute('good', {goods_no: item.goods_no})">
                            <div class="goods-img"><img :src="item.goods_image" alt=""></div>
                            <div class="goods-info flex-1 s-flex jc-bt flex-dir">
                                <div>
                                    <div class="goods-name elli-1">{{item.goods_name}}</div>
                                    <div class="goods-attr elli-2">{{item.sku_value}}</div>
                                </div>
                                <div class="s-flex jc-bt ai-ct" style="margin: 0.2rem 0 0.1rem">
                                    <form-price :price="item.goods_price" weight="bold"></form-price>
                                    <div class="goods-num">x{{item.number}}{{item.goods_unit}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="goods-after-sale s-flex jc-fe" v-if="item.refund_action != 0">
                            <div class="goods-after-btn" @click.stop="afterSale(item)" :class="{'goods-after-red':item.refund_action == '2'||item.refund_action == '3'}">{{ item.refund_action == '2' ? '退款中' : item.refund_action == '3' ? '退款成功' : '申请售后' }}</div>
                        </div>
                    </template>
                </div>
            </div>
<!--            订单-->
            <div class="orderDetail-module order-info" v-if="!expand">
                <div class="order-info-box">
                    <div class="order-info-model s-flex ai-ct jc-bt">
                        <div class="co-999 fs28">应付款：</div>
                        <form-price :price="orderDetailData.amounts.order_amount" weight="600" sign_size="24" INT_size="36" DF_size="24"></form-price>
                    </div>
                    <div class="order-info-model s-flex ai-ct jc-bt">
                        <div class="co-999 fs28">订单号：</div>
                        <div class="s-flex ai-ct">
                            <div class="co-333 fs28">{{orderDetailData.order.order_sn}}</div>
                            <div class="copy-order s-flex ai-ct jc-ct" :data-clipboard-text="copyOrder" @click="copyOrders" style="margin-left: 0.2rem;">复制</div>
                        </div>
                    </div>
                    <div class="order-info-model s-flex ai-ct jc-bt">
                        <div class="co-999 fs28">订单状态：</div>
                        <div class="co-333 fs28">{{ orderStatus(orderDetailData.order.status) }}</div>
                    </div>
                    <div class="s-flex jc-ct expand-btn">
                        <span style="width: 2.2rem" @click="expand = !expand ">展开完整信息<img src="@/assets/images/order/expand-down.png" alt="" style="width: 0.16rem;height: 0.1rem;margin-left: 0.06rem"></span>
                    </div>
                </div>
            </div>
            <template v-if="expand">
                <div class="orderDetail-module order-info">
                    <div class="order-info-box">
                        <div class="order-info-model s-flex ai-ct">
                            <div class="co-999 fs28 wd15">订单号：</div>
                            <div class="s-flex ai-ct">
                                <div class="co-333 fs28">{{orderDetailData.order.order_sn}}</div>
                                <div class="copy-order s-flex ai-ct jc-ct" :data-clipboard-text="copyOrder" @click="copyOrders" style="margin-left: 0.2rem;">复制</div>
                            </div>
                        </div>
                        <div class="order-info-model s-flex ai-ct">
                            <div class="co-999 fs28 wd15">订单状态：</div>
                            <div class="co-333 fs28">{{ orderStatus(orderDetailData.order.status) }}</div>
                        </div>
                        <div class="order-info-model s-flex ai-ct">
                            <div class="co-999 fs28 wd15">支付时间：</div>
                            <div class="co-333 fs28">{{ orderDetailData.order.paid_at?orderDetailData.order.paid_at:'暂无' }}</div>
                        </div>
                        <div class="order-info-model s-flex ai-ct">
                            <div class="co-999 fs28 wd15">留言信息：</div>
                            <div class="co-333 fs28">{{ orderDetailData.order.remark?orderDetailData.order.remark:'暂无' }}</div>
                        </div>
                    </div>
                </div>
                <div class="orderDetail-module order-info">
                    <div class="order-info-box">
                        <div class="order-info-model s-flex ai-ct jc-bt">
                            <div class="co-999 fs28">商品总额：</div>
                            <div class="co-333 fs28">{{ orderDetailData.amounts.goods_amount }}</div>
                        </div>
                        <div class="order-info-model s-flex ai-ct jc-bt">
                            <div class="co-999 fs28">已付款：</div>
                            <div class="co-333 fs28">{{ orderDetailData.amounts.money_paid }}</div>
                        </div>
                        <div class="order-info-model s-flex ai-ct jc-bt">
                            <div class="co-999 fs28">运费：</div>
                            <div class="co-333 fs28">{{ orderDetailData.amounts.shipping_fee }}</div>
                        </div>
                        <div class="order-info-model s-flex ai-ct jc-bt">
                            <div class="co-999 fs28">优惠券：</div>
                            <div class="co-333 fs28">{{ orderDetailData.amounts.coupon_amount }}</div>
                        </div>
                        <div class="order-info-model s-flex ai-ct jc-bt">
                            <div class="co-999 fs28">{{ integral_name }}：</div>
                            <div class="co-333 fs28">{{ orderDetailData.amounts.integral }}</div>
                        </div>
                        <div class="s-flex jc-fe order-amount">
                            <div class="co-333 fw-b fs28">应付款：</div>
                            <form-price :price="orderDetailData.amounts.order_amount" weight="600" sign_size="24" INT_size="34" DF_size="24"></form-price>
                        </div>
                        <div class="s-flex jc-ct expand-btn">
                            <span @click="expand = !expand ">收起<img src="@/assets/images/order/expand-up.png" alt="" style="width: 0.16rem;height: 0.1rem;margin-left: 0.06rem"></span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import {getOrderDetail,} from "@/api/order.js";
import { useRoute } from 'vue-router'
import Clipboard from "clipboard"
import {getShopConfig} from "@/utils/public.js";
import {refundVerifyAxios} from "@/api/order.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const title = ref('订单详情')
const page_load = ref(true)
const expand = ref(false)
const orderDetailData = ref({})
const page_title = ref('请求出错了')
const copyOrder = ref('')
const integral_name = ref('')

onMounted( async () => {
    if (JSON.parse(sessionStorage.getItem('shop-config')) && JSON.parse(sessionStorage.getItem('shop-config')).integral_name){
        integral_name.value = JSON.parse(sessionStorage.getItem('shop-config')).integral_name
    }else{
        let shopConfig = await getShopConfig()
        integral_name.value = shopConfig.integral_name
    }
    getData()
})

const getData = () => {
    getOrderDetail({order_sn:route.query.order_sn}).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            page_load.value = false
            orderDetailData.value = res.data
            copyOrder.value = res.data.order.order_sn
            title.value = orderStatus(res.data.order.status)
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
            page_title.value = res.message
        }
    }).catch(err => {
        console.log(err)
    })
}

const orderStatus = (status) => {
    let status_txt = ''
    if (status == 1){
        status_txt = '待确认'
    }else if (status == 2){
        status_txt = '已取消'
    }else if (status == 3){
        status_txt = '待付款'
    }else if (status == 4){
        status_txt = '待发货'
    }else if (status == 5){
        status_txt = '待收货'
    }else if (status == 6){
        status_txt = '已完成'
    }else if (status == 7){
        status_txt = '部分发货'
    }
    return status_txt
}

const copyOrders =() =>{
    var clipboard = new Clipboard('.copy-order')
    clipboard.on('success', () => {
        cns.$toast('复制成功!')
    })
    clipboard.on('error', () => {
        cns.$toast('复制失败!')
    })
}

const afterSale = (item) =>{
    if (item.refund_action == 1) {
        refundVerifyAxios({ order_sn:orderDetailData.value.order.order_sn, order_detail_id:item.id }).then(res => {
            if (cns.$constant.isSuccessCode(res)) {
                cns.appRoute('refundEntrance', {order_sn: orderDetailData.value.order.order_sn, order_detail_id:item.id})
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login')
            } else if(res.code === 4006) {
                cns.appRoute('refundDetail', { order_sn:orderDetailData.value.order.order_sn, order_detail_id:item.id })
            } else {
                cns.$toast(res.message)
            }
        })
    }else {
        cns.appRoute('refundDetail', { order_sn:orderDetailData.value.order.order_sn, order_detail_id:item.id })
    }
}

const toWuliu = () =>{
    if(orderDetailData.value.logistics_number>1){
      cns.appRoute('wuliuList', {order_sn: orderDetailData.value.order.order_sn})
    }else{
      cns.appRoute('wuliuDetail', {delivery_no: orderDetailData.value.logistics.delivery_no})
    }
}

</script>

<style scoped lang="scss">
.orderDetail-wrap{
    background: #F4F4F4;
    min-height: 100vh;
    .order-main{
        padding: 0.2rem 0.2rem 0;
        .orderDetail-module{
            margin-bottom: 0.2rem;
            padding: 0.2rem;
            background: #ffffff;
            box-sizing: border-box;
            border-radius: 0.2rem;
        }
        //物流
        .order-wuliu{
            .order-wuliu-head{
                >div{
                    img{
                        width: 0.43rem;
                        height: 0.36rem;
                    }
                    div{
                        font-size: 0.28rem;
                        margin-left: 0.2rem;
                        color: #333;
                        font-weight: 600;
                    }
                }
                .iconfont{
                    font-size: 0.44rem;
                }
            }
            .order-wuliu-desc{
                color: #999;
                font-size: 0.26rem;
                margin-top: 0.2rem;
            }
            .order-wuliu-date{
                color: #333;
                font-size: 0.24rem;
                margin-top: 0.2rem;
            }
        }
        //地址
        .order-address{
            .order-address-head{
                img{
                    width: 0.31rem;
                    height: 0.3rem;
                }
                span{
                    margin-left: 0.3rem;
                    font-size: 0.28rem;
                    color: #333333;
                }
            }
            .order-address-info{
                line-height: .43rem;
                font-size: .24rem;
                color: #999;
                margin-left: .62rem;
                margin-top: 0.1rem;
            }
        }
        //商品
        .order-goods{
            .goods-wrap{
                .goods-box{
                    margin-top: 0.2rem;
                    .goods-img{
                        width: 1.76rem;
                        height: 1.76rem;
                        vertical-align: middle;
                        margin-left: 0;
                        -ms-flex-negative: 0;
                        flex-shrink: 0;
                        -webkit-box-shadow: 0 0 .08rem 0 hsla(0, 0%, 78.4%, .47);
                        box-shadow: 0 0 .08rem 0 hsla(0, 0%, 78.4%, .47);
                        img{
                            width: 100%;
                            height: 100%;
                            vertical-align: middle;
                            border-radius: 10px;
                        }
                    }
                    .goods-info{
                        -ms-flex-negative: 1;
                        flex-shrink: 1;
                        -webkit-box-flex: 1;
                        -ms-flex-positive: 1;
                        flex-grow: 1;
                        margin-left: .2rem;
                        width: 4.8rem;
                        .goods-name{
                            font-size: .26rem;
                            color: #333;
                            width: 100%;
                            line-height: .32rem;
                            overflow: hidden;
                        }
                        .goods-attr{
                            margin: 0.2rem 0 0;
                            font-size: 0.24rem;
                            color: #999999;
                        }
                        .goods-num{
                            color: #333333;
                            font-size: 0.24rem;
                        }
                    }
                }
                .goods-box:first-child{
                    margin-top: 0;
                }
                .goods-after-sale{
                    padding: 0.2rem 0;
                    .goods-after-btn {
                        width: 1.6rem;
                        height: 0.60rem;
                        line-height: 0.62rem;
                        text-align: center;
                        border: 1px solid #333;
                        border-radius: 333px;
                        font-size: 0.28rem;
                        color: #333333;
                        &.goods-after-red {
                            border: 1px solid #F71111;
                            color: #F71111;
                        }
                    }
                }
            }
        }
        //订单
        .order-info{
            .order-info-model{
                height: 0.54rem;
                .wd15{
                    width: 1.5rem;
                }
                .copy-order {
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
            }
            .order-amount{
                height: .84rem;
                line-height: .84rem;
                -webkit-box-pack: end;
                -ms-flex-pack: end;
                font-size: .28rem;
                color: #333;
                margin-top: 0.2rem;
            }
            .expand-btn{
                padding: 0.2rem 0;
                display: flex;
                justify-content: center;
                span{
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
            }
        }
    }
}
</style>
