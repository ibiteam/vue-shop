<template>
  <div class="attention-container" v-cloak>
    <common-header title="商品收藏"></common-header>
    <van-sticky :offset-top="pageOffsetTop" v-if="pagination.total > 0">
      <div class="header-tools">
        <div>
          共<span>{{ pagination.total }}</span
        >件商品
        </div>
        <div @click="checkFlag = !checkFlag">
          {{ checkFlag ? "完成" : "编辑" }}
        </div>
      </div>
    </van-sticky>
    <van-list
        v-model="loading"
        :finished="bottomline"
        :finished-text="noData? '': '去逛逛，关注更多产品吧~'
      "
        :immediate-check="false"
        :offset="offsetLoad"
        @load="loadMore"
        v-if="listFlag"
    >
      <div class="main">
        <van-checkbox-group
            v-model="checkGoodsResult"
            ref="checkboxGoodsGroup"
        >
          <div
              class="goods-box"
              :class="{ 'sold-out': item.is_on_sale == 0 }"
              v-for="(item, index) in good_list"
              :key="index"
          >
            <van-checkbox
                :name="item.goods_id"
                checked-color="#F71111"
                v-if="checkFlag"
                :ref="`checkbox${index}`"
                @click="checkGoodsChange"
            ></van-checkbox>
            <div
                class="goods-container"
                :style="{ left: checkFlag ? '.88rem' : '.28rem' }"
                @click="toGoods(item.goods_id,index)"
            >
              <div class="goods-img">
                <van-image
                    width="2.3rem"
                    height="2.3rem"
                    radius="0.2rem"
                    :src="item.goods_thumb"
                />
              </div>
              <ul class="goods-content">
                <li class="goods-name">
                  {{ item.goods_name }}
                </li>
                <li class="goods-sign">
                  <div
                      v-if="item.sign && item.is_ziying >= 0"
                      :class="item.is_ziying == 0 ? 'noziying' : 'ziying'"
                  >{{ item.sign }}</div
                  >
                  <div class="attribute" v-if="item.attribute_source">{{item.attribute_source==1?'现货':'期货'}}</div>
                  <div v-if="item.act_type == 1">秒杀</div>
                  <div v-if="item.act_type == 2">特卖</div>
                  <div v-if="item.act_type == 6">满减</div>
                  <div v-if="item.act_type == 11">VIP</div>
                  <div v-if="item.is_group">拼团</div>
                  <div v-show="item.has_coupon != ''">券</div>
                </li>
                <li class="goods-price" v-if="item.is_on_sale == 0">
                  暂无报价
                </li>
                <li class="goods-price" v-else>
                  <form-price
                      :price="item.shop_price"
                      :unit="item.unit"
                      unit_color="#333"
                  ></form-price>
                  <div
                      class="depreciate"
                      v-if="item.price_diff && item.price_diff != ''"
                  >
                    <p class="van-ellipsis">比关注时降{{ item.price_diff.toFixed(2) }}元</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </van-checkbox-group>
      </div>
      <div class="unfollow" v-if="checkFlag">
        <div class="check">
          <van-checkbox
              v-model="checkGoodsAllFlag"
              checked-color="#F71111"
              @click="checkGoodsAllChange"
          >全选</van-checkbox
          >
        </div>
        <van-button text="取消关注" @click="unFollow" />
      </div>
    </van-list>
    <!--没有数据-->
    <div v-if="noData" class="no-Data">
      <img src="@/assets/images/nodata.png" alt="" class="no-Img" />
      <span>您还没有关注的商品噢~</span>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance} from 'vue'
import {collectGoodsAxios, eidtCollectGoodsAxios} from "@/api/mine.js";
const cns = getCurrentInstance().appContext.config.globalProperties

const pageOffsetTop = ref(0)
const goodsType = ref(0)
const checkFlag = ref(false)
const checkGoodsAllFlag =ref(false)
const checkGoodsResult = ref([])
const good_list =ref([])
const pagination = ref({
  total: 0,
  page:0
})
const loading = ref(false)
const bottomline =ref(false)
const offsetLoad =ref(1)
const noData = ref(true)
const listFlag =ref(true)
const checkboxGoodsGroup = ref(null)

onMounted(() => {
  // loadData()
})

const loadData = () => {
  loading.value = false;
  noData.value = false;
  let info = {
    page: pagination.page,
    type:0
  };
  collectGoodsAxios(info).then((res) => {
    if (cns.$constant.isSuccessCode(res)) {
      good_list.value = res.data
      pagination.value = res.mate.pagination;
      pagination.page++
      if (res.data.length == 0 || !res.data) {
        noData.value = true;
        bottomline.value = true;
      }
      if (res.data.length < 10) {
        bottomline.value = true;
      }
    } else if (cns.$constant.isUnLoginCode(res)) {
      cns.appRoute('login')
    } else {
      cns.$toast(res.message)
    }
  });
}

const loadMore = () =>{
  let info = {
    page: pagination.page,
    type:0
  }
  if (good_list.value.length >= 10) {
    loading.value = true;
    collectGoodsAxios(info).then((res) => {
      if (cns.$constant.isSuccessCode(res)) {
        bottomline.value = res.data.length < 10 ? true : false;
        pagination.value = res.mate.pagination;
        if (pagination.page == 0) {
          good_list.value = res.data
        } else {
          good_list.value =  [...good_list.value, ...res.data]
        }
        checkGoodsChange()
        pagination.page++;
        loading.value = false;
        //请求出错的情况
      } else {
        cns.$toast(res.message);
        good_list.value = [];
      }
    });
  } else {
    loading.value = false;
    bottomline.value = true;
  }
}

const unFollow = () => {
  let info = {
    goods_arr:checkGoodsResult.valuetoString()
  }
  if(!info.goods_arr){
    cns.$toast('请先选择需要取消关注的商品');
    return
  }
  eidtCollectGoodsAxios(info).then((res) => {
    if (cns.$constant.isSuccessCode(res)) {
      checkFlag.value = false;
      checkGoodsAllFlag.value = false
      checkGoodsResult.value = [];
      loadData();
    } else {
      cns.$toast(res.message);
    }
  });
}

const checkGoodsChange = () => {
  checkGoodsAllFlag.value = checkGoodsResult.value.length == good_list.value.length;
}

const checkGoodsAllChange = (checked) => {
  checkboxGoodsGroup.value.toggleAll(
      checkGoodsAllFlag.value ? true : ""
  );
}

const toGoods = (goods_id) => {
  if (checkFlag.value) {
    // this.$refs[`checkbox${index}`][0].toggle();
    if (checkGoodsResult.value.indexOf(goods_id) == -1) {
      checkGoodsResult.value.push(goods_id)
    } else {
      checkGoodsResult.value.splice(checkGoodsResult.value.indexOf(goods_id), 1)
    }
    checkGoodsChange()
  } else {
    if (good_list.value[index].is_on_sale == 1) {
      cns.appRoute('good',{},{goods_id: goods_id})
    }
  }
}

</script>

<style scoped lang="scss">
.attention-container {
  background-color: #f2f2f2;
  height: auto;
  min-height: 100vh;
  color: #333;
  z-index: 100;
  .header-tools {
    width: 100%;
    height: 0.8rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    font-size: 0.26rem;
    background: #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div:first-child {
      span {
        color: #f71111;
        padding: 0 0.05rem;
      }
    }
  }
  .menu {
    height: 0.88rem;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      width: 1.7rem;
      text-align: center;
      font-size: 0.26rem;
      position: relative;
      &:nth-child(2):before,
      &:nth-child(2):after {
        content: "";
        width: 0.02rem;
        height: 0.16rem;
        background: #ccc;
        position: absolute;
        top: 0.1rem;
      }
      &:nth-child(2):before {
        left: 0;
      }
      &:nth-child(2):after {
        right: 0;
      }
      &.active {
        font-weight: 500;
        color: #f71111;
      }
    }
  }
  .main {
    :deep(.van-checkbox) {
      width: .5rem;
      height: 100%;
    }
    .cancel {
      color: #fff;
      background: linear-gradient(0deg, #fdc95e, #fcb011);
    }
    .top {
      color: #fff;
      background: linear-gradient(180deg, #f71111, #fa5f5f);
    }
    // 商品
    .goods-box {
      height: 2.9rem;
      margin-bottom: 0.2rem;
      padding: 0.3rem 0.28rem;
      box-sizing: border-box;
      background: #fff;
      position: relative;
      overflow: hidden;
      &.sold-out {
        .van-image::before {
          content: "";
          width: 1.4rem;
          height: 1.4rem;
          background: url("@/assets/images/attention/sold-out.png")
          no-repeat;
          background-size: cover;
          position: absolute;
          top: 0.45rem;
          left: 0.45rem;
        }
        .goods-content {
          .goods-name,
          .goods-price {
            color: #d0d0d0;
          }
          .goods-sign {
            display: none;
          }
        }
      }
      .goods-container {
        width: calc(100% - 0.56rem);
        height: calc(100% - 0.6rem);
        display: flex;
        align-items: flex-start;
        position: absolute;
        top: 0.3rem;
        left: 0.28rem;
      }
      .goods-img {
        width: 2.3rem;
        height: 2.3rem;
        position: relative;
        .van-image {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border-radius: 0.2rem;
        }
      }
      .goods-content {
        flex: 1;
        padding: 0 0.08rem 0 0.2rem;
        box-sizing: border-box;
        .goods-name {
          height: 0.54rem;
          line-height: 0.3rem;
          font-size: 0.22rem;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .goods-price:before, .goods-price:after{
          display: block;
          content: '';
          clear: both;
        }
        .goods-price {
          width: inherit;
          margin-top: 0.29rem;
          // display: flex;
          // align-items: baseline;
          font-size: 0.22rem;
          font-weight: 500;
          color: #333333;
          span {
            float: left;
            margin-right: 0.11rem;
            &:nth-child(1) {
              font-size: 0.3rem;
              color: #f71111;
            }
          }
          .depreciate {
            float: left;
            height: 0.3rem;
            margin-top: .05rem;
            padding: 0 0.13rem 0 0.4rem;
            box-sizing: border-box;
            font-size: 0.2rem;
            color: #f71111;
            border: 1px solid #f71111;
            border-radius: 0.5rem;
            position: relative;
            display: flex;
            align-items: center;
            &:before {
              content: "";
              width: 0.38rem;
              height: 0.3rem;
              border-top-left-radius: 0.5rem;
              border-bottom-left-radius: 0.5rem;
              background: #f71111 url("@/assets/images/attention/arrow.png")
              center no-repeat;
              background-size: 0.16rem 0.19rem;
              position: absolute;
              top: -1px;
              left: 0;
            }
            p{
              max-width: 3.8rem;
            }
          }
        }
        .goods-sign {
          margin-top: 0.26rem;
          display: flex;
          flex-direction: row;
          div {
            display: flex;
            align-items: center;
            margin-right: 0.1rem;
            height: .26rem;
            font-size: 0.2rem;
            border-radius: 0.04rem;
            padding: 0 0.07rem;
            color: #f71111;
            border: 1px solid #f61d4a;
            background: #fff;
            &.ziying {
              border-color: transparent;
              background: linear-gradient(90deg, #f71111, #fa5f5f);
              color: #fff;
            }
            &.noziying {
              border-color: transparent;
              background: linear-gradient(90deg, #5436d5, #735cff);
              color: #fff;
            }
            &.attribute {
              border-color: transparent;
              background: #FF8C11;
              color: #fff;
            }
          }
        }
      }
    }
    // 店铺左滑按钮
    :deep(.van-button) {
      height: 1.8rem;
    }
    :deep(.van-button--normal){
      border: none;
      padding: 0 18px;
    }
  }
  .unfollow {
    width: 100%;
    max-width: 750px;
    height: 0.98rem;
    padding: 0.15rem 0.28rem;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 0 0.1rem 0 rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    z-index: 200;
    :deep(.van-checkbox__label){
      height: .5rem;
      line-height: .5rem;
    }
    :deep(.van-button) {
      width: 4rem;
      height: 0.68rem;
      color: #fff;
      background: #0062EA;
      border-radius: 0.34rem;
    }
  }
}
:deep(.van-checkbox__icon--checked .van-icon){
  border-color:  #0062EA !important;
  background-color:  #0062EA !important;
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
</style>
