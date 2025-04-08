<template>
    <div class="myorder">
        <common-header id="orderHead" :title="title"></common-header>
        <template v-if="!page_load">
            <div class="order-content">
                <van-sticky :offset-top="46" class="order-tab-box" @scroll="changeSticky">
                    <div class="s-flex ai-ct" ref="orderTab" style="background: #f8f8f8">
                        <van-tabs v-model="tabActive" class="flex-1" @click="clickTabItem">
                            <van-tab title="全部" name="0"></van-tab>
                            <van-tab title="待确认" name="5"></van-tab>
                            <van-tab title="待付款" name="1"></van-tab>
                            <van-tab title="待发货" name="4"></van-tab>
                            <van-tab title="待收货" name="2"></van-tab>
                        </van-tabs>
                        <div class="order-tab-icon" v-if="show_search_icon" @click="toSearch">
                            <img src="https://cdn.toodudu.com/uploads/2023/10/26/order_search.png" alt="">
                        </div>
                    </div>
                </van-sticky>
                <template v-if="!noData">
                    <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多订单了~"
                        @load="loadMore"
                        offset="0"
                    >
                        <div class="order-list" v-if="!order_load">
                            <div class="order-item" v-for="(item,index) in orderListData" :key="index">
                                <!--订单头部-->
                                <div class="order-info s-flex jc-bt">
                                    <div class="fs24 co_666">订单号：{{ item.order_info.order_sn }}</div>
                                    <div class="fs24 co_666">{{ item.order_info.add_time }}</div>
                                </div>
                                <div class="order-main">
                                    <!--店铺-->
                                    <div class="shop-box s-flex jc-bt">
                                        <div class="shop-name s-flex" @click="routerPath('shop',{'seller_id': item.order_info.seller_id})">
                                            <span class="elli_1">{{ item.order_info.shop_name }}</span>
                                            <em class="iconfont">&#xe60b;</em>
                                        </div>
                                        <div class="order-type" :class="item.order_info.msg_gray?'order-type-grey':''">{{ item.order_info.msg }}</div>
                                    </div>
                                    <!--商品-->
                                    <div class="good-box" v-if="item.goods && item.goods.length>0">
                                        <template v-for="(childItem,childIndex) in item.goods" v-if="(item.show_more_goods && childIndex > 2) || childIndex < 3">
                                            <div class="good-model s-flex jc-bt" @click="routerPath('order',item)">
                                                <div class="good-model-left flex-1 s-flex">
                                                    <van-image :src="childItem.image" class="good-img">
                                                        <template v-slot:loading>
                                                            <img src="https://cdn.toodudu.com/uploads/2021/02/20/app_nopic.png" alt="" class="re-img">
                                                        </template>
                                                        <template v-slot:error>
                                                            <img src="https://cdn.toodudu.com/uploads/2021/02/20/app_nopic.png" alt="" class="re-img">
                                                        </template>
                                                    </van-image>
                                                    <div class="ML20 flex-1" style="max-width: 3.1rem">
                                                        <div class="fs28 co_333 fw_b" :class="childItem.goods_attr?'elli_1':'elli_2'">{{ childItem.goods_name }}</div>
                                                        <div class="fs24 co_666 MT20 word-b">{{ childItem.goods_attr }}</div>
                                                        <div class="good-presell-desc" v-if="childIndex==0 && item.pre_info.pre_sale_type == 'buy_type_deposit'">{{ item.pre_info.logistics_desc }}</div>
                                                    </div>
                                                </div>
                                                <div class="good-model-right">
                                                    <form-price :need_DF="true" :price="childItem.goods_price" sign_size="24" INT_size="32" DF_size="24" weight="600" color="#333"></form-price>
                                                    <div class="MT20 co_666">X{{ childItem.goods_number }}{{ childItem.unit?childItem.unit:'' }}</div>
                                                    <div class="MT20 refund-desc" v-if="childItem.is_show_after_sales == '2' || childItem.is_show_after_sales == '3'">{{ childItem.is_show_after_sales == '2' ? '退款中' : '退款成功' }}</div>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="good-more s-flex" v-if="item.goods.length>3 && !item.show_more_goods" @click="showMoreGoods(index)">
                                            <span>查看剩余{{ item.goods.length - 3 }}个商品</span>
                                            <em class="iconfont" style="margin-left: 0.07rem">&#xe604;</em>
                                        </div>
                                    </div>
                                    <!--物流模块-->
                                    <div class="wuliu-box s-flex jc-bt ai-ct" v-if="item.logistics && item.logistics.ship_info && item.logistics.ship_info.context" @click="routerPath('wuliu', item)">
                                        <div class="s-flex ai-ct flex-1">
                                            <img class="wuliu-icon" src="https://cdn.toodudu.com/uploads/2023/10/24/order_wuliu.png" alt="">
                                            <div class="wuliu-type">{{ item.logistics.ship_info.status }}</div>
                                            <div class="wuliu-desc flex-1">{{ item.logistics.ship_info.context }}</div>
                                        </div>
                                        <em class="iconfont">&#xe60b;</em>
                                    </div>
                                    <!--评价模块-->
                                    <div class="evaluate-box s-flex jc-bt ai-ct" v-if="item.order_info.show_evaluate">
                                        <div class="fs28 co_333 fw_b">商品好不好，评价一下</div>
                                        <div class="s-flex ai-ct jc-fe flex-1">
                                            <van-rate v-model="item.evaluate_value" size="13" color="#F54631" @change="changeRate(item)"/>
                                            <div class="ML20 evaluate-desc" v-if="item.evaluate_value == 1">非常不满意</div>
                                            <div class="ML20 evaluate-desc" v-else-if="item.evaluate_value == 2">不满意</div>
                                            <div class="ML20 evaluate-desc" v-else-if="item.evaluate_value == 3">一般</div>
                                            <div class="ML20 evaluate-desc" v-else-if="item.evaluate_value == 4">满意</div>
                                            <div class="ML20 evaluate-desc" v-else-if="item.evaluate_value == 5">非常满意</div>
                                            <div class="ML20 evaluate-desc" v-else></div>
                                        </div>
                                    </div>
                                    <!--订单价格-->
                                    <div class="price-box fs28 co_3D s-flex jc-fe fw_b" v-else>
                                        应付<form-price :need_DF="true" :price="item.order_info.order_amount" sign_size="28" INT_size="40" DF_size="28" weight="600" color="#333" class="ML10"></form-price>
                                    </div>
                                    <!--操作模块-->
                                    <div class="btn-box s-flex jc-fe ai-ct" v-if="item.button && item.button.length > 0">
                                        <van-popover v-model="item.showPopover" trigger="click" placement="top" :offset="[0,5]" v-if="item.button.length > 3">
                                            <template v-for="(btnChild,btnIndex) in item.button.slice(0,item.button.length - 3)">
                                                <div class="btn-more-model" :key="btnIndex" v-if="btnChild.alias != 'canShareGroup'" @click="btnOperate(item,index,btnChild,btnIndex)">{{ btnChild.text }}</div>
                                                <div class="btn-more-model share_box" :key="btnIndex" v-if="btnChild.alias == 'canShareGroup'" :data-clipboard-text="item.group && item.group.share_data && item.group.share_data.share_url" @click="btnOperate(item,index,btnChild,btnIndex)">{{ btnChild.text }}</div>
                                            </template>
                                            <template #reference>
                                                <div class="btn-more">更多</div>
                                            </template>
                                        </van-popover>
                                        <template v-for="(btnChild,btnIndex) in item.button.slice(-3)">
                                            <div class="btn-model" :key="btnIndex" v-if="btnChild.alias != 'canShareGroup'" :class="((btnIndex == item.button.slice(-3).length - 1) && (btnChild.alias != 'small_order_can_cancel' && btnChild.alias != 'can_cancel' && btnChild.alias != 'is_show_change_address_new' && btnChild.alias != 'can_delete'))?'btn-model-red':''" @click="btnOperate(item,index,btnChild,btnIndex)">{{ btnChild.text }}</div>
                                            <div class="btn-model share_box" :key="btnIndex" v-if="btnChild.alias == 'canShareGroup'" :class="(btnIndex == item.button.slice(-3).length - 1)?'btn-model-red':''" :data-clipboard-text="item.group && item.group.share_data && item.group.share_data.share_url" @click="btnOperate(item,index,btnChild,btnIndex)">{{ btnChild.text }}</div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-fff" v-else style="border-radius: 0.2rem;margin: 0.2rem 0 0;padding: 0.2rem" v-for="item in 5" :key="item">
                            <div class="s-flex jc-bt">
                                <div style="width: 30%;height: 0.5rem;background: #f8f8f8"></div>
                                <div style="width: 15%;height: 0.5rem;background: #f8f8f8"></div>
                            </div>
                            <div class="s-flex MT40">
                                <div style="width: 1.78rem;height: 1.78rem;background: #f8f8f8"></div>
                                <div class="flex-1 ML20">
                                    <div style="width: 100%;height: 0.5rem;background: #f8f8f8"></div>
                                    <div class="MT20" style="width: 50%;height: 0.5rem;background: #f8f8f8"></div>
                                </div>
                            </div>
                            <div class="s-flex jc-fe MT20">
                                <div class="ML20" style="width: 25%;height: 0.5rem;background: #f8f8f8"></div>
                                <div class="ML20" style="width: 25%;height: 0.5rem;background: #f8f8f8"></div>
                            </div>
                        </div>
                    </van-list>
                </template>
                <!--没有数据-->
                <div class="noData" v-if="noData">
                    <img class="noImg" src="@/assets/images/order/no_order.png"/>
                    <div class="noTex">您还没有相关订单</div>
                    <div class="noDesc">可以去看看有哪些想买的</div>
                </div>
            </div>
            <recommend-column></recommend-column>
        </template>
        <template v-else>
            <div class="s-flex" style="padding: 0.2rem">
                <div class="bg-fff MR20" style="width: 1.2rem;height: 0.5rem"></div>
                <div class="bg-fff MR20" style="width: 1.2rem;height: 0.5rem"></div>
                <div class="bg-fff MR20" style="width: 1.2rem;height: 0.5rem"></div>
            </div>
            <div class="bg-fff" style="border-radius: 0.2rem;margin: 0.2rem 0.2rem 0;padding: 0.2rem" v-for="item in 3" :key="item">
                <div class="s-flex jc-bt">
                    <div style="width: 30%;height: 0.5rem;background: #f8f8f8"></div>
                    <div style="width: 15%;height: 0.5rem;background: #f8f8f8"></div>
                </div>
                <div class="s-flex MT40">
                    <div style="width: 1.78rem;height: 1.78rem;background: #f8f8f8"></div>
                    <div class="flex-1 ML20">
                        <div style="width: 100%;height: 0.5rem;background: #f8f8f8"></div>
                        <div class="MT20" style="width: 50%;height: 0.5rem;background: #f8f8f8"></div>
                    </div>
                </div>
                <div class="s-flex jc-fe MT20">
                    <div class="ML20" style="width: 25%;height: 0.5rem;background: #f8f8f8"></div>
                    <div class="ML20" style="width: 25%;height: 0.5rem;background: #f8f8f8"></div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import RecommendColumn from "@/components/recommendColumn/RecommendColumn.vue";
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const cns = getCurrentInstance().appContext.config.globalProperties
const title = ref('我的订单')
const tabActive = ref('')
const orderListData = ref([])
const show_search_icon = ref(false)
const info = ref({
    page: 1,
    order_type: 0, // 订单类型 0全部 1待付款 2.待收货 3已取消 4待发货 5待确认 6已完成
    order_id: ''
})
const page_load = ref(true)
const order_load = ref(true)
const noData =ref(false)
const loading =ref(false)
const finished =ref(false)
const copyText =ref('')
const canShare =ref(false)
const shareData =ref({})
const orderCheck =ref({})
const addressIndex = ref(null)
const orderAddressShow = ref(false)
const addressList =ref([])
const address_nodata = ref(false)
const addressSource =ref(null)
const address_order_index =ref(null)
const orderAddressData =ref({})
const orderDeliveryMethod =ref(null)
const confirmReceiptShow =ref(false)
const confirmReceiptForm =ref({})
const phoneCodeText =ref('点击获取')
const phoneCodeSecond =ref(60)

onMounted(() => {
    info.order_type = route.query.order_type ? route.query.order_type : 0
    info.order_id = route.query.order_id ? route.query.order_id : ''
    tabActive.value = (route.query.order_type ? route.query.order_type : 0).toString()
    // getOrderData()
})

const getOrderData = () => {

}

</script>

<style scoped lang="scss">
.myorder {
    background-color: #F8F8F8;
    min-height: 100vh;
    .always-buy-box{
        margin: 0.2rem 0;
    }
    /*tab栏*/
    .order-tab-box ::v-deep{
        .van-sticky--fixed{
            padding: 0 0.2rem;
            box-sizing: border-box;
        }
        .van-tabs__nav {
            background: #f8f8f8;
        }
        .van-tabs--line .van-tabs__wrap {
            height: 0.96rem;
        }
        .van-tab--active .van-tab__text--ellipsis {
            color: var(--color);
            font-size: 0.32rem;
            font-weight: bold;
        }
        .van-tab__text--ellipsis {
            font-size: 0.28rem;
            color: #3D3D3D;
            display: contents;
        }
        .van-tab--active::after{
            position: absolute;
            content: "";
            width: 0.33rem;
            height: 0.07rem;
            bottom: 0.2rem;
            border-radius: 3.3rem;
            background: var(--color);
            font-weight: 600;
        }
        .van-tabs__line {
            display: none;
            width: 0.34rem;
            height: 0.16rem;
            background-color: unset;
            background-image: url("https://cdn.toodudu.com/uploads/2024/04/22/下划线@1x.svg");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            bottom: 20px;
            fill:var(--color);
        }
        .order-tab-icon{
            width: 0.4rem;
            height: 0.4rem;
            margin-left: 0.17rem;
            position: relative;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .order-tab-icon::before{
            content: '';
            position: absolute;
            left: -0.16rem;
            top: 0;
            bottom: 0;
            width: 1px;
            height:0.4rem;
            background: linear-gradient(135deg, #999999 4%, rgba(216,216,216,0) 100%);
        }
    }
    .order-content {
        padding: 0 0.2rem 0.2rem;
        /** 订单列表样式设置 **/
        .order-list {
            box-sizing: border-box;
            width: 100%;
            .order-item {
                margin-top: 0.2rem;
                background-color: #fff;
                border-radius: 0.2rem;
                .order-info{
                    height: 0.84rem;
                    border-bottom: 1px solid #EEEEEE;
                    align-items: center;
                    padding: 0 0.3rem;
                }
                .order-main{
                    padding: 0.3rem 0.2rem;
                    .shop-box{
                        align-items: center;
                        .shop-name{
                            max-width: 3.56rem;
                            align-items: center;
                            span{
                                font-size: 0.32rem;
                                color: #333333;
                                font-weight: bold;
                            }
                            .iconfont{
                                font-size: 0.56rem;
                                color: #333333;
                            }
                        }
                        .order-type{
                            font-size: 0.28rem;
                            color: #F71111;
                        }
                        .order-type.order-type-grey{
                            color: #999999;
                        }
                    }
                    .good-box{
                        .good-model{
                            margin-top: 0.4rem;
                            .good-model-left{
                                .good-img{
                                    width: 1.76rem;
                                    height: 1.76rem;
                                    border-radius: 0.2rem;
                                    overflow: hidden;
                                    border: 1px solid #eeeeee;
                                    background: #f8f8f8;
                                    img{
                                        width: 1.76rem;
                                        height: 1.76rem;
                                        border-radius: 0.2rem;
                                    }
                                }
                                .good-presell-desc{
                                    font-size: 0.26rem;
                                    color: #FF8F1F;
                                    margin-top: 0.1rem;
                                }
                            }
                            .good-model-right{
                                margin-left: 0.3rem;
                                text-align: right;
                                .gift-txt{
                                    font-size: 0.28rem;
                                    padding: 0.06rem 0.12rem;
                                    color: #333333;
                                    margin-bottom: 0.16rem;
                                }
                                .refund-desc{
                                    font-size: 0.28rem;
                                    color: #FF8F1F;
                                }
                            }
                        }
                        .good-more{
                            margin-top: 0.3rem;
                            span{
                                font-size: 0.24rem;
                                color: #666666;
                            }
                        }
                    }
                    .wuliu-box{
                        height: 0.7rem;
                        border-radius: 0.1rem;
                        background: #F8F8F8;
                        margin-top: 0.3rem;
                        padding: 0 0.2rem;
                        .wuliu-icon{
                            width: 0.28rem;
                            height: 0.21rem;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .wuliu-type{
                            font-size: 0.28rem;
                            margin-left: 0.2rem;
                            color: #333333;
                            font-weight: bold;
                        }
                        .wuliu-desc{
                            font-size: 0.26rem;
                            color: #666666;
                            margin-left: 0.1rem;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            word-break: break-all;
                            -webkit-line-clamp: 1;
                        }
                        .iconfont{
                            font-size: 0.56rem;
                            margin-left: 0.04rem;
                            color: #666666;
                        }
                    }
                    .evaluate-box{
                        height: 0.7rem;
                        border-radius: 0.1rem;
                        background: #F8F8F8;
                        margin-top: 0.3rem;
                        padding: 0 0.2rem;
                        .evaluate-desc{
                            font-size: 0.26rem;
                            color: #666666;
                            width: 1.3rem;
                            text-align: right;
                        }
                    }
                    .price-box{
                        align-items: center;
                        margin-top: 0.3rem;
                        .group-box{
                            .group-img{
                                width: 0.4rem;
                                height: 0.4rem;
                                margin-right: -0.08rem;
                                border-radius: 50%;
                                border: 1px solid #E5E5E5;
                                overflow: hidden;
                                img{
                                    width: 0.4rem;
                                    height: 0.4rem;
                                }
                            }
                        }
                    }
                    .btn-box{
                        margin-top: 0.4rem;
                        position: relative;
                        .btn-model{
                            width: 1.8rem;
                            height: 0.7rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 0.45rem;
                            border: 1px solid #CBCBCB;
                            color: #333333;
                            font-size: 0.28rem;
                            margin-left: 0.2rem;
                            box-sizing: border-box;
                        }
                        .btn-model.btn-model-red{
                            border-color: var(--color);
                            color: var(--color);
                        }
                        .van-popover__wrapper{
                            position: absolute;
                            left: 0;
                            top: 0;
                            bottom: 0;
                            width: 0.6rem;
                        }
                        .btn-more{
                            font-size: 0.28rem;
                            color: #999999;
                            line-height: 0.7rem;
                            height: 0.7rem;
                        }
                    }
                }
            }
        }
        .word-b{word-break: break-all}
    }
}
.btn-more-model{
    height: 0.9rem;
    line-height: 0.9rem;
    width: 1.83rem;
    text-align: center;
    color: #333333;
    font-size: 0.28rem;
}
:deep(.van-popover .van-popover__arrow){
    right: 1rem!important;
}
.noData{
    margin-top: 0.05rem;
    .noImg{
        width: 4rem;
        height: 4rem;
    }
    .noTex{
        margin-top: -0.5rem;
        font-size: 0.3rem;
        color: #3D3D3D;
        font-weight: bold;
    }
    .noDesc{
        margin-top: 0.2rem;
        font-size: 0.26rem;
        color: #3D3D3D;
    }
}
.equity-share{
    .share-img img {
        width: 5.1rem;
        height: 5.4rem;
        margin: 1rem 1.9rem 0 1.9rem;
    }
    .share-txt{
        width: 100%;
        text-align: center;
        margin-top: -0.2rem;
        p {
            font-size: 0.4rem;
            color: #fff;
            text-align: center;
            line-height: 0.58rem;
            letter-spacing: 3px;
        }
    }
    ::v-deep .van-overlay {
        z-index: 9900 !important;
    }
}
/*修改地址弹窗*/
.order-address .van-popup { padding: 0.16rem 0; box-sizing: border-box; }
.order-address .order-address-title { padding: 0.2rem 0; }
.order-address .order-address-title p { font-size: 0.32rem; font-weight: 600; }
.order-address .order-address-title .close { width: 0.36rem; height: 0.36rem; background-color: #F2F2F2; border-radius: 999px; }
.order-address .order-address-title em { font-size: 0.2rem; font-weight: 600; color: #999999; }
.order-address-mode { font-size: .26rem; color: #777; margin-bottom: .2rem;}
.order-address-mode .mode-item { margin-left: .4rem;}
.order-address-mode .mode-item em.iconfont { margin-right: .1rem; }
.order-address-mode .mode-item .check { color:#f71111; }
.order-address .order-address-warning { line-height: 1.5; padding: 0.1rem 0 0.3rem 0; font-size: 0.24rem; color: #FB9216; }
.order-address .order-address-warning em { vertical-align: middle; font-size: 0.32rem; }
.order-address .order-address-source { padding: 0.2rem 0.3rem; background-color: #F8F8F8; border: 1px solid #F0F0F0; border-radius: 0.1rem; }
.order-address .order-address-source dt { margin-bottom: 0.2rem; font-size: 0.26rem; font-weight: 600; }
.order-address .order-address-source dd { margin-top: 0.1rem; font-size: 0.24rem; }
.order-address .order-address-source dd:last-child { color: #666666; }
.order-address .order-address-source dd span { margin-right: .42rem; }
.order-address .order-address-fixed { /*height: 4.7rem;*/ padding: 0 0.28rem; }
.order-address .order-address-list__title { padding: 0.2rem 0; }
.order-address .order-address-list__title p { font-size: 0.26rem; color: #777777; }
.order-address .order-address-list__title em { margin-right: 0.1rem; font-size: 0.24rem; }
.order-address .order-address-list__title span { font-size: 0.26rem; }
.order-address .order-address-list__title em,
.order-address .order-address-list__title span { color: #333333; }
.order-address .order-address-list { max-height: calc(100% - 4.7rem - 1.2rem); padding: 0 0.28rem; overflow-y: auto; }
.order-address .order-address-list.no-source { max-height: calc(100% - 1.2rem); }
.order-address .order-address-list .order-address-dd { max-height: calc(100% - 0.82rem - 1.15rem - 1.7rem - 1.4rem); padding: 0.3rem 0; border-bottom: 1px solid #E0E0E0; overflow-y: auto; }
.order-address .order-address-list .order-address-dd:last-child { border-bottom: none; }
.order-address .order-address-list .order-address-dd em.check { margin-right: 0.4rem; font-size: 0.34rem; }
.order-address .order-address-list .order-address-dd.active em.check { color: #f71111; }
.order-address .order-address-list .order-address-detail span { line-height: 1.2; margin-right: 0.44rem; font-size: 0.3rem; font-weight: 600; }
.order-address .order-address-list .order-address-detail .tag { line-height: 1; padding: 0.04rem; vertical-align: middle; background-color: #F71111; border-radius: 0.05rem; font-style: normal; font-size: 0.2rem; color: #ffffff; }
.order-address .order-address-list .order-address-detail p { line-height: 1.2; margin-top: 0.2rem; font-size: 0.24rem; color: #666666; }
.order-address .order-address-btn { width: 7.5rem; height: 1.2rem; background-color: #ffffff; position: fixed; bottom: 0; left: 50%; transform: translate(-50%); box-shadow: 0 0 0.1rem 0 rgba(0,0,0,0.1); }
.order-address .order-address-btn p { width: 4rem; height: 0.88rem; line-height: 0.88rem; margin: 0.16rem auto; text-align: center; border-radius: 333px; background: linear-gradient(90deg, #FA5F5F, #F71111); font-size: 0.3rem; color: #ffffff; }
.order-address .order-address-btn.disabled p { background: #999999; }
/*确认收货弹窗*/
.confirm-receipt {
    .van-popup { padding: 0.16rem 0; box-sizing: border-box; }
    .confirm-receipt-title { padding: 0.2rem 0.3rem; }
    .confirm-receipt-title p { font-size: 0.32rem; font-weight: 600; }
    .confirm-receipt-title .close { width: 0.36rem; height: 0.36rem; background-color: #F2F2F2; border-radius: 999px; }
    .confirm-receipt-title em { font-size: 0.2rem; font-weight: 600; color: #999999; }

    .confirm-receipt-form { padding: 0.2rem 0.3rem; }
    .confirm-receipt-form .form-item { padding: 0.2rem 0; }
    .confirm-receipt-form label { width: 25%; font-size: 0.28rem; }
    .confirm-receipt-form .form-input { width: 100%; height: 0.78rem; padding: 0 0.16rem; border-radius: 0.1rem; border: 1px solid #cccccc; box-sizing: border-box; }
    .confirm-receipt-form .form-input.disabled { background-color: #f2f2f2; }
    .confirm-receipt-form .form-code { width: 100%; }
    .confirm-receipt-form .form-code .form-input { width: 60%; }
    .confirm-receipt-form input { width: 100%; border: none; outline: none; }

    .confirm-receipt-form .form-btn,
    .confirm-receipt-form .form-submit { width: 6.94rem; height: 0.68rem; line-height: 0.68rem; margin: 0.36rem auto 0.2rem auto; text-align: center; border-radius: 333px; background: linear-gradient(90deg, #FA5F5F, #F71111); font-size: 0.24rem; color: #ffffff; }
    .confirm-receipt-form .form-btn.disabled,
    .confirm-receipt-form .form-submit.disabled { background: #f2f2f2; color: #999999; }
    .confirm-receipt-form .form-btn { width: 36%; height: 0.78rem; line-height: 0.78rem; margin: 0; border-radius: 0.1rem; font-size: 0.26rem; }
    .confirm-receipt-form .form-warning { padding: 0.1rem 0 0.1rem 1.38rem; font-size: 0.24rem; color: #aaaaaa; }
}
</style>
