<template>
  <div class="refundOrderRefund">
    <common-header :title="title"></common-header>
    <div class="content">
      <div class="logistics">
        <van-field v-model="no" label="物流单号" :maxlength="30" input-align="right" placeholder="请填写" />
        <van-field v-model="company" label="物流公司" input-align="right" is-link readonly placeholder="请选择" @click="show=true" />
        <van-field v-model="phone" label="联系电话" input-align="right" readonly placeholder="请输入联系电话" />
        <van-popup v-model:show="show" round position="bottom">
          <van-picker
              title="请选择物流公司"
              show-toolbar
              :columns="options"
              @confirm="onConfirm"
              @cancel="show = false"
              :columns-field-names="customFieldName"
          />
        </van-popup>
      </div>
      <div class="supplement">
        <div class="title">补充描述</div>
        <van-field v-model="description"
                   type="textarea"
                   :maxlength="200"
                   placeholder="请输入描述说明，有助于商家更好的处理售后问题"
                   show-word-limit
        />
        <div class="uploads s-flex">
          <div class="">
            <van-image v-for="(its,ids) in certificate" :key="ids" :src="its" >
              <template #default>
                <div class="operation" @click="delPicture(ids)">
                  <em class="iconfont">&#xe68c;</em>
                </div>
              </template>
            </van-image>
          </div>
          <van-uploader multiple :before-read="beforeRead" v-if="certificate.length<3" :after-read="afterRead()">
            <template #default>
              <div class="imgs">
                <img src="@/assets/images/refund/upload.png" />
              </div>
            </template>
          </van-uploader>
        </div>
        <div class="upload-tips" style="margin-top: 0.29rem;">请上传凭证，最多3张</div>
      </div>
      <van-button @click="submit()">提 交</van-button>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import {refundShipAddAxios, refundShipInfoAxios} from "@/api/order.js";
import {uploadFileAxios} from "@/api/common.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const router = useRouter()

const title = ref('填写单号')
const show = ref(false)
const options = ref([])
const certificate = ref([])
const description = ref('')
const company = ref('')
const ship_company_id = ref(null)
const phone = ref('')
const no = ref('')
const customFieldName = {
  text: 'name',
  value: 'id',
};

onMounted(() => {
  getData()
})

const getData = () => {
  refundShipInfoAxios({apply_refund_id:route.query.id}).then(res => {
    if (cns.$constant.isSuccessCode(res)) {
      phone.value = res.data.mobile
      options.value = res.data.ship_companies
    } else if (cns.$constant.isUnLoginCode(res)) {
      cns.appRoute('login')
    }else {
      cns.$toast(res.message)
    }
  })
}

const onConfirm =({selectedOptions}) =>{
  company.value = selectedOptions[0].name
  ship_company_id.value = selectedOptions[0].id
  show.value = false
}

const beforeRead = (file) =>{
  if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/png") {
    cns.$toast("请上传 jpg/jpeg/png 格式图片");
    return false;
  } else if (certificate.value.length >= 3) {
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
        certificate.value.push(res.data.url)
      } else if(cns.$constant.isUnLoginCode(res)){
        cns.appRoute('login')
      } else {
        cns.$toast(res.message);
      }
    });
  };
}

const delPicture = (index) => {
  certificate.value.splice(index,1)
}

const submit = () => {
  let info = {
    apply_refund_id:route.query.id,
    no:no.value,
    ship_company_id:ship_company_id.value,
    phone:phone.value,
    description:description.value,
    certificate:certificate.value.toString(),
  }
  console.log(info)
  if(info.no === ''){
    cns.$toast('请填写物流订单号');
  }else if(!info.ship_company_id){
    cns.$toast('请选择物流公司');
  }else{
    refundShipAddAxios(info).then(res => {
      if(cns.$constant.isSuccessCode(res)){
        router.back()
        cns.$toast(res.message)
      } else if(cns.$constant.isUnLoginCode(res)){
        cns.appRoute('login')
      }else{
        cns.$toast(res.message);
      }
    })
  }
}
</script>

<style scoped lang="scss">
.refundOrderRefund{
  min-height: 100%;
  background: #fff;
  .content{
    margin-top: 0.32rem;
    padding: 0 0.2rem;
    box-sizing: border-box;
    .logistics{
      background: #FFFFFF;
      box-shadow: 0 0 0.2rem 0 rgba(0,0,0,0.1);
      border-radius: 0.2rem;
      padding: 0.1rem 0;
    }
    .supplement{
      background: #FFFFFF;
      box-shadow: 0 0 0.2rem 0 rgba(0,0,0,0.1);
      border-radius: 0.2rem;
      padding: 0.4rem 0.2rem;
      box-sizing: border-box;
      margin-top: 0.2rem;
      .title{
        font-size: 0.28rem;
        font-family: PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .van-cell{
        margin-top: 0.29rem;
        padding: 0;
        width: 100%;
        background: #FAFAFA;
        border-radius: 0.1rem;
        :deep(.van-field__value){
          padding: 0.2rem;
        }
        :deep(.van-field__control){
          height: 2.2rem !important;
        }
      }
      .uploads{
        margin-top: 0.35rem;
        :deep(.van-uploader){
          margin-right: 0.18rem;
          .imgs{
            width: 1.52rem;
            height: 1.52rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .van-uploader__wrapper{
            display: flex;
            flex-direction: row-reverse;
          }
        }
        .van-image{
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
      .upload-tips{
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
    :deep(.van-button){
      margin-top: 0.6rem;
      width: 100%;
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
}
</style>
