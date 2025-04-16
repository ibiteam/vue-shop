<template>
    <div class="refundDetail">
        <common-header title="退款详情" back_color="#f2f2f2"></common-header>
        <!--骨架屏-->
        <div class="loading" v-if="is_loading">
            <div class="process">
                <div class="s-flex ai-ct jc-bt">
                    <div class="tiao" style="height:0.29rem;border-radius: 0.2rem;width: 1.7rem;background: #f1f0f0;"></div>
                    <div class="tiao" style="height:0.19rem;border-radius: 0.2rem;width: 2rem;background: #f1f0f0;"></div>
                </div>
                <div class="tiao" style="height:0.19rem;border-radius: 0.2rem;width: 3rem;background: #f1f0f0;margin-top: 0.28rem;"></div>
            </div>
            <div class="goods">
                <div class="s-flex ai-ct jc-bt">
                    <div class="tiao" style="height:0.29rem;border-radius: 0.2rem;width: 1.7rem;background: #f1f0f0;"></div>
                </div>
                <div class="s-flex" style="margin-top: 0.3rem;">
                    <div style="width: 1.82rem;height: 1.82rem;background: #f1f0f0;border-radius: 0.1rem;"></div>
                    <div style="margin-left: 0.2rem;">
                        <div style="width: 4.5rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                        <div class="s-flex ai-ct jc-bt">
                            <div style="width: 1.59rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                            <div style="width: 0.59rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;margin-top: 0.5rem;"></div>
                        </div>
                    </div>
                </div>
                <div style="width: 100%;border-bottom: 1px #ccc solid;margin: 0.4rem 0;"></div>
                <div class="s-flex ai-ct jc-bt" style="margin-bottom: 0.39rem">
                    <div style="width: 1rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                    <div style="width: 5rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                </div>
                <div class="s-flex ai-ct jc-bt" style="margin-bottom: 0.39rem">
                    <div style="width: 1rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                    <div style="width: 5rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                </div>
                <div class="s-flex ai-ct jc-bt" style="margin-bottom: 0.39rem">
                    <div style="width: 1rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                    <div style="width: 5rem; height: 0.23rem;background: #f1f0f0;border-radius: 0.2rem;"></div>
                </div>
            </div>
        </div>
        <div class="content" v-else>
            <div class="process" v-if="refund_data.refund_info">
                <template v-if="[5,6].includes(status)">
                    <div class="status s-flex jc-bt ai-ct" :class="status ===6?'error':''">
                        <div class="name">{{ status ===6?'退款关闭':'退款成功' }}</div>
                        <div class="money"  v-if="status === 5">{{ refund_data.refund_info.money_format }}</div>
                        <div class="time"  v-if="status === 6">{{ refund_data.refund_info.created_at }}</div>
                    </div>
                    <div class="time" v-if="status === 5">{{ refund_data.refund_info.updated_at }}</div>
                    <div class="source">{{ refund_data.refund_info.result }}</div>
                </template>
                <template v-if="status === 1">
                    <div class="status s-flex ai-ct">
                        <div class="name">商家已拒绝</div>
                        <van-count-down @finish="getPageData" v-if="refund_data.is_ziying === 0" style="margin-left:0.31rem;" :time="time" :format="formatL" />
                    </div>
                    <div class="time">{{ refund_data.refund_info.created_at }}</div>
                    <div class="source">{{ refund_data.refund_info.result }}</div>
                    <div class="hr"></div>
                    <p class="detail-P">您可以修改申请后再次发起，商家会重新处理</p><p class="detail-P">如果您逾期未处理，本次申请将自动关闭，关闭后若超出售后时效，将无法再次发起售后申请。</p>
                </template>
                <template v-if="[0,2,3,4].includes(status)">
                    <van-steps direction="vertical" :active="stepIndex">
                        <van-step v-for="(its,ids) in step" :key="ids"  :class="stepIndex===ids?'active':stepIndex>ids?'pass':''">
                            <div class="s-flex ai-ct">
                                <h3>{{ its }}</h3>
                                <van-count-down @finish="getPageData" style="margin-left:0.31rem;" v-if="stepIndex===ids && refund_data.is_ziying === 0" :time="time" :format="formatL" />
                            </div>
                            <p v-if="stepIndex===ids">
                                <template v-if="status === 0">
                                    <template v-if="refund_data.type == 0">
                                        卖家统一或者超时未处理，系统将退款给您<br />
                                        如卖家拒绝，您可以修改退款申请后再次发起，卖家会重新处理
                                    </template>
                                    <template v-else>
                                        卖家同意后，请按照给出的退货地址退货，并记录退货运单号<br/>
                                        卖家同意或者超时未处理，系统将退款给您<br/>
                                        如卖家拒绝，您可以修改退款申请后再次发起，卖家会重新处理
                                    </template>
                                </template>
                                <template v-if="status === 2">未与卖家协商一致，请勿使用邮寄到付，以免卖家拒收请填写真实退货物流信息，逾期未填写，退货申请将关闭，关闭后将无法再次申请售后</template>
                                <template v-if="status === 3">待商家确认收货</template>
                            </p>
                            <template #active-icon>
                                <em class="iconfont icon-sdraw"></em>
                            </template>
                            <template #inactive-icon>
                                <em v-if="stepIndex>ids" class="iconfont icon-icon-radio"></em>
                                <em v-else class="iconfont icon-sdraw"></em>
                            </template>
                        </van-step>
                    </van-steps>
                </template>
            </div>
            <div class="receiving" v-if="status === 2">
                <div class="s-flex jc-bt">
                    <div class="imgs">
                        <img :src="require('@/assets/images/refund/address.png')" alt="">
                    </div>
                    <div class="right">
                        <div class="information s-flex">
                            <div class="name">收货人：{{ refund_data.address?refund_data.address.shop_address.consignee:'' }}</div>
                            <div class="tel">{{ refund_data.address?refund_data.address.shop_address.phone:'' }}</div>
                        </div>
                        <div class="address">
                            地址：{{ refund_data.address?refund_data.address.shop_address.address:'' }}
                        </div>
                        <div class="fill" @click="appRoute('refundShip', {id: refund_data.refund_info.id})">
                            <span>填写单号</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="good">
                <div class="title">退款信息</div>
                <div class="details s-flex jc-bt">
                    <div class="imgs" @click="appRoute('good', {goods_no: refund_data.order_detail.goods_no})">
                        <img :src="refund_data.order_detail.goods_image" alt="" />
                    </div>
                    <div class="information" @click="appRoute('good', {goods_no: refund_data.order_detail.goods_no})">
                        <div>
                            <div class="name">{{ refund_data.order_detail.goods_name }}</div>
                            <div class="MT20">
                                <span style="font-size: 0.22rem;color: #ccc;margin-right: 0.2rem" v-for="ite in refund_data.order_detail.goods_sku_value">{{ ite.key }}：{{ ite.value }}</span>
                            </div>
                        </div>
                        <div class="company s-flex jc-bt ai-ct">
                            <div class="left">{{ refund_data.order_detail.goods_price }}<span v-if="refund_data.order_detail.goods_unit">/{{ refund_data.order_detail.goods_unit }}</span></div>
                            <div class="right">x {{ refund_data.order_detail.goods_number }}</div>
                        </div>
                    </div>
                </div>
                <div class="br"></div>
                <div class="refund-detail-list">
                    <div class="list s-flex">
                        <div class="left">退款原因：</div>
                        <div class="right">{{ refund_data.refund_info.reason_content }}</div>
                    </div>
                    <div class="list s-flex">
                        <div class="left">退款金额：</div>
                        <div class="right">{{ refund_data.refund_info.money_format }}</div>
                    </div>
                    <div class="list s-flex" v-if="refund_data.refund_info.number > 0">
                        <div class="left">退款数量：</div>
                        <div class="right">{{ refund_data.refund_info.number }} {{ refund_data.order_detail.goods_unit }}</div>
                    </div>
                    <div class="list s-flex">
                        <div class="left">申请时间：</div>
                        <div class="right">{{ refund_data.refund_info.updated_at }}</div>
                    </div>
                    <div class="list s-flex">
                        <div class="left">退款编号：</div>
                        <div class="right">{{ refund_data.refund_info.no }}</div>
                    </div>
                    <div class="list s-flex">
                        <div class="left">协商历史：</div>
                        <div class="right s-flex jc-fe ai-ct" @click="appRoute('refundHistory', { apply_refund_id: refund_data.refund_info.id })">
                            <span>点击查看</span>
                            <em class="iconfont">&#xe60b;</em>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btns btnas s-flex jc_ct">
                <van-button @click="revoke()" :class="refund_data.type===1?'fsc':''" v-if="[0,2].includes(status)">撤 销 申 请</van-button>
                <van-button @click="edit()" v-if="status == 1">修 改 申 请</van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {refundInitAxios,refundDetailAxios, refundRevokeAxios} from "@/api/refund.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const info = ref({})
const refund_data = ref()
const is_loading =ref(true)
const after_sales = ref(null)
const status = ref(null) //状态 0：退款待处理；1：已拒绝退款；2：退货审核成功；3：买家已发货；4：卖家已收货；5：退款成功；6退款关闭
const time =ref(null)
const stepIndex =ref(null)
const step =ref([])
const address = ref({})
const formatL =ref('')

onMounted( () => {
    getPageData()
})

const getPageData = () =>{
    after_sales.value = route.query.after_sales
    if (after_sales.value != 1 && route.query.apply_refund_id) {
        info.value.apply_refund_id = route.query.apply_refund_id
    }
    info.value.order_no = route.query.order_no
    info.value.order_detail_id = route.query.order_detail_id
    if (after_sales.value == 1){
        refundInitAxios(info.value).then(res => {
            initPageData(res)
        })
    }else{
        refundDetailAxios(info.value).then(res => {
            initPageData(res)
        })
    }
}

const initPageData = (res) => {
    if (cns.$constant.isSuccessCode(res)) {
        refund_data.value = res.data
        if (after_sales.value == 1) {
            status.value = -1
            stepIndex.value = 1
        } else {
            status.value = refund_data.value.refund_info.status
            switch (status.value) {
                case 0:
                    stepIndex.value = 1
                    break;
                case 2:
                    stepIndex.value = 2
                    break;
                case 3:
                    stepIndex.value = 3
                    break;
                case 4:
                    stepIndex.value = 4
                    break;
                default:
                    stepIndex.value = null
                    break;
            }
            if(Number(refund_data.value.type) === 0){
                step.value = ['申请退款','等待卖家处理','退款成功']
            }else{
                step.value = ['申请退款','等待卖家处理','寄回商品','商家收货','商家退款','退款成功']
            }
            time.value = (refund_data.value.refund_info.job_time - refund_data.value.refund_info.system_time) * 1000
            formatL.value = 86400 < (refund_data.value.refund_info.job_time - refund_data.value.refund_info.system_time) ? '还剩 DD 天 HH 时 mm 分 ss 秒':'还剩 HH 时 mm 分 ss 秒'
            info.value.apply_refund_id = refund_data.value.refund_info.id
            //  如果申请退款被拒绝使用
            if (refund_data.value.from_init) {
                refund_data.value.reason = refund_data.value.from_init.reason
                refund_data.value.order_detail.refund_max_amount = refund_data.value.from_init.refund_max_amount
                refund_data.value.order_detail.refund_max_number = refund_data.value.from_init.refund_max_number
            }
        }
    } else if (cns.$constant.isUnLoginCode(res)) {
        cns.appRoute('login')
    }else {
        cns.$toast(res.message)
    }
    is_loading.value = false
}

const revoke =()=>{
    refundRevokeAxios({ apply_refund_id: refund_data.value.refund_info.id }).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            setTimeout(() => {
                getPageData()
            }, 500);
            cns.$toast(res.message)
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    })
}

const edit = () =>{
    this.appRoute('refundForm', { order_no:route.query.order_no, order_detail_id:route.query.order_detail_id, apply_refund_id: refund_data.value.refund_info.id, type:'edit' }, 'replace')
}
</script>

<style scoped lang="scss">
.refundDetail{
    background: #f2f2f2;
    min-height: 100%;
    .loading{
        margin-top: 0.32rem;
        padding: 0 0.2rem;
        box-sizing: border-box;
        padding-bottom: 0.9rem;
        .process{
            width: 100%;
            height: 1.7rem;
            box-sizing: border-box;
            background: #FFFFFF;
            border-radius: 0.2rem;
            padding: 0.38rem 0.2rem;
        }
        .goods{
            width: 100%;
            height: 7.3rem;
            background: #FFFFFF;
            border-radius: 0.2rem;
            padding: 0.4rem 0.21rem;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin-top: 0.2rem;
        }
    }
    .content{
        margin-top: 0.32rem;
        padding: 0 0.2rem;
        box-sizing: border-box;
        padding-bottom: 0.9rem;
        .process{
            width: 100%;
            box-sizing: border-box;
            background: #FFFFFF;
            border-radius: 0.2rem;
            padding: 0.38rem 0.2rem;
            .status{
                .name{
                    font-size: 0.3rem;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #F71111;
                }
                .money{
                    font-size: 0.24rem;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #F71111;
                }
                &.error .name{
                    color: #333333;
                }
            }
            .hr{
                width: 100%;
                margin:0.29rem 0;
                height: 1px;
                background: #E8E8E8;
            }
            .detail-P{
                font-size: 0.24rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 0.36rem;
            }
            .time,.source{
                font-size: 0.24rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 0.36rem;
                padding-top: 0.29rem;
                &.time{

                    color: #999999;
                }

            }
            :deep(.van-steps){
                em{
                    font-size: 0.16rem;
                    color: #ccc;
                    &.active{
                        color: #F71111;
                    }
                }
                .van-step__circle-container{
                    padding: 0.1rem 0;
                    background: #fff;
                }
                .van-step__line{
                    background: #CCCCCC;
                }
                .van-steps__items{
                    ::after{
                        content: none;
                    }
                    h3{
                        font-size: 0.28rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #999999;
                    }
                }
                .van-step--process{
                    h3{
                        font-size: 0.28rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #333333;
                    }
                    em{
                        color: #F71111;
                    }
                    .van-step__line{
                        background: #F71111;
                    }
                }
                .active{
                    h3{
                        font-size: 0.28rem;
                        font-family: PingFang SC;
                        font-weight: 600;
                        color: #F71111;
                    }
                    p{
                        font-size: 0.24rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #999999;
                        line-height: 0.36rem;
                        margin-top: 0.23rem;
                    }
                    em{
                        color: #F71111;
                    }
                    .van-step__line{
                        background: #F71111;
                    }

                }
                .pass {
                    h3{
                        color: #333333;
                    }
                    em,.van-step__line{
                        color: #F71111;
                    }
                }
            }
        }
        .receiving{
            width: 100%;
            background: #FFFFFF;
            border-radius: 0.2rem;
            margin-top: 0.2rem;
            box-sizing: border-box;
            padding: 0.4rem 0.21rem;
            .imgs{
                width: 0.28rem;
                height: 0.34rem;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .right{
                margin-left: 0.31rem;
                flex: 1;
                .information{
                    .name,.tel{
                        font-size: 0.26rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 0.3rem;
                        &.tel{
                            margin-left: 0.4rem;
                        }
                    }
                }
                .address{
                    font-size: 0.26rem;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 0.38rem;
                    margin: 0.27rem 0 0.38rem;
                }
                .fill{
                    width: 2.01rem;
                    height: 0.67rem;
                    background: #FFFFFF;
                    border: 1px solid #999999;
                    border-radius: 0.33rem;
                    text-align: center;
                    line-height: 0.67rem;
                    span{
                        font-size: 0.26rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 0.3rem;
                    }
                }
            }

        }
        .good{
            width: 100%;
            background: #FFFFFF;
            border-radius: 0.2rem;
            padding: 0.4rem 0.21rem;
            box-sizing: border-box;
            margin-top: 0.2rem;
            .title{
                font-size: 0.3rem;
                font-family: PingFang SC;
                font-weight: 600;
                color: #333333;
            }
            .details{
                margin-top: 0.3rem;
                .imgs{
                    width: 1.82rem;
                    height: 1.82rem;
                    box-shadow: 0 0 21px 0 rgba(233,233,233,0.55);
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                .information{
                    flex: 1;
                    margin-left: 0.2rem;
                    .name{
                        font-size: 0.22rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 0.3rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        overflow:hidden;
                        /*! autoprefixer: off */
                        -webkit-box-orient: vertical;
                    }
                    .company{
                        margin-top: 0.4rem;
                        .left{
                            font-size: 0.22rem;
                            font-family: PingFang SC;
                            font-weight: 500;
                            color: #F71111;
                            line-height: 0.3rem;
                            span{
                                color: #333333;
                            }
                        }
                        .right{
                            font-size: 0.22rem;
                            font-family: PingFang SC;
                            font-weight: 400;
                            color: #333333;
                            line-height: 0.3rem;
                        }
                    }
                }
            }
            .br{
                margin: 0.4rem 0;
                width: 100%;
                height: 1px;
                background: #E8E8E8;
            }
            .refund-detail-list{
                .list{
                    align-items: baseline;
                    margin-bottom: 0.39rem;
                    .left{
                        font-size: 0.26rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #777777;
                        line-height: 0.3rem;
                    }
                    .right{
                        flex: 1;
                        font-size: 0.26rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 0.36rem;
                        text-align: right;
                        em{
                            font-size: 0.3rem;
                        }
                    }
                }
            }
        }
    }
    .btns{
        text-align: center;
        &.btnas{
            .fsc{
                background: #F2F2F2;
                border: 1px solid #F71111;
                .van-button__text{
                    color: #F71111;
                }
            }
        }
    }
    :deep(.van-button){
        margin-top: 0.6rem;
        width: 3rem;
        height: 0.8rem;
        background: linear-gradient(90deg, #FA5F5F, #F71111);
        border-radius: 0.4rem;
        .van-button__text{
            font-size: 0.3rem;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 0.3rem;
        }
    }
}
</style>
