<template>
  <div class="balance">
    <common-header title="余额"></common-header>
    <div class="balance_head">
      <div class="balance_head_back"></div>
      <div class="balance_head_main">
        <div>{{ balanceInfo.total_money_app?balanceInfo.total_money_app:'--' }}</div>
        <div>
          可用总余额(元)
          <div style="display: inline-block">
            <img src="@/assets/images/property/balance/question.png" @click="showQuestion" style="width: 0.28rem;height: 0.28rem;vertical-align: middle;margin-top:-0.04rem" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="balance_title">余额明细</div>
    <div class="balance_list">
      <div class="balance_model" v-for="(item, index) of balanceInfo.info"
           @click="handleClickList(item.company_id)">
        <div class="s_flex flex_pack_justify balance_model_head">
          <div>{{ item.company }}</div>
          <span class="iconfont iconicon-to_right">&#xe60b;</span>
        </div>
        <div class="balance_model_info">
          <div v-for="(infoItem, infoIndex) of item.pay_types">
            <div class="balance_model_type">{{ infoItem.name }}</div>
            <div class="balance_model_num">可用余额: <span>{{ infoItem.use_balance_app | formatMoney }}元</span>
            </div>
          </div>
        </div>
      </div>
      <!--无数据-->
      <div class="noData" v-if="noDataShow">
        <img src="@/assets/images/nodata.png" alt="" class="noImg">
        <div class="noTex">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
import {getUserData} from "@/api/ucenter.js";
import {getBalanceAxios} from "@/api/property.js";
const cns = getCurrentInstance().appContext.config.globalProperties

const userInfo = ref({})
const balanceInfo = ref({})
const noDataShow = ref(true)

onMounted(() => {
  // getUserBalance()
})

const getUserBalance = () => {
  getUserData().then(res => {
    if (res.code == 200) {
      userInfo.value = res.data;
      getBalanceAxios({mobile: userInfo.mobile_phone}).then(ret => {
        if (ret.code == 200) {
          if (ret.data.info.length == 0) {
            noDataShow.value = true;
          }
          balanceInfo.value = ret.data;
        } else if (ret.code == 403) {
          cns.appRoute('login')
        } else {
          balanceInfo.total_money_app = 0;
          balanceInfo.info = [];
          noDataShow.value = true;
        }
      })
    } else if (res.code == 403) {
      cns.appRoute('login', {}, {}, 'replace')
    } else {
      cns.$toast(res.message);
    }
  }).catch(err => {
  })
}

const handleClickList = () => {
  // let params = {'company_id': id}
  // cns.appRoute('balanceList', {}, params)
}

const showQuestion = () => {
  cns.$dialog.alert({
    title:'温馨提示',
    message: '1、账户余额按公司区分展示，目前只开放用户在自营公司的收支明细；\n' +
        '\n' +
        '2、用户在消费时，只有购买该公司店铺下的商品才能使用余额支付。',
  }).then(() => {})
}

const formatMoney = (money) => {
  money = money.toString().replace(/\$|\,/g, "");
  if (isNaN(money)) {
    money = "0";
  }
  let sign = (money == (money = Math.abs(money)));
  money = Math.floor(money * 100 + 0.50000000001);
  let cents = money % 100;
  money = Math.floor(money / 100).toString();
  if (cents < 10) {
    cents = "0" + cents;
  }
  for (let i = 0; i < Math.floor((money.length - (1 + i)) / 3); i++) {
    money = money.substring(0, money.length - (4 * i + 3)) + "," + money.substring(money.length - (4 * i + 3));
  }
  return (((sign) ? "" : "-") + money + "." + cents);
}
</script>

<style scoped lang="scss">
.balance {
  .balance_head {
    position: relative;
  }

  .balance_head_back {
    background: #F62A34;
    width: 100%;
    height: 2.81rem;
  }

  .balance_head_main {
    position: absolute;
    height: 3.65rem;
    left: 0.1rem;
    right: 0.1rem;
    top: 0.1rem;
    background: url("@/assets/images/property/balance/back.png") center / 100% 100% no-repeat;
    text-align: center;
  }

  .balance_head_main > div:nth-child(1) {
    color: #ffffff;
    font-size: 0.46rem;
    font-weight: bold;
    margin-top: 1.3rem;
    max-width: 100%;
    overflow: hidden;
  }

  .balance_head_main > div:nth-child(2) {
    width: 3rem;
    height: 0.52rem;
    margin-top: 0.25rem;
    color: #ffffff;
    font-size: 0.22rem;
    display: inline-block;
    background: url("@/assets/images/property/balance/greyback.png") center / 100% 100% no-repeat;
    line-height: 0.64rem;
  }

  .balance_title {
    line-height: 0.96rem;
    padding-left: 0.44rem;
    font-size: 0.32rem;
    color: #333333;
    position: relative;
    margin-top: 0.7rem;
  }

  .balance_title:before {
    content: "";
    width: 0.06rem;
    height: 0.3rem;
    background: linear-gradient(#FF7F61, #F51E4A);
    position: absolute;
    top: 0.33rem;
    left: 0.2rem;
  }

  .balance_model {
    margin: 0.2rem 0.3rem;
    box-shadow: 0 1px 1px 1px #cccccc;
    border-radius: 0.2rem;
    background: #ffffff;
  }

  .balance_model_head {
    padding: 0.2rem 0.3rem;
    border-bottom: 1px solid #E5E5E5;
  }

  .balance_model_head > div {
    font-size: 0.28rem;
    color: #333333;
  }

  .balance_model_info {
    padding: 0.3rem;
  }

  .balance_model_type {
    font-size: 0.28rem;
    color: #333333;
    line-height: 0.5rem;
  }


  .balance_model_num {
    font-size: 0.25rem;
    color: #999999;
    line-height: 0.5rem;
  }

  .balance_model_num > span {
    font-size: 0.25rem;
    color: #F71111;
    margin-left: 0.1rem;
  }
  /*无数据*/
  .noData {
    width: 6.1rem;
    height: 2.73rem;
    margin: 2.8rem auto;
  }

  .noImg {
    width: 100%;
    height: 100%;
  }

  .noData .noTex {
    text-align: center;
    color: #999999;
    font-size: 0.28rem;
    margin-top: 0.42rem;
  }
}
</style>
