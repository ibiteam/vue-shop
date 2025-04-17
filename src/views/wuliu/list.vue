<template>
  <div class="ship-index">
    <commonHeader :title="title"></commonHeader>
    <!--骨架屏-->
    <div class="ship-skeleton" v-if="is_loading">
      <van-skeleton title :row="3" v-for="item in 5" />
    </div>
    <template v-else>
      <div class="ship-title" v-if="!is_nodata">共有 <span>{{shipList.length}}</span> 个物流运输</div>
      <!--列表-->
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
      >
        <div class="ship-list">
          <div class="ship-item" v-for="(item, index) in shipList" :key="index" :class="{ dazong: item.type == 1 }" @click="appRoute('wuliuDetail', { delivery_no: item.delivery_no })">
            <div class="list-title s-flex">
              <img src="@/assets/images/order/wuliu_car.png" alt="">
              <p class="van-ellipsis flex-1">{{item.ship_company_name}}：{{item.ship_no}}</p>
              <van-icon name="arrow" />
            </div>
            <h1 class="van-ellipsis">{{item.remark  ? item.remark : '暂无快递信息！'}}</h1>
            <div class="ship-date">{{item.shipped_at}}</div>
          </div>
        </div>
      </van-list>
      <div class="is-nodata" v-if="is_nodata">
        <img class="noImg" src="@/assets/images/nodata.png"/>
        <div class="noTex">暂无数据</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {wuliuListAxios} from "@/api/order.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const title = ref('查看物流')
const is_loading =ref(true)
const info = ref({
  page: 1,
  order_sn: null,
  number:10
})
const shipList = ref([])
const loading = ref(false)
const finished =ref(false)
const is_nodata = ref(false)

onMounted(()=>{
  if (route.query.order_sn) {
    info.value.order_sn = route.query.order_sn
    getPageData()
  }
})

const getPageData = () => {
  wuliuListAxios(info.value).then(res => {
    if (cns.$constant.isSuccessCode(res)) {
      if (res.data.list.length > 0) {
        shipList.value = res.data.list
        is_nodata.value = false
      } else {
        shipList.value = []
        is_nodata.value = true
      }
    } else if (cns.$constant.isUnLoginCode(res)) {
      cns.appRoute('login')
    }else {
      cns.$toast(res.message)
    }
    is_loading.value = false
  })
}

const loadMore = () => {
  if (shipList.value.length >= 10) {
    if (info.value.page == 1) {
      info.value.page = 2
    }
    wuliuListAxios(info.value).then(res => {
      if (cns.$constant.isSuccessCode(res)) {
        if (res.data.list.length > 0) {
          shipList.value = shipList.value.concat(res.data.data)
        } else {
          finished.value = true
        }
        info.value.page ++
      } else if (cns.$constant.isUnLoginCode(res)) {
        cns.appRoute('login')
      }else {
        cns.$toast(res.message)
      }
    })
  } else {
    loading.value = false
    finished.value = false
  }
}

</script>

<style lang="scss" scoped>
.ship-index {
  .ship-title { line-height: 0.84rem; padding: 0 0.3rem; font-size: 0.24rem; }
  .ship-title span { color: #F71111; }
  /*骨架屏*/
  .ship-skeleton { overflow: hidden; }
  .ship-skeleton > div { padding: 0.3rem 0.2rem; background-color: #ffffff; }
  /*列表*/
  .ship-list {
    overflow: hidden;
    .ship-item { padding: 0.2rem 0.3rem; margin-bottom: 0.2rem; background-color: #ffffff; box-sizing: border-box; }
    .ship-item .list-title { align-items: center; }
    .ship-item img { width: 0.56rem; height: 0.56rem; }
    .ship-item p { line-height: 0.56rem; margin-left: 0.2rem; }
    .ship-item .list-title i,
    .ship-item .list-title span { line-height: 0.56rem; }
    .ship-item .list-title span { font-size: 0.24rem; color: #999999; }
    .ship-item .list-title .ship-icons img { margin-left: 0.1rem; }
    .ship-item h1 { line-height: 0.3rem; font-size: 0.26rem; }
    .ship-item .ship-date { font-size: 0.22rem; color: #999999; }
    .ship-item h1,
    .ship-item .ship-date { margin-top: 0.3rem; }
    .ship-item .ship-info { margin-top: 0.15rem; }
    .ship-item .ship-info > div { line-height: 0.55rem; }
    .ship-item .ship-info label { min-width: 0.8rem; color: #666666; }
  }
}
</style>