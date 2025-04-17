<template>
    <div class="refund">
        <common-header :title="title"></common-header>
        <div class="content" v-if="!is_loading">
            <div class="explain">
                <div class="explain-title">退款说明</div>
                <div class="explain-list s-flex">
                    <p>1、</p>
                    <p>订单退款后，退款金额将按支付方式原路返回，订单关闭；</p>
                </div>
                <div class="explain-list s-flex">
                    <p>2、</p>
                    <p>订单关闭后，无法恢复；</p>
                </div>
                <div class="explain-list s-flex">
                    <p>3、</p>
                    <p>如订单已使用的优惠券，订单关闭后优惠券不返还；</p>
                </div>
                <div class="explain-list s-flex">
                    <p>4、</p>
                    <p>如遇订单拆分，部分订单退款后优惠券不返还。</p>
                </div>
            </div>
            <div class="reason s-flex jc-bt ai-ct" @click="popupShow=true">
                <div><span class="xing">*</span><span class="reason-title">退款原因</span></div>
                <div class="reason-oper s-flex ai-ct">
                    <span>{{ refundForm.reason === '' ? '请选择原因（必填）' : refundForm.reason }}</span>
                    <em class="iconfont" style="font-size: 0.38rem;">&#xe60b;</em>
                </div>
            </div>
            <div class="money">
                <div class="setMoney">
                    <div class="alls s-flex jc-bt ai-ct">
                        <span class="alls-title">退款金额</span>
                        <div class="s-flex flex-v ai-fe">
                            <span class="alls-money" @click.stop="refund_data.type === 1?moneyShow = true:''">¥{{ refundForm.refundMoney }}<em v-if="refund_data.type===1" style="font-size: 0.18rem;color: #333333;margin-left: 0.17rem;" class="iconfont">&#xe6eb;</em></span>
                        </div>
                        <van-number-keyboard
                                v-if="refund_data.type === 1"
                                v-model="refundForm.refundMoney"
                                :show="moneyShow"
                                theme="custom"
                                :extra-key="['00', '.']"
                                close-button-text="完成"
                                @blur="moneyBlur"
                        />
                    </div>
                    <p>最多退￥{{ refund_data.order_detail.refund_max_amount }}</p>
                </div>
            </div>
            <div class="refund-number">
                <div class="setMoney">
                    <div class="alls s-flex jc-bt ai-ct">
                        <span class="alls-title">退款数量</span>
                        <div class="s-flex flex-v ai-fe">
                            <span class="alls-money" @click.stop="refund_data.type === 1?refund_number_keyboard = true:''">{{ refundForm.refund_number }}<em v-if="refund_data.type===1" style="font-size: 0.18rem;color: #333333;margin-left: 0.17rem;" class="iconfont">&#xe6eb;</em></span>
                        </div>
                        <van-number-keyboard
                                v-if="refund_data.type === 1"
                                v-model="refundForm.refund_number"
                                :show="refund_number_keyboard"
                                theme="custom"
                                :extra-key="['00', '.']"
                                close-button-text="完成"
                                @blur="refundNumberBlur"
                        />
                    </div>
                    <p>最多退{{ refund_data.order_detail.refund_max_number }}（{{ refund_data.order_detail.unit }}）</p>
                </div>
            </div>
            <template v-if="refund_data.type === 1">
                <div class="supplement">
                    <div class="title">补充描述</div>
                    <van-field v-model="refundForm.apply_comment"
                               type="textarea"
                               maxlength="200"
                               placeholder="请输入描述说明，有助于商家更好的处理售后问题"
                               show-word-limit
                    />
                    <div class="uploads s-flex">
                        <div class="">
                            <van-image v-for="(its,ids) in refundForm.certificate" :key="ids" :src="its" >
                                <template #default>
                                    <div class="operation" @click="delPicture(ids)">
                                        <em class="iconfont">&#xe68f;</em>
                                    </div>
                                </template>
                            </van-image>
                        </div>
                        <van-uploader multiple :before-read="beforeRead" v-if="refundForm.certificate && refundForm.certificate.length<3" :after-read="afterRead(index)">
                            <template #default>
                                <div class="imgs">
                                    <img :src="require('@/assets/images/refund/upload.png')" />
                                </div>
                            </template>
                        </van-uploader>
                    </div>
                    <div style="margin-top: 0.29rem;" class="upload-tips">请上传凭证，最多3张</div>
                </div>
            </template>
            <van-button  @click="doubleSubmit()">提 交</van-button>
        </div>
        <van-popup v-model:show="popupShow" position="bottom" :style="{ height: '60%' }" @close="reasonNow = reason">
            <div class="title s-flex ai-ct jc-bt">
                <span>请选择原因</span>
                <div class="imgs" @click="popupShow=false">
                    <img :src="require('@/assets/images/refund/closed.png')" alt="" class="noImg" />
                </div>
            </div>
            <div class="reason-list">
                <van-radio-group v-model="refundForm.reason">
                    <van-cell-group>
                        <van-cell :title="its.reason" :key="ids" v-for="(its,ids) in refund_data.reason" clickable @click="refundForm.reason = its.reason">
                            <template #right-icon>
                                <van-radio :name="its.reason" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <div class="btns">
                <van-button @click="reason = refundForm.reason;popupShow = false">确 定</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {refundDetailAxios, refundShowAxios} from "@/api/order.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const title = ref('')
const info = ref({})
const refund_data = ref({
    type: null,   //  0仅退款，1退货退款
    reason: null,   //  退款原因下拉
    order_detail: null  //  订单信息
})
const is_loading = ref(true)
const after_sales = ref(null)
const refundForm = ref({
    reason: '',
    refund_number: '',
    apply_comment: '',
    certificate: [],
    refundMoney: '' //  退款金额
})
const status = ref(null)
const explain = ref('')
const popupShow =ref(false)
const money = ref('')
const goods_money = ref('')
const reason = ref('')
const apply_comment = ref('')
const reasonNow = ref('')
const reasonList = ref([])
const is_edit = ref(false)
const moneyShow = ref(false)
const refund_number = ref('')
const refund_goods_number = ref('')
const refund_number_keyboard = ref('')

onMounted(()=>{
    if(route.query.type){
        is_edit.value = true
    }
    getPageData()
})

const getPageData = () =>{
    after_sales.value = route.query.after_sales
    if (after_sales.value != 1 && route.query.apply_refund_id) {
        info.value.apply_refund_id = route.query.apply_refund_id
    }
    info.value.order_sn = route.query.order_sn
    if(after_sales.value == 1){
        info.value.type = route.query.refundType
    }
    info.value.order_detail_id = route.query.order_detail_id
    if (after_sales.value == 1) {
        refundShowAxios(info.value).then(res => {
            operatePageData(res)
        })
    }else{
        refundDetailAxios(info.value).then(res => {
            operatePageData(res)
        })
    }
}

const operatePageData = (res) =>{
    if (cns.$constant.isSuccessCode(res)) {
        refund_data.value = res.data
        if (res.data.type === 1) {
            title.value = '退货退款'
        } else {
            title.value = '仅退款'
        }
        if (after_sales.value == 1) {
            refundForm.value = {
                ...refundForm.value,
                refundMoney: refund_data.value.order_detail.refund_max_amount,
                refund_number: refund_data.value.order_detail.refund_max_number,
            }
            status.value = -1
        } else {
            status.value = refund_data.value.refund_info.status
            time.value = (refund_data.value.refund_info.job_time - refund_data.value.refund_info.system_time) * 1000
            formatL.value = 86400 < (refund_data.value.refund_info.job_time - refund_data.value.refund_info.system_time) ? '还剩 DD 天 HH 时 mm 分 ss 秒':'还剩 HH 时 mm 分 ss 秒'
            //  如果申请退款被拒绝使用
            if (refund_data.value.from_init) {
                refund_data.value.reason = refund_data.value.from_init.reason
                refundForm.value = {
                    ...refundForm.value,
                    reason: refund_data.value.refund_info.reason,
                    refundMoney: refund_data.value.refund_info.refund_money,
                    refund_number: refund_data.value.refund_info.refund_number,
                    apply_comment: refund_data.value.refund_info.apply_comment,
                    certificate: refund_data.value.refund_info.certificate,
                }
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
</script>

<style scoped lang="scss">
.refund {
    min-height: 100%;
    background: #fff;

    .content {
        padding: 0 0.2rem;
        box-sizing: border-box;

        .explain {
            margin-top: 0.32rem;
            width: 100%;
            height: 3rem;
            background: #F8F8F8;
            border: 1px solid #ECECEC;
            border-radius: 0.2rem;
            padding: 0.29rem 0.21rem;
            box-sizing: border-box;

            .explain-title {
                font-size: 0.28rem;
                font-family: PingFang SC;
                font-weight: 600;
                color: #333333;
                margin-bottom: 0.3rem;
            }

            p {
                font-size: 0.24rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #666666;
                line-height: 0.36rem;
            }
        }

        .reason {
            width: 100%;
            height: 1.2rem;
            background: #FFFFFF;
            box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.1);
            border-radius: 0.2rem;
            margin-top: 0.3rem;
            padding: 0 0.2rem;
            box-sizing: border-box;

            .reason-title {
                font-size: 0.28rem;
                font-family: PingFang SC;
                font-weight: 600;
                color: #333333;
            }

            .xing {
                color: #F71111;
                font-size: 0.28rem;
            }

            .reason-oper {
                span {
                    font-size: 0.28rem;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #999999;
                }
            }
        }

        .money, .refund-number {
            width: 100%;
            box-sizing: border-box;
            background: #FFFFFF;
            box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.1);
            border-radius: 0.2rem;
            margin-top: 0.3rem;
            padding: 0 0.21rem;
            box-sizing: border-box;

            .setMoney {
                border-bottom: 1px #ECECEC solid;
                padding-bottom: 0.21rem;

                p {
                    text-align: right;
                }
            }

            .alls {
                height: 0.95rem;

                .alls-title {
                    font-size: 0.28rem;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #333333;
                }

                .alls-money {
                    font-size: 0.24rem;
                    font-family: PingFang SC;
                    font-weight: 600;
                    color: #F71111;
                }

                p {
                    font-size: 0.2rem;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #999999;
                }
            }

            .good {
                height: 0.95rem;

                .alls-title {
                    font-size: 0.26rem;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #333333;
                }

                .alls-money {
                    font-size: 0.24rem;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #333333;
                }
            }
        }

        .supplement {
            background: #FFFFFF;
            box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.1);
            border-radius: 0.2rem;
            padding: 0.4rem 0.2rem;
            box-sizing: border-box;
            margin-top: 0.2rem;

            .title {
                font-size: 0.28rem;
                font-family: PingFang SC;
                font-weight: 600;
                color: #333333;
            }

            .van-cell {
                margin-top: 0.29rem;
                padding: 0;
                width: 100%;
                background: #FAFAFA;
                border-radius: 0.1rem;

                :deep(.van-field__control) {
                    height: 2.2rem !important;
                }
            }

            .uploads {
                margin-top: 0.35rem;

                :deep(.van-uploader){
                    margin-right: 0.18rem;
                    .imgs {
                        width: 1.52rem;
                        height: 1.52rem;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .van-uploader__wrapper {
                        display: flex;
                        flex-direction: row-reverse;
                    }
                }

                .van-image {
                    width: 1.53rem;
                    height: 1.53rem;
                    margin-right: 0.18rem;
                    position: relative;
                    border: solid 1px #f5f5f5;

                    :deep(.operation){
                        position: absolute;
                        top: -5px;
                        right: -5px;

                        .iconfont {
                            opacity: .5;
                        }
                    }
                }
            }

            .upload-tips {
                font-size: 0.24rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #999999;
            }
        }
    }

    :deep(.van-popup) {
        padding: 0.45rem 0;
        box-sizing: border-box;

        .title {
            padding: 0 0.27rem;

            span {
                font-size: 0.32rem;
                font-family: PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 0.3rem;
            }

            .imgs {
                width: 0.36rem;
                height: 0.36rem;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .reason-list {
            margin-top: 0.14rem;

            .van-radio-group {
                .van-cell-group {
                    &::after {
                        content: none;
                    }

                    .van-cell {
                        /* padding: 0.4rem 0; */
                        height: 1.1rem;
                        align-items: center;

                        .van-cell__title span {
                            font-size: 0.26rem;
                            font-family: PingFang SC;
                            font-weight: 400;
                            color: #333333;
                            line-height: 0.3rem;
                        }
                    }

                    .van-radio__icon--checked .van-icon {
                        line-height: 1;
                        background-color: #ff0000;
                        border-color: #ff0000;
                    }
                }
            }
        }

        .btns {
            padding: 0 0.3rem;
        }
    }

    :deep(.van-button) {
        margin-top: 0.6rem;
        width: 100%;
        height: 0.8rem;
        background: linear-gradient(90deg, #FA5F5F, #F71111);
        border-radius: 0.4rem;

        .van-button__text {
            font-size: 0.3rem;
            font-family: PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 0.3rem;
        }
    }
}
</style>
