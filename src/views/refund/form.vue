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
            <div class="reason s-flex jc-bt ai-ct" @click="showReason">
                <div><span class="xing">*</span><span class="reason-title">退款原因</span></div>
                <div class="reason-oper s-flex ai-ct">
                    <span>{{ refundForm.reason_id === '' ? '请选择原因（必填）' : formatReason }}</span>
                    <em class="iconfont" style="font-size: 0.38rem;">&#xe60b;</em>
                </div>
            </div>
            <div class="money">
                <div class="setMoney">
                    <div class="alls s-flex jc-bt ai-ct">
                        <span class="alls-title">退款金额</span>
                        <div class="s-flex flex-v ai-fe">
                            <span class="alls-money" @click.stop="refund_data.type === 1?moneyShow = true:''">¥{{ refundForm.money }}<em v-if="refund_data.type===1" style="font-size: 0.18rem;color: #333333;margin-left: 0.17rem;" class="iconfont">&#xe79a;</em></span>
                        </div>
                        <van-number-keyboard
                                v-if="refund_data.type === 1"
                                v-model="refundForm.money"
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
                            <span class="alls-money" @click.stop="refund_data.type === 1?refund_number_keyboard = true:''">{{ refundForm.number }}<em v-if="refund_data.type===1" style="font-size: 0.18rem;color: #333333;margin-left: 0.17rem;" class="iconfont">&#xe79a;</em></span>
                        </div>
                        <van-number-keyboard
                                v-if="refund_data.type === 1"
                                v-model="refundForm.number"
                                :show="refund_number_keyboard"
                                theme="custom"
                                :extra-key="['00', '.']"
                                close-button-text="完成"
                                @blur="refundNumberBlur"
                        />
                    </div>
                    <p>最多退{{ refund_data.order_detail.refund_max_number }}<template v-if="refund_data.order_detail.goods_unit">（{{ refund_data.order_detail.goods_unit }}）</template></p>
                </div>
            </div>
            <template v-if="refund_data.type === 1">
                <div class="supplement">
                    <div class="title">补充描述</div>
                    <van-field v-model="refundForm.description"
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
                                        <em class="iconfont">&#xe68c;</em>
                                    </div>
                                </template>
                            </van-image>
                        </div>
                        <van-uploader multiple :before-read="beforeRead" v-if="refundForm.certificate && refundForm.certificate.length<3" :after-read="afterRead">
                            <template #default>
                                <div class="imgs">
                                    <img src="@/assets/images/refund/upload.png" />
                                </div>
                            </template>
                        </van-uploader>
                    </div>
                    <div style="margin-top: 0.29rem;" class="upload-tips">请上传凭证，最多3张</div>
                </div>
            </template>
            <van-button  @click="handleClickSubmitRefund()">提 交</van-button>
        </div>
        <van-popup v-model:show="popupShow" position="bottom" :style="{ height: '60%' }" @close-on-click-overlay="reason_id = refundForm.reason_id">
            <div class="title s-flex ai-ct jc-bt">
                <span>请选择原因</span>
                <div class="imgs" @click="popupShow=false">
                    <img src="@/assets/images/refund/closed.png" alt="" class="noImg" />
                </div>
            </div>
            <div class="reason-list">
                <van-radio-group v-model="reason_id">
                    <van-cell-group inset>
                      <template v-for="(its,ids) in refund_data.reason" :key="ids">
                        <van-cell :title="its.content" clickable @click="reason_id = its.id">
                          <template #right-icon>
                            <van-radio :name="its.id" />
                          </template>
                        </van-cell>
                      </template>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <div class="btns">
                <van-button @click="refundForm.reason_id = reason_id;popupShow = false">确 定</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {refundDetailAxios, refundShowAxios, refundStoreAxios} from "@/api/order.js";
import {uploadFileAxios} from "@/api/common.js";
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
    reason_id: '',
    number: '',
    description: '',
    certificate: [],
    money: '' //  退款金额
})
const status = ref(null)
const popupShow =ref(false)
const reason_id = ref('')
const is_edit = ref(false)
const moneyShow = ref(false)
const refund_number_keyboard = ref(false)

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
                money: refund_data.value.order_detail.refund_max_amount,
                number: refund_data.value.order_detail.refund_max_number,
            }
            status.value = -1
        } else {
            status.value = refund_data.value.refund_info.status
            //  如果申请退款被拒绝使用
            if (refund_data.value.from_init) {
                refund_data.value.reason = refund_data.value.from_init.reason
                refundForm.value = {
                    ...refundForm.value,
                    reason_id: refund_data.value.refund_info.reason_id,
                    money: refund_data.value.refund_info.money,
                    number: refund_data.value.refund_info.number,
                    description: refund_data.value.refund_info.description,
                    certificate: refund_data.value.refund_info.certificate,
                }
                refund_data.value.order_detail.refund_max_amount = refund_data.value.from_init.refund_max_amount
                refund_data.value.order_detail.refund_max_number = refund_data.value.from_init.refund_max_number
            }
        }
      is_loading.value = false
    } else if (cns.$constant.isUnLoginCode(res)) {
      cns.appRoute('login')
    }else {
        cns.$toast(res.message)
    }
}

const beforeRead = (file) =>{
  if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/png") {
    cns.$toast("请上传 jpg/jpeg/png 格式图片");
    return false;
  } else if (refundForm.value.certificate.length >= 3) {
    cns.$toast("最多上传三张图片");
    return false;
  }
  var isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    cns.$toast("文件大小不得超过5M");
  }
  return isLt5M;
}

const afterRead = () =>{
  return (file) => {
    let info = {
      file: file.file,
    };
    uploadFileAxios(info).then((res) => {
      if (cns.$constant.isSuccessCode(res)) {
        refundForm.value.certificate.push(res.data.url)
      } else if(cns.$constant.isUnLoginCode(res)){
        cns.appRoute('login')
      } else {
        cns.$toast(res.message);
      }
    });
  };
}

const delPicture = (index) => {
  refundForm.value.certificate.splice(index, 1)
}

const moneyBlur = () =>{
  moneyShow.value = false
  if (!refundForm.value.money || Number(refundForm.value.money) === 0 || Number(refundForm.value.money) > Number(refund_data.value.order_detail.refund_max_amount) || refundForm.value.money.split('.').length - 1 > 1) {
    refundForm.value.money = refund_data.value.order_detail.refund_max_amount
  }
}

const refundNumberBlur = () => {
  refund_number_keyboard.value = false
  if (!refundForm.value.number || Number(refundForm.value.number) === 0 || Number(refundForm.value.number) > Number(refund_data.value.order_detail.refund_max_number) || refundForm.value.number.split('.').length - 1 > 1) {
    refundForm.value.number = refund_data.value.order_detail.refund_max_number
  }
}

const showReason = () =>{
  reason_id.value = refundForm.value.reason_id
  popupShow.value = true
}

const formatReason = computed(() => {
  let reasonSelect = refund_data.value.reason.filter(item => item.id == refundForm.value.reason_id)
  return reasonSelect[0].content
});

const handleClickSubmitRefund = () =>{
  if (refundForm.value.reason_id === '') {
    cns.$toast('请选择退款原因!');
  } else {
    if (!refundForm.value.money || refundForm.value.money <= 0) {
      cns.$toast('可退款金额为0，暂不支持申请')
      return false
    }
    if (!refundForm.value.number || refundForm.value.number <= 0) {
      cns.$toast('可退款数量为0，暂不支持申请')
      return false
    }
    let info = {
      apply_refund_id: route.query.apply_refund_id,
      order_sn: route.query.order_sn,
      order_detail_id: route.query.order_detail_id,
      number:refundForm.value.number,
      money: Number(refundForm.value.money),
      type:Number(route.query.refundType),
      reason_id: refundForm.value.reason_id,
      description: refundForm.value.description,
      certificate: refundForm.value.certificate.toString(),
    }
    refundStoreAxios(info).then(res => {
      if (cns.$constant.isSuccessCode(res)) {
        cns.$toast('申请成功');
        const query_info = {
          order_sn: info.order_sn,
          order_detail_id: info.order_detail_id,
          apply_refund_id: res.data.apply_refund_id,
          after_sales: null
        }
        cns.appRoute('refundDetail', query_info, 'replace')
      } else if (cns.$constant.isUnLoginCode(res)) {
        cns.appRoute('login')
      } else if(res.code === 4005) {
        cns.appRoute('orderDetail',{order_sn:info.value.order_sn}, 'replace')
      } else if(res.code === 4006) {
        cns.appRoute('refundDetail', {
          order_sn: info.value.order_sn,
          order_detail_id: info.value.order_detail_id,
          after_sales: after_sales.value
        }, 'replace')
      } else {
        cns.$toast(res.message);
      }
    })
  }
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
                :deep(.van-field__value){
                  padding: 0.2rem;
                }

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
                      width:0.26rem;
                      height:0.26rem;
                      background: #000000;
                      border-radius: 50%;
                      position: absolute;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                        top: -5px;
                        right: -5px;

                        .iconfont {
                          color: #ffffff;
                          font-size: 0.16rem;
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
