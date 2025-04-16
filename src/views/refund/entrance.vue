<template>
    <div class="refundIndex">
        <common-header title="选择售后类型"></common-header>
        <div class="refundIndex-container">
            <div class="refund-good">
                <div class="title">
                    <span>退款商品</span>
                </div>
                <div class="good s-flex" v-if="loading">
                    <div class="picture" style="background: #f2f3f5"></div>
                    <div class="right flex-1 s-flex flex-dir jc-bt">
                        <div class="">
                            <div class="name">
                                <div style="background: #f2f3f5;height: 0.18rem;border-radius: 0.2rem;width: 100%;"></div>
                                <div style="background: #f2f3f5;height: 0.18rem;border-radius: 0.2rem;width: 60%;margin-top: 0.07rem;"></div>
                            </div>
                            <div class="specifications" style="margin-top: 0.3rem;">
                                <div style="background: #f2f3f5;height: 0.18rem;border-radius: 0.3rem;width: 20%;"></div>
                            </div>
                        </div>

                        <div class="info s-flex jc-bt ai-ct">
                            <div class="price" style="background: #f2f3f5;width: 1.5rem;height: 0.18rem;border-radius: 0.3rem;"></div>
                            <div class="number" style="background: #f2f3f5;width: 0.8rem;height: 0.18rem;border-radius: 0.3rem;"></div>
                        </div>
                    </div>
                </div>
                <div class="good s-flex" v-else @click="appRoute('good', {goods_no: goods_info.goods_no})">
                    <div class="picture s-flex jc_ct ai-ct">
                        <img :src="goods_info.goods_image" alt="">
                    </div>
                    <div class="right flex-1 s-flex flex-dir jc-bt">
                        <div class="">
                            <div class="name">
                                <span>{{ goods_info.goods_name }}</span>
                            </div>
                            <div class="specifications MT20">
                                <span style="font-size: 0.22rem;color: #ccc;margin-right: 0.2rem" v-for="ite in goods_info.goods_sku_value">{{ ite.key }}：{{ ite.value }}</span>
                            </div>
                        </div>

                        <div class="info s-flex jc-bt ai-ct">
                            <div class="price">
                                <span>{{ goods_info.goods_price_format }}</span>
                                <span style="color: rgba(51, 51, 51, 1);" v-if="goods_info.goods_unit">/{{ goods_info.goods_unit }}</span>
                            </div>
                            <div class="number">
                                <span>X {{ goods_info.goods_number }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="refundType">
                <div class="title">
                    <span>退款商品</span>
                </div>
                <div class="refundType-choose" v-if="loading">
                    <van-cell is-link>
                        <template #title>
                            <div class="refundType-choose-title" style="background: #f2f3f5;height: 0.26rem;border-radius: 0.2rem;width: 40%;"></div>
                        </template>
                        <template #label>
                            <div class="refundType-choose-describe" style="background: #f2f3f5;height: 0.16rem;border-radius: 0.2rem;width: 60%;margin-top: 0.2rem;"></div>
                        </template>
                    </van-cell>
                    <van-cell is-link>
                        <template #title>
                            <div class="refundType-choose-title" style="background: #f2f3f5;height: 0.26rem;border-radius: 0.2rem;width: 40%;"></div>
                        </template>
                        <template #label>
                            <div class="refundType-choose-describe" style="background: #f2f3f5;height: 0.16rem;border-radius: 0.2rem;width: 60%;margin-top: 0.2rem;"></div>
                        </template>
                    </van-cell>
                </div>
                <div class="refundType-choose" v-else>
                    <van-cell is-link v-for="(item,index) in refund_type" :key="index + '_' + item.value" @click="refundClick(item.value)">
                        <template #title>
                            <div class="refundType-choose-title">
                                <span>{{ item.label }}</span>
                            </div>
                        </template>
                        <template #label>
                            <div class="refundType-choose-describe">
                                <span>{{ item.desc }}</span>
                            </div>
                        </template>
                    </van-cell>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {refundInitAxios, refundVerifyAxios} from "@/api/refund.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const loading = ref(false)
const order_sn = ref(null)
const order_detail_id =ref(null)
const goods_info = ref({})
const refund_type = ref([])

onMounted( () => {
    order_sn.value = route.query.order_sn
    order_detail_id.value = route.query.order_detail_id
    getData()
})

const getData = () => {
    refundInitAxios({order_sn:order_sn.value,order_detail_id:order_detail_id.value }).then((res) => {
        if (cns.$constant.isSuccessCode(res)) {
            goods_info.value = res.data.goods_info
            refund_type.value = res.data.refund_type
            if(goods_info.value.is_show_after_sales == 2){
                cns.appRoute('refundDetail', { order_sn:order_sn.value, order_detail_id:order_detail_id.value }, 'replace')
            }
            loading.value = false
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    });
}

const refundClick = (type) =>{
    refundVerifyAxios({order_sn:order_sn.value,order_detail_id:order_detail_id.value }).then((res) => {
        if (cns.$constant.isSuccessCode(res)) {
            cns.appRoute('refundForm', { order_sn:order_sn.value,order_detail_id:order_detail_id.value ,after_sales:goods_info.value.is_show_after_sales,refundType:type }, 'replace')
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    });
}
</script>

<style scoped lang="scss">
.refundIndex{
    .refundIndex-container{
        padding: 0.2rem;
        .refund-good{
            border-radius: 0.2rem;
            background: #fff;
            padding: 0.3rem;
            box-sizing: border-box;
            .title{
                span{
                    font-weight: bold;
                    font-size: 0.32rem;
                    color: #333333;
                }
            }
            .good{
                margin-top: 0.3rem;

                .picture{
                    width: 1.82rem;
                    height: 1.82rem;
                    margin-right: 0.2rem;
                    border-radius: 0.1rem;
                    overflow: hidden;
                    img {
                        width: 100%;
                        max-height: 100%;
                    }
                }
                .right{
                    .name{
                        -webkit-line-clamp: 2; // 用来限制在一个块元素显示的文本的行数
                        display: -webkit-box; // 将对象作为弹性伸缩盒模型显示
                        -webkit-box-orient: vertical; //设置或检查伸缩盒对象的子元素的排列方式
                        text-overflow: ellipsis; // 在多行文本的情况下，用...隐藏超出范围的文本
                        word-break: break-all;
                        overflow: hidden;
                        span{
                            font-weight: 400;
                            font-size: 0.22rem;
                            color: #333333;
                        }

                    }
                    .specifications {
                        span{
                            font-weight: 400;
                            font-size: 0.22rem;
                            color: #999999;
                        }
                    }
                    .info{
                        .price{
                            span{
                                font-weight: 400;
                                font-size: 0.3rem;
                                color: #F71111;
                            }
                        }
                        .number{
                            span{
                                font-weight: 400;
                                font-size: 0.24rem;
                                color: #333333;
                            }
                        }
                    }
                }
            }
        }
        .refundType{
            border-radius: 0.2rem;
            background: #fff;
            padding: 0.3rem;
            box-sizing: border-box;
            margin-top: 0.2rem;
            .title{
                font-weight: bold;
                font-size: 0.32rem;
                color: #333333;
            }
            .refundType-choose{
                :deep(.van-cell){
                    padding: 0.2rem 0.1rem;
                    align-items: center;
                    .refundType-choose-title{
                        span{
                            font-weight: bold;
                            font-size: 0.28rem;
                            color: #333333;
                        }
                    }
                    .refundType-choose-describe{
                        span{
                            font-weight: 400;
                            font-size: 0.24rem;
                            color: #999999;
                        }
                    }
                    .van-icon.van-cell__right-icon{
                        color: rgba(51, 51, 51, 1);
                    }
                    &.van-cell--clickable:active{
                        border-radius: 0.1rem;
                    }
                }
            }
        }
    }
}
</style>
