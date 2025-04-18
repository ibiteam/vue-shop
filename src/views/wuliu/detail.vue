<template>
  <div class="ship-ordinary">
    <commonHeader :title="title"></commonHeader>
    <div id="container"></div>
    <van-popup v-model:show="show_wuliu" class="wuliu-box" round position="bottom" :overlay="false">
      <div class="wuliu-head s-flex ai-ct jc-bt">
        <div class="s-flex ai-ct">
          <img class="wuliu-head-icon" src="@/assets/images/order/wuliu/car_icon.png" alt="">
          <div class="ML20 fs24 co-333">{{ shipData.ship_company_name }}: {{ shipData.ship_no }}</div>
        </div>
        <div class="co-333 fs24 copys" :data-clipboard-text="copyText" @click="copy">复制</div>
      </div>
      <div class="wuliu-step" v-if="shipData.ship_list && shipData.ship_list.length > 0">
        <template v-for="(item,index) in shipData.ship_list" :key="index">
          <div class="wuliu-model" v-if="(show_all_wuliu && index > 0) || index == 0">
            <div class="wuliu-title" v-if="item.status">{{ item.status }}</div>
            <div class="wuliu-desc">{{ item.context }}</div>
            <div class="wuliu-time">{{ item.time }}</div>
            <div class="step-icon" :class="index > 0?'step-icon-grey':''" v-if="item.status">
              <img src="@/assets/images/order/wuliu/car-white.png" alt="">
            </div>
          </div>
        </template>
        <div class="wuliu-model wuliu-collapse-model">
          <div class="wuliu-collapse s-flex ai-ct" @click="show_all_wuliu = !show_all_wuliu">
            <div>{{ show_all_wuliu?'收起':'展开' }}</div>
            <img v-if="show_all_wuliu" src="@/assets/images/order/wuliu/close.png" alt="">
            <img v-else src="@/assets/images/order/wuliu/open.png" alt="">
          </div>
          <div class="step-circle"></div>
        </div>
      </div>
      <div class="wuliu-step" v-else>
        暂无物流信息！
      </div>
      <div class="wuliu-address s-flex ai-ct">
        <div class="wuliu-address-icon">收</div>
        <div class="wuliu-address-info">{{ shipData.address?shipData.address:'--' }}</div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import Clipboard from "clipboard"
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
import {wuliuDetailAxios} from "@/api/order.js";

const title = ref('物流轨迹')
const show_wuliu = ref(false)
const show_all_wuliu = ref(false)
const copyText = ref('')
const info = ref({
  delivery_no:null
})
const shipData = ref({})
const start_lng_lat = ref(null)
const end_lng_lat = ref(null)
const current_lng_lat = ref(null)
const opts = ref({
  waypoints: []
})
const map = ref(null)
const driving = ref(null)
const startMarker = ref(null)
const endMarker = ref(null)
const carMarker = ref(null)
const routeLine = ref(null)

onMounted(()=>{
  initAmap()
  if (route.query.delivery_no) {
    info.value.delivery_no = route.query.delivery_no
  }
})

const initAmap = () =>{
  AMapLoader.load({
    "key": "53dc73251a8b67316fad3f0cc11b77d9",              // 申请好的Web端开发者Key，首次调用 load 时必填
    "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    "AMapUI": {             // 是否加载 AMapUI，缺省不加载
      "version": '1.1',   // AMapUI 缺省 1.1
      "plugins":[],       // 需要加载的 AMapUI ui插件
    },
    "Loca":{                // 是否加载 Loca， 缺省不加载
      "version": '1.3.2'  // Loca 版本，缺省 1.3.2
    },
  }).then((AMap)=>{
    map.value = new AMap.Map('container', {
      zoom: 5
    })
    AMap.plugin('AMap.Driving', function() {
      driving.value = new AMap.Driving({
        // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
        policy: AMap.DrivingPolicy.LEAST_TIME
      })
      getPageData()
    })
  }).catch(e => {
    console.log(e);
  })
}

const getPageData = () =>{
  wuliuDetailAxios(info.value).then(res => {
    if (cns.$constant.isSuccessCode(res)) {
      shipData.value = res.data
      copyText.value = res.data.ship_no
      show_wuliu.value = true
      start_lng_lat.value = res.data.start_lng_lat.split(',')
      end_lng_lat.value = res.data.end_lng_lat?res.data.end_lng_lat.split(','):res.data.area_lng_list[res.data.area_lng_list.length - 1].split(',')
      current_lng_lat.value = res.data.current_lng_lat?res.data.current_lng_lat.split(','):''
      res.data.area_lng_list.forEach((item) => {
        opts.value.waypoints.push(item.split(','))
      })
      driving.value.search(start_lng_lat.value, end_lng_lat.value,opts.value, function (status, result) {
        console.log(status,result)
        // 未出错时，result即是对应的路线规划方案
        drawRoute(result.routes[0])
      })
    } else if (cns.$constant.isUnLoginCode(res)) {
      cns.appRoute('login')
    }else {
      cns.$toast(res.message)
    }
  })
}

const drawRoute = (route,type) =>{
  var path = parseRouteToPath(route,type)
  startMarker.value = new AMap.Marker({
    position: path[0],
    map: map.value,
    anchor: 'center',
    offset:new AMap.Pixel(0,0),
    content:'<div class="icon-box">' +
        '<div class="icon-info">' +
        '<div>发</div><div>' + shipData.value.start_area + '</div>' +
        '</div>' +
        '<img class="start-icon" src="@/assets/images/order/wuliu/start_station.png" alt="">' +
        '</div>'
  })
  endMarker.value = new AMap.Marker({
    position: path[path.length - 1],
    map: map.value,
    anchor: 'center',
    offset:new AMap.Pixel(0,0),
    content:'<div class="icon-box icon-box-end">' +
        '<div class="icon-info">' +
        '<div>收</div><div>' + shipData.value.end_area + '</div>' +
        '</div>' +
        '<img class="start-icon" src="@/assets/images/order/wuliu/start_station.png" alt="">' +
        '</div>'
  })
  if (current_lng_lat.value){
    carMarker.value =  new AMap.Marker({
      position: current_lng_lat.value,
      map: map.value,
      anchor: 'center',
      offset:new AMap.Pixel(0,0),
      content:'<div class="car-box">' +
          '<div class="car-info">' +
          '<div>' + shipData.value.current_status + '</div>' +
          '<div>当前在' + shipData.value.current_area + '</div>' +
          '</div>' +
          '<img class="car-icon" src="@/assets/images/order/wuliu/car.png" alt="">' +
          '</div>'
    })
  }

  routeLine.value = new AMap.Polyline({
    path: path,
    strokeWeight: 5,
    strokeColor: '#FF8416',
    lineJoin: 'round'
  })
  routeLine.value.setMap(map.value)
  // 调整视野达到最佳显示区域
  map.value.setFitView([ startMarker.value, endMarker.value, routeLine.value],false,[20, 280, 20, 20])
}

const parseRouteToPath = (route) =>{
  var path = []
  for (var i = 0, l = route.steps.length; i < l; i++) {
    var step = route.steps[i]
    for (var j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j])
    }
  }
  return path
}

const copy = () =>{
  var clipboard = new Clipboard('.copys')
  clipboard.on('success', () => {
    cns.$toast('复制成功!')
  })
  clipboard.on('error', () => {
    cns.$toast('复制失败!')
  })
}

</script>

<style lang="scss" scoped>
.ship-ordinary {
  #container {
    width:100%;
    height: calc(100vh - 46px);
  }
  :deep(.icon-box){
    position: relative;
    .icon-info{
      position: absolute;
      background: #ffffff;
      display: flex;
      width: 1.68rem;
      height: 0.61rem;
      left: -0.75rem;
      bottom: 0.44rem;
      border-radius: 0.1rem;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      >div:nth-child(1){
        font-size: 0.22rem;
        border-radius: 0.1rem 0 0.2rem 0.1rem;
        background: rgba(249, 36, 35, 0.1);
        color: #F92423;
        width: 0.61rem;
        height: 0.61rem;
        text-align: center;
        line-height: 0.61rem;
      }
      >div:nth-child(2){
        flex: 1;
        font-size: 0.22rem;
        height: 0.61rem;
        text-align: center;
        line-height: 0.61rem;
        color: #333333;
        font-weight: 500;
      }
      &::after{
        content: "";
        height: 0;
        width: 0;
        position: absolute;
        left: 50%;
        bottom: -0.32rem;
        border: 0.16rem solid transparent;
        border-top: 0.16rem solid #ffffff;
        margin-left: -0.16rem;
      }
    }
    .start-icon{
      width: 0.19rem;
      height: 0.22rem;
    }
  }
  :deep(.icon-box.icon-box-end) {
    .icon-info{
      >div:nth-child(1){
        background: #F92423;
        color: #ffffff;
      }
    }
  }
  :deep(.car-box){
    position: relative;
    .car-info{
      position: absolute;
      background: #ffffff;
      width: 2.06rem;
      height: 1.07rem;
      left: -0.85rem;
      bottom: 0.7rem;
      border-radius: 0.1rem;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      >div:nth-child(1){
        color: #F92423;
        font-size: 0.28rem;
        font-weight: 500;
        line-height: 0.3rem;
        margin: 0.19rem 0 0.18rem 0.2rem;
      }
      >div:nth-child(2){
        color: #333333;
        font-size: 0.24rem;
        margin-left: 0.2rem;
        font-weight: 500;
      }
      &::after{
        content: "";
        height: 0;
        width: 0;
        position: absolute;
        left: 50%;
        bottom: -0.32rem;
        border: 0.16rem solid transparent;
        border-top: 0.16rem solid #ffffff;
        margin-left: -0.16rem;
      }
    }
    .car-icon{
      width: 0.72rem;
      height: 0.43rem;
    }
  }
  .wuliu-box{
    left: 0.1rem;
    right: 0.1rem;
    width: 7.3rem;
    .wuliu-head{
      padding: 0.18rem 0.2rem 0.3rem;
      border-bottom: 1px solid #EEEEEE;
      .wuliu-head-icon{
        width: 0.5rem;
        height: 0.5rem;
      }
    }
    .wuliu-step{
      padding: 0.3rem 0.16rem 0.3rem 0.45rem;
      border-bottom: 1px solid #EEEEEE;
      max-height: 7.08rem;
      overflow-y: auto;
      .wuliu-model{
        padding-left: 0.45rem;
        padding-bottom: 0.4rem;
        position: relative;
        .wuliu-title{
          font-size: 0.32rem;
          color: #333333;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }
        .wuliu-title-grey{
          color: #999999;
        }
        .wuliu-desc{
          font-size: 0.26rem;
          color: #666666;
          margin-bottom: 0.2rem;
        }
        .wuliu-time{
          font-size: 0.24rem;
          color: #999999;
        }
        .step-icon{
          position: absolute;
          width: 0.34rem;
          height: 0.34rem;
          border-radius: 50%;
          background: #F92423;
          top: 0.04rem;
          left: -0.17rem;
          display: flex;
          justify-content: center;
          align-items: center;
          img{
            width: 0.21rem;
            height: 0.17rem;
          }
        }
        .step-icon.step-icon-grey{
          background: #BBBBBB;
        }
        .step-circle{
          position: absolute;
          width: 0.16rem;
          height: 0.16rem;
          border-radius: 50%;
          background: #E5E5E5;
          top: 0.08rem;
          left: -0.08rem;
        }
        .wuliu-collapse{
          div{
            font-size: 0.24rem;
            color: #333333;
          }
          img{
            width: 0.22rem;
            height: 0.13rem;
            margin-left: 0.2rem;
          }
        }
      }
      >.wuliu-model:last-child{
        padding-bottom: 0;
      }
      .wuliu-model:before{
        content: "";
        position: absolute;
        left: 0;
        top: 0.04rem;
        width: 1px;
        height: 100%;
        background-color:#E5E5E5
      }
      .wuliu-collapse-model:before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 1px;
        height: 50%;
        background-color:#E5E5E5
      }
    }
    .wuliu-address{
      padding: 0.3rem 0.2rem 0.37rem 0.2rem;
      .wuliu-address-icon{
        width: 0.51rem;
        height: 0.51rem;
        text-align: center;
        line-height: 0.52rem;
        border-radius: 50%;
        border: 1px solid #BBBBBB;
        font-size: 0.24rem;
        color: #666666;
      }
      .wuliu-address-info{
        flex: 1;
        margin-left: 0.2rem;
        color: #333333;
        font-weight: 600;
        font-size: 0.28rem;
        line-height: 0.36rem;
      }
    }
  }
}
</style>