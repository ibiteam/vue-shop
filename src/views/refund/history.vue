<template>
    <div class="refundHistory">
        <common-header :title="title"></common-header>
        <div class="content">
            <div class="list" v-for="its in list" :key="its.id">
                <div class="user s-flex">
                    <div class="imgs">
                        <img :src="its.img" alt="">
                    </div>
                    <div class="right s-flex flex-dir jc-bt">
                        <div class="name">{{ its.name }}</div>
                        <div class="date">{{ its.created_at }}</div>
                    </div>
                </div>
                <div class="msg s-flex ai-ct flex-wrap">
                    <span>{{ its.action }}</span>
                    <span v-if="its.reason !== ''">{{ its.type === 0 ? '退款原因：' : '拒绝原因：' }}{{ its.reason }}</span>
                    <span v-if="its.refund_money !== ''">金额：¥{{ its.refund_money }}</span>
                    <span v-if="its.refund_number > 0">退款数量：{{ its.refund_number }} <template v-if="its.unit">{{ its.unit }}</template></span>
                </div>
                <template v-if="its.apply_refund_shipping">
                    <div class="alls">
                        <span>物流公司：</span>
                        <span>{{ its.apply_refund_shipping.company }}</span>
                    </div>
                    <div class="alls">
                        <span>物流单号：</span>
                        <span>{{ its.apply_refund_shipping.no }}</span>
                    </div>
                    <div class="alls">

                        <span>联系电话：</span>
                        <span>{{ its.apply_refund_shipping.phone }}</span>
                    </div>

                    <div class="picture">
                        <van-image v-for="(ims,imdx) in its.apply_refund_shipping.certificate" :key="imdx" :src="ims" @click="preview({images:[...its.apply_refund_shipping.certificate],startPosition:imdx})" />
                    </div>
                    <div class="alls">
                        <span>补充描述：</span>
                        <span>{{ its.apply_refund_shipping.description }}</span>
                    </div>
                </template>
                <div class="picture" v-if="its.certificate && its.certificate.length>0">
                    <van-image v-for="(ims,imdx) in its.certificate" :key="imdx" :src="ims" @click="preview({images:[...its.certificate],startPosition:imdx})" />
                </div>
                <div class="alls" v-if="its.apply_comment">
                    <span>退款描述：</span>
                    <span>{{ its.apply_comment }}</span>
                </div>
            </div>
        </div>
      <!--没有数据-->
      <div v-if="noData" class="no-Data">
        <img src="@/assets/images/nodata.png" alt="" class="no-Img" />
        <span>暂无数据</span>
      </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {refundHistoryAxios} from "@/api/order.js";
import {showImagePreview} from "vant";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const title = ref('协商历史')
const list = ref([])
const noData = ref(false)

onMounted( () => {
    getData()
})

const getData = () => {
    refundHistoryAxios({apply_refund_id:route.query.apply_refund_id}).then((res) => {
        if (cns.$constant.isSuccessCode(res)) {
            list.value = [...res.data]
          if(res.data.length == 0){
            noData.value = true
          }
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    });
}

const preview = (arr,index) => {
    showImagePreview(arr);
}

</script>

<style scoped lang="scss">
.refundHistory{
    background: #f2f2f2;
    min-height: 100%;
    .content{
        margin-top: 0.32rem;
        box-sizing: border-box;
        padding-bottom: 0.9rem;
        .list{
            width: 100%;
            background: #FFFFFF;
            margin-top: 0.2rem;
            padding: 0.31rem 0.2rem;
            box-sizing: border-box;
            .user{
                .imgs{
                    width: 0.66rem;
                    height: 0.66rem;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .right{
                    margin-left: 0.2rem;
                    .name{
                        font-size: 0.24rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #333333;
                    }
                    .date{
                        font-size: 0.22rem;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #999999;
                    }
                }
            }
            .msg{
                margin-top: 0.4rem;
                span{
                    font-size: 0.26rem;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #333333;
                    margin-top: 0.1rem;
                    margin-left: 10px;
                    &:first-child{
                        margin-left: none;
                    }
                }
            }
            .alls{
                margin-top: 0.3rem;
                span:first-child{
                    font-size: 0.26rem;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #777777;
                }
                span:last-child{
                    color: #333333;
                    word-break: break-word;
                }
            }
            .picture{
                margin-top: 0.27rem;
                .van-image{
                    width: 1.53rem;
                    height: 1.53rem;
                    margin-right: 0.19rem;
                }
            }
            .supplement{
                font-size: 0.26rem;
                font-family: PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 0.36rem;
            }
        }
    }
  /*无数据*/
  .no-Data {
    width: 100%;
    text-align: center;
    font-size: 0.28rem;
    padding: 1rem auto !important;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .no-Img {
    width: 6.1rem;
    height: 2.73rem;
    margin-top: 3.17rem;
    margin-bottom: 0.75rem;
  }
}
</style>
