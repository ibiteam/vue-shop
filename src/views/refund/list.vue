<template>
    <div class="myorder">
        <common-header :title="title"></common-header>
        <div class="integral-search">
            <van-search v-model="info.keywords" @search="searchkeywords" @cancel="onCancel" @focus="search_old = info.keywords" placeholder="搜索商品名称/退款编号">
                <template #left-icon>
                    <van-icon name="search" size="18"/>
                </template>
            </van-search>
        </div>
        <div class="order-list">
            <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    :finished-text="orderListData.length<=10?'':'没有更多订单了~'"
                    @load="getData"
                    offset="0"
            >
                <div class="order-item" v-for="(item,index) in orderListData" :key="index">
                    <div class="order-info s-flex jc-bt act-border">
                        <div class="fs22 co-333">退款编号：{{item.flow_sn}}</div>
                        <div class="fs22 co-333">{{item.created_at}}</div>
                    </div>
                    <!--商品-->
                    <div class="goods-wrap">
                        <div class="goods-box MT20" @click="appRoute('refundDetail', { apply_refund_id: item.id })">
                            <div class="img_box"><img :src="item.goods_image" alt=""></div>
                            <div class="left s-flex flex-dir jc-bt">
                                <div>
                                    <div class="top">{{item.goods_name}}</div>
                                    <div class="MT20">
                                        <span style="font-size: 0.22rem;color: #ccc;margin-right: 0.2rem" v-for="ite in item.goods_sku_value">{{ ite.key }}：{{ ite.value }}</span>
                                    </div>
                                </div>
                                <div class="refund-price fs22"><span class="refund">退款：</span><span class="price">￥{{ item.money }}</span></div>
                            </div>
                        </div>
                    </div>
                    <!-- 订单状态 -->
                    <div class="status_refund">
                        <div style="display: flex;justify-content: center;" v-if="item.status==0">
                            <div style="color:#F71111;font-weight: 600;">待卖家处理</div>
                            <template v-if="item.status==0&&item.seller_deal_end_time-item.now_time>0">
                                <div >&nbsp;&nbsp;&nbsp;卖家将在&nbsp;&nbsp;</div>
                                <div style="color:#F71111;display: flex;align-items: center;font-weight: 600;"><van-count-down  :time="(item.seller_deal_end_time-item.now_time)*1000" format="DD天HH时mm分ss秒" @finish="getData()"/></div>
                                <div>&nbsp;&nbsp;内处理</div>
                            </template>
                        </div>
                        <span style="color: #F71111;font-weight: 600;" v-if="item.status==1">卖家已拒绝退款</span>
                        <span style="color: #333333;font-weight: 600;" v-if="item.status==2">待买家发货</span>
                        <span style="color: #333333;font-weight: 600;" v-if="item.status==3">待卖家收货</span>
                        <span style="color: #333333;font-weight: 600;" v-if="item.status==4">退款中</span>
                        <div v-if="item.status==5">
                            <span style="color: #F71111;font-weight: 600;">退款成功&nbsp;&nbsp;&nbsp;</span><span>退款金额：</span><span style="color: #F71111;font-weight: 600;">￥{{ item.money }}</span>
                        </div>
                        <span style="color: #333333;font-weight: 600;" v-if="item.status==6">退款已关闭</span>
                    </div>
                    <!--订单操作-->
                    <div class="total_box">
                        <div class="operate">
                            <div @click="appRoute('refundDetail', { apply_refund_id: item.id })">查看详情</div>
                        </div>
                    </div>
                </div>
            </van-list>
            <!--没有数据-->
            <div class="noData" v-if="noData">
                <img class="noImg" src="@/assets/images/nodata.png"/>
                <div class="noTex">暂无数据！</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import {refundListAxios} from "@/api/refund.js";
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const title = ref('退款/售后')
const info = ref({
    page: 1,
    keywords: '',
    number:10
})
const orderListData =ref([])
const noData = ref(false)
const loading = ref(false)
const finished = ref(false)


onMounted( () => {
    getData()
})

const getData = () =>{
    refundListAxios(info.value).then((res) => {
        if (cns.$constant.isSuccessCode(res)) {
            if (info.value.page == 1){
                orderListData.value = res.data.list
            }else{
                orderListData.value.push(...res.data.list)
            }
            orderListData.value.forEach(item => {
                item.show_more_goods = false
                item.showPopover = false
            })
            if (res.data.meta.total == 0){
                noData.value = true
            }else{
                noData.value = false
            }
            if (res.data.meta.current_page * res.data.meta.per_page > res.data.meta.total){
                loading.value = false
                finished.value = true
            }else{
                info.value.page++
            }
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    });
}
const searchkeywords = () =>{
    if(info.value.keywords){
        loading.value = false
        finished.value = false
        info.value.page = 1
        orderListData.value=[]
        getData()
    }
}

const onCancel = () =>{
    info.value.page = 1
    orderListData.value=[]
    getData()
}
</script>

<style scoped lang="scss">
.status_refund{
    height: 1rem;
    background: #F8F8F8;
    border-radius: 0.1rem;
    text-align: center;
    line-height: 1rem;
    margin: 0.2rem 0.2rem 0;
}
body {
    background-color: #f4f4fa;
}
/*搜索*/
.integral-search {
    padding: 0.2rem 0.2rem 0;
}
.integral-search .van-search {
    padding: 0;
    background: #ffffff;
    border-radius:0.4rem;


}
:deep(.van-search__content) {
    background: #ffffff;
    border-radius: 0.5rem;
}
:deep(.van-cell) {
    height: 35px;
    align-items: center;
}

:deep(.van-field__left-icon) {
    margin-right: 8px;
}
:deep(.van-search__action){
    color: #666666;
    padding: 0 0.3rem 0 0.1rem;
}
/** 订单列表样式设置 **/
.order-list{
    box-sizing:border-box;
    width:100%;
    padding: 0 0.2rem 0.4rem;
}
.order-list .order-item {
    margin-top: 0.2rem;
    background-color:#fff;
    border-radius: 20px;
}
.order-list .order-info {
    padding: 0 0.2rem;
    height: 0.8rem;
    align-items: center;
}
.order-list .act-border {
    border-bottom: 0.02rem solid #F2F2F2;
}
.order-list .goods-wrap .goods-box .left .goods_attr {
    padding: 0.15rem 0;
    font-size: 0.22rem;
    color: #999999;
}
.order-list .goods-wrap{
    margin:0 0.2rem;
}
.order-list .goods-wrap .goods-box{
    width:100%;
    height:1.6rem;
    display:flex;
    box-sizing:border-box;
}
.goods-box:not(:first-child) {
    margin-top: 0.3rem;
}
.order-list .goods-wrap .goods-box .img_box{
    width:1.6rem;
    height:1.6rem;
    vertical-align:middle;
    flex-shrink:0;
    box-shadow: 0 4px 21px 0 rgba(233, 233, 233, 0.55);
}
.order-list .goods-wrap .goods-box .img_box img{
    width:100%;
    height:100%;
    vertical-align:middle;
    border-radius: 10px;
}
.order-list .goods-wrap .goods-box .left{
    flex-shrink:1;
    flex-grow:1;
    margin-left:0.2rem;
    height: 1.6rem;
    width: 4.8rem;
}
.order-list .goods-wrap .goods-box .left .top{
    font-size:0.22rem;
    color:#333;
    width:100%;
    max-height: 1rem;
    max-height: 0.64rem;
    line-height: 0.32rem;
    overflow:hidden;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient: vertical;
}
.order-list .goods-wrap .goods-box .left .bottom{
    display:flex;
    justify-content:space-between;
    height:0.22rem;
    line-height:0.22rem;
    margin-top:0.32rem;
}
.order-list .goods-wrap .goods-box .left .bottom .price{
    font-size:0.28rem;
    color:#F61D4A;
}
.order-list .goods-wrap .goods-box .left .bottom .number{
    font-size:0.26rem;
    color:#999;
}
.goods-box .img_box:last-child {
    margin-right: 0;
}
.refund-price{
    line-height: 0.3rem;
    .refund{
        color: #777777 ;
    }
    .price{
        font-weight: 600;
    }
}

.order-list .total_box{
    width:100%;
    box-sizing:border-box;
    padding: 0.3rem 0 0rem 0;

}
.order-list .total_box .statistics{
    display:flex;
    justify-content:flex-end;
    height:0.55rem;
    line-height:0.55rem;
    padding-bottom: 0.2rem;
    margin: 0 .2rem;
    border-bottom: 1px solid #F2F2F2;
}
/* 倒计时 */
:deep(.van-count-down){
    font-weight: 600;
    color: #F71111;
    font-size: 0.26rem;
}

.order-list .total_box .operate{
    display:flex;
    justify-content:flex-end;
    align-items:center;
    height:1.16rem;
    line-height:1.16rem;
    margin: 0 .2rem;
    border-top: 1px solid #F2F2F2;
}
.order-list .total_box .statistics span{
    display:inline-block;
    font-size:0.24rem;
}
.order-list .total_box .operate div{
    height:0.56rem;
    line-height:0.56rem;
    width:1.5rem;
    border: 1px solid #333333;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    -ms-border-radius:5px;
    -o-border-radius:5px;
    border-radius:26px;
    text-align:center;
    margin-left:0.2rem;
    font-size:0.24rem;
    color:#333;
}
.order-list .total_box .statistics .total_num{
    color:#999;
    margin-left: 0.17rem;
}
.order-list .total_box .statistics .total{
    color:#333;
    margin-left: 0.17rem;
}
.order-list .total_box .statistics .total_price{
    color:#f61d4a;
}

.noData {
    margin-top: 2.3rem;
}

:deep(.van-list) {
    border: 1px solid transparent;
}
</style>
