<template>
    <div class="order-wrap">
        <!--搜索历史-->
        <div class="home-history">
            <van-popup v-model:show="showOrderHis" position="static" :style="{ height: '100%', paddingTop: '0px' }"
                       style="width: 100%; top: 0; bottom: 0; left: 0; right: 0;" :duration="0.1">
                <div class="search-history-header s-flex ai-ct" ref="historyHeader">
                    <van-icon name="arrow-left" size="18" @click="showOrderHis = false"/>
                    <van-search
                            v-model="his_keyword"
                            placeholder="搜索商品名称/订单编号"
                            left-icon="search"
                            autofocus
                            ref="searchInput"
                            @search="handleSearchConfirm"
                    >
                        <template #left-icon>
                            <van-icon name="search" size="18"/>
                        </template>
                    </van-search>
                    <div class="search-btn" @click="handleSearchConfirm">搜索</div>
                </div>
                <!--搜索历史列表-->
                <div class="search-history-keywords" v-if="search_keywords_list && search_keywords_list.length">
                    <div class="title s-flex" ref="keywordTitle">
                        <label class="flex-1">搜索历史</label>
                        <em class="iconfont icon-shanchu" @click="handleClickClearKeywords"></em>
                    </div>
                    <div class="keywords-list s-flex" ref="keywordBox">
                        <div class="keywords-item van-ellipsis"
                             v-for="(item, index) in search_keywords_list"
                             :key="index"
                             ref="keywordItem"
                             style="margin: 10px 10px 0 0;"
                             @click="handleSearchConfirm(item)">
                            <template v-if="item">{{item}}</template>
                        </div>
                        <div class="history-more keywords-item van-ellipsis"
                             v-if="is_show_list_more"
                             :class="{ 'history-more-noright': !is_open_list }"
                             @click="handleClickShowMoreKeywords"
                        >
                            <em class="iconfont" :class="is_open_list ? 'icon-xiala' : 'icon-to_down'" style="font-size: 0.40rem;"></em>
                        </div>
                    </div>
                </div>
            </van-popup>
        </div>
        <van-sticky>
            <div class="search-history-header s-flex ai-ct" ref="historyHeader">
                <van-icon name="arrow-left" size="18" @click="handleClickRouterBack"/>
                <div class="search-box s-flex ai-ct" @click="hisSearch">
                    <van-icon name="search" size="18"/>
                    <div>{{orderInfo.keywords?orderInfo.keywords:'搜索商品名称/订单编号'}}</div>
                </div>
                <div class="search-btn" @click="search">搜索</div>
            </div>
        </van-sticky>
        <div class="order-content">
            <template v-if="!noData">
                <van-list
                        v-model:loading="loading"
                        :finished="finished"
                        :finished-text="orderListData.length > 10?'没有更多订单了~':''"
                        @load="getOrderData"
                        offset="0"
                >
                    <div class="order-list" v-if="!order_load">
                        <div class="order-item" v-for="(item,index) in orderListData" :key="index" @click="appRoute('orderDetail',{order_sn:item.order_sn})">
                            <!--订单头部-->
                            <div class="order-info s-flex jc-bt">
                                <div class="fs24 co-666">订单号：{{ item.order_sn }}</div>
                                <div class="order-type" :class="item.status == 2 || item.status == 6?'order-type-grey':''">{{ orderStatus(item.status) }}</div>
                            </div>
                            <div class="order-main">
                                <!--商品-->
                                <div class="good-box" v-if="item.items && item.items.length>0">
                                    <template v-for="(childItem,childIndex) in item.items">
                                        <div class="good-model s-flex jc-bt" v-if="(item.show_more_goods && childIndex > 2) || childIndex < 3">
                                            <div class="good-model-left flex-1 s-flex">
                                                <van-image :src="childItem.goods_image" class="good-img">
                                                    <template v-slot:loading>
                                                        <img src="https://cdn.toodudu.com/uploads/2021/02/20/app_nopic.png" alt="" class="re-img">
                                                    </template>
                                                    <template v-slot:error>
                                                        <img src="https://cdn.toodudu.com/uploads/2021/02/20/app_nopic.png" alt="" class="re-img">
                                                    </template>
                                                </van-image>
                                                <div class="ML20 flex-1" style="max-width: 3.1rem">
                                                    <div class="fs28 co-333 fw-b elli-2">{{ childItem.goods_name }}</div>
                                                    <div class="fs24 co-666 MT20 word-b" v-if="childItem.sku_value">{{ childItem.sku_value }}</div>
                                                </div>
                                            </div>
                                            <div class="good-model-right">
                                                <form-price :need_DF="true" :price="childItem.goods_price" sign_size="24" INT_size="32" DF_size="24" weight="600" color="#333"></form-price>
                                                <div class="MT20 co-666">X{{ childItem.number }}{{ childItem.goods_unit }}</div>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="good-more s-flex" v-if="item.items.length>3 && !item.show_more_goods" @click.stop="showMoreGoods(index)">
                                        <span>查看剩余{{ item.items.length - 3 }}个商品</span>
                                        <em class="iconfont" style="margin-left: 0.07rem">&#xe604;</em>
                                    </div>
                                </div>
                              <!--物流模块-->
                              <div class="wuliu-box s-flex jc-bt ai-ct" v-if="item.logistics" @click.stop="toWuliu(item)">
                                <div class="s-flex ai-ct flex-1">
                                  <img class="wuliu-icon" src="https://cdn.toodudu.com/uploads/2023/10/24/order_wuliu.png" alt="">
                                  <div class="wuliu-type">{{ item.logistics.title }}</div>
                                  <div class="wuliu-desc flex-1">{{ item.logistics.description }}</div>
                                </div>
                                <em class="iconfont">&#xe60b;</em>
                              </div>
                                <!--评价模块-->
                                <div class="evaluate-box s-flex jc-bt ai-ct" v-if="item.evaluate">
                                    <div class="fs28 co-333 fw-b">商品好不好，评价一下</div>
                                    <div class="s-flex ai-ct jc-fe flex-1">
                                        <van-rate v-model="item.evaluate.default_value" size="13" color="#F54631" @change="changeRate(item)"/>
                                        <div class="ML20 evaluate-desc" v-if="item.evaluate.default_value == 1">非常不满意</div>
                                        <div class="ML20 evaluate-desc" v-else-if="item.evaluate.default_value == 2">不满意</div>
                                        <div class="ML20 evaluate-desc" v-else-if="item.evaluate.default_value == 3">一般</div>
                                        <div class="ML20 evaluate-desc" v-else-if="item.evaluate.default_value == 4">满意</div>
                                        <div class="ML20 evaluate-desc" v-else-if="item.evaluate.default_value == 5">非常满意</div>
                                        <div class="ML20 evaluate-desc" v-else></div>
                                    </div>
                                </div>
                                <!--订单价格-->
                                <div class="price-box fs28 co_3D s-flex jc-fe fw-b" v-else>
                                    应付<form-price :need_DF="true" :price="item.order_amount" sign_size="28" INT_size="40" DF_size="28" weight="600" color="#333" class="ML10"></form-price>
                                </div>
                                <!--操作模块-->
                                <div class="btn-box s-flex jc-fe ai-ct" v-if="item.buttons && item.buttons.length > 0">
                                    <van-popover v-model="item.showPopover" trigger="click" placement="top" :offset="[0,5]" v-if="item.buttons.length > 3">
                                        <div class="btn-more-model" v-for="(btnChild,btnIndex) in item.buttons.slice(0,item.buttons.length - 3)" :key="btnIndex" @click.stop="btnOperate(item,index,btnChild,btnIndex)">{{ btnChild.text }}</div>
                                        <template #reference>
                                            <div class="btn-more">更多</div>
                                        </template>
                                    </van-popover>
                                    <div class="btn-model" v-for="(btnChild,btnIndex) in item.buttons.slice(-3)" :key="btnIndex" :class="((btnIndex == item.buttons.slice(-3).length - 1) && (btnChild.action == 'pay' || btnChild.action == 'receive' || btnChild.action == 'again'))?'btn-model-red':''" @click.stop="btnOperate(item,index,btnChild,btnIndex)">{{ btnChild.text }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-fff" v-else style="border-radius: 0.2rem;margin: 0.2rem 0 0;padding: 0.2rem" v-for="item in 5" :key="item">
                        <div class="s-flex jc-bt">
                            <div style="width: 30%;height: 0.5rem;background: #f8f8f8"></div>
                            <div style="width: 15%;height: 0.5rem;background: #f8f8f8"></div>
                        </div>
                        <div class="s-flex MT40">
                            <div style="width: 1.78rem;height: 1.78rem;background: #f8f8f8"></div>
                            <div class="flex-1 ML20">
                                <div style="width: 100%;height: 0.5rem;background: #f8f8f8"></div>
                                <div class="MT20" style="width: 50%;height: 0.5rem;background: #f8f8f8"></div>
                            </div>
                        </div>
                        <div class="s-flex jc-fe MT20">
                            <div class="ML20" style="width: 25%;height: 0.5rem;background: #f8f8f8"></div>
                            <div class="ML20" style="width: 25%;height: 0.5rem;background: #f8f8f8"></div>
                        </div>
                    </div>
                </van-list>
            </template>
            <!--没有数据-->
            <div class="noData" v-if="noData">
                <img class="noImg" src="@/assets/images/order/no_order.png"/>
                <div class="noTex">您还没有相关订单</div>
                <div class="noDesc">可以去看看有哪些想买的</div>
            </div>
        </div>
        <!-- 修改地址弹窗 -->
        <div class="order-address">
            <van-popup class="order-address-pop" v-model:show="orderAddressShow" round position="bottom" :style="{ height: '85%' }" @close="handleClickAddressClose">
                <div class="order-address-content" :style="{ overflow: !addressSource ? 'hidden' : ''}">
                    <div class="order-address-fixed" ref="orderAddressFixed">
                        <div class="order-address-title s-flex ai-ct jc-bt">
                            <p>选择要修改的地址</p>
                            <div class="close s-flex ai-ct jc-ct" @click="handleClickAddressClose">
                                <em class="iconfont">&#xea13;</em>
                            </div>
                        </div>
                        <div class="order-address-warning">
                            <em class="iconfont">&#xe710;</em>
                            地址仅支持修改一次，修改后会影响物流时效，若因商品换仓， 已发货、运费变更等原因导致修改失败，请您谅解。
                        </div>
                        <dl class="order-address-source" v-if="originalAddress">
                            <dt>原收货地址：</dt>
                            <dd><span>{{ originalAddress.consignee }}</span><span>{{ originalAddress.phone }}</span></dd>
                            <dd>{{ originalAddress.province_name }} {{ originalAddress.city_name }} {{ originalAddress.district_name }} {{ originalAddress.address }}</dd>
                        </dl>
                        <div class="order-address-list__title s-flex jc-bt">
                            <p>选择新的收货地址</p>
                            <router-link to="/address/0" class="order-address-add">
                                <em class="iconfont">&#xe70f;</em>
                                <span>添加新地址</span>
                            </router-link>
                        </div>
                    </div>
                    <div class="order-address-list" ref="orderAddressList">
                        <template v-if="addressNoData">
                            <div class="order-address-dd s-flex ai-ct" v-for="(address, key) in addressList" :key="key" :class="{ active: addressIndex == key }" @click="handleClickAddressItem(address, key)">
                                <em class="iconfont check">{{ addressIndex == key ? '&#xe6ea;' : '&#xe7c9;' }}</em>
                                <div class="order-address-detail">
                                    <div class="s-flex"><span>{{ address.consignee }}</span> <span>{{ address.phone }}</span> <em class="tag s-flex ai-ct" v-if="address.is_default == 1">默认</em></div>
                                    <p>{{ address.province }} {{ address.city }} {{ address.district }} {{ address.address_detail }}</p>
                                </div>
                            </div>
                        </template>
                        <div class="is-nodata" v-if="!addressNoData">
                            <img src="@/assets/images/address/nodata.png" alt="">
                            <p>暂无收货地址</p>
                        </div>
                    </div>
                    <div class="order-address-btn" ref="orderAddressBtn" :class="{ disabled: (!addressNoData || addressIndex == null) }">
                        <p @click="handleClickAddressClose('sure')">确定</p>
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import {
    cancelOrderAxios,
    confirmOrderAxios,
    deleteOrderAxios, editOrderAddressAxios,
    getOrderList,
    updateOrderAddressAxios
} from "@/api/order.js";
import {getAddress} from "@/api/address.js";
import {refundVerifyAxios} from "@/api/order.js";
const route = useRoute()
const router = useRouter()
const cns = getCurrentInstance().appContext.config.globalProperties
const title = ref('我的订单')
const orderListData = ref([])
const orderInfo = ref({
    type: 'all',
    keywords:'',
    page: 1,
    number:10
})
const page_load = ref(true)
const order_load = ref(true)
const noData =ref(false)
const loading =ref(false)
const finished =ref(false)

const orderCheck = ref({})
const addressIndex = ref(null)
const orderAddressShow = ref(false)
const addressList = ref([])
const addressNoData =ref(false)
const originalAddress = ref({})
const addressSource = ref(null)
const orderAddressFixed = ref(null)
const orderAddressList = ref(null)
const orderAddressBtn = ref(null)

const showOrderHis = ref(false)
const his_keyword = ref('')
const search_keywords_list = ref([])
const search_keywords_all_list = ref([])
const search_keywords_over_list = ref([])
const is_show_list_more = ref(false)
const is_open_list = ref([])
const keywordItem = ref(null)
const keywordTitle = ref(null)
const historyHeader = ref(null)
const keywordBox =ref(null)


watch(route, (value) => {
    orderInfo.value.keywords = value.query.keywords ? value.query.keywords : ''
    getOrderData()
})

onMounted(() => {
    orderInfo.value.keywords = route.query.keywords ? route.query.keywords : ''
    getOrderData()
})

const getOrderData = () => {
    getOrderList(orderInfo.value).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            if (orderInfo.value.page == 1){
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
                orderInfo.value.page++
            }
            page_load.value = false
            order_load.value = false
        } else if (cns.$constant.isUnLoginCode(res)) {
            // 去登录
            cns.appRoute('login')
        }else {
            cns.$toast(res.message)
        }
    }).catch(err => {
        console.log(err)
    })
}

const resetParams = () => {
    orderInfo.value.page = 1
    order_load.value = true
    orderListData.value = []
    loading.value = false
    finished.value = false
    noData.value = false
}

const orderStatus = (status) => {
    let status_txt = ''
    if (status == 1){
        status_txt = '待确认'
    }else if (status == 2){
        status_txt = '已取消'
    }else if (status == 3){
        status_txt = '待付款'
    }else if (status == 4){
        status_txt = '待发货'
    }else if (status == 5){
        status_txt = '待收货'
    }else if (status == 6){
        status_txt = '已完成'
    }else if (status == 7){
        status_txt = '部分发货'
    }
    return status_txt
}

const showMoreGoods =(index)=>{
    orderListData.value[index].show_more_goods = true
}

const changeRate = (item) =>{
    setTimeout(() => {//1秒刷新倒计时
        cns.appRoute('orderComment',{order_sn:item.order_sn,rank:item.evaluate.default_value})
    }, 500)
}

const btnOperate = (item,index,btnChild,btnIndex) => {
    if(btnChild.action == 'cancel'){//取消订单
        cancelOrder(item)
    }else if(btnChild.action == 'delete'){//删除订单
        deleteOrder(item)
    }else if(btnChild.action == 'again'){//再次购买
        cns.appRoute('good', {goods_no: item.items[0].goods_no})
    }else if(btnChild.action == 'edit_address'){//修改地址
        handleClickEditAddress(item, index)
    }else if(btnChild.action == 'pay'){//去支付
        cns.appRoute('payIndex', {order_sn: item.order_sn})
    }else if(btnChild.action == 'refund'){//申请售后
        afterSale(item)
    }else if(btnChild.action == 'logistics'){//查看物流
        toWuliu(item)
    }else if(btnChild.action == 'receive'){//确认收货
        confirmOrder(item)
    }else if(btnChild.action == 'evaluate'){//去评价
        cns.appRoute('orderComment', {order_sn: item.order_sn})
    }
}

const toWuliu = (item) => {
  if(item.logistics_number>1){
    cns.appRoute('wuliuList', {order_sn: item.order_sn})
  }else{
    cns.appRoute('wuliuDetail', {delivery_no: item.logistics.delivery_no})
  }
}

const cancelOrder = (item) =>{//取消订单
    cns.$dialog.confirm({
        message: '确定要取消订单吗?',
        confirmButtonText: '确认取消',
    }).then(() => {
        cancelOrderAxios({order_sn:item.order_sn}).then(res => {
            if (cns.$constant.isSuccessCode(res)) {
                cns.$toast(res.message)
                resetParams()
                getOrderData()
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login')
            }else {
                cns.$toast(res.message)
            }
        }).catch(err => {
            console.log(err)
        })
    })
}

const deleteOrder = (item) =>{//删除订单
    cns.$dialog.confirm({
        message: '确定要删除订单吗?',
        confirmButtonText: '确认删除',
    }).then(() => {
        deleteOrderAxios({order_sn:item.order_sn}).then(res => {
            if (cns.$constant.isSuccessCode(res)) {
                cns.$toast(res.message)
                resetParams()
                getOrderData()
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login')
            }else {
                cns.$toast(res.message)
            }
        }).catch(err => {
            console.log(err)
        })
    })
}

const confirmOrder = (item) =>{//确认收货
    cns.$dialog.confirm({
        message: '确认收到货了吗?',
        confirmButtonText: '确认收货',
    }).then(() => {
        confirmOrderAxios({order_sn:item.order_sn}).then(res => {
            if (cns.$constant.isSuccessCode(res)) {
                cns.$toast(res.message)
                resetParams()
                getOrderData()
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login')
            }else {
                cns.$toast(res.message)
            }
        }).catch(err => {
            console.log(err)
        })
    })
}

const handleClickEditAddress = (data, index) => {
    orderCheck.value = Object.keys(data).length ? data : orderListData.value[index]
    getAddress().then(ret => {
        if (cns.$constant.isSuccessCode(ret)) {
            addressList.value = ret.data
            addressNoData.value = addressList.value.length > 0
            editOrderAddressAxios({order_sn:data.order_sn}).then(res => {
                if (cns.$constant.isSuccessCode(res)) {
                    originalAddress.value = res.data
                    orderAddressShow.value = true
                    /** 计算收货地址列表高度 **/
                    setTimeout(() => {
                        const height = document.querySelector('.order-address-pop').clientHeight
                        const setHeight = (+height) - (+orderAddressBtn.value.clientHeight) - (+orderAddressFixed.value.clientHeight) - 10
                        orderAddressList.value.setAttribute('style', `max-height: ${setHeight}px`)
                    }, 500)
                } else if (cns.$constant.isUnLoginCode(res)) {
                    cns.appRoute( 'login')
                } else {
                    cns.$toast(res.message);
                }
            })
        } else if (cns.$constant.isUnLoginCode(ret)) {
            cns.appRoute( 'login')
        } else {
            cns.$toast(ret.message);
        }
    })
}

const handleClickAddressItem = (item, index) => {
    addressIndex.value = index
}

const handleClickAddressClose = async(type) =>{
    if (type && type == 'sure') {
        if (addressIndex.value == null) { cns.$toast('请选择收货地址'); return false }
        const info = addressList.value[addressIndex.value]
        updateOrderAddressAxios({ order_sn: orderCheck.value.order_sn, user_address_id: info.id }).then(res => {
            if (cns.$constant.isSuccessCode(res)) {
                cns.$toast(res.message)
                resetParams()
                getOrderData()
                orderAddressShow.value = false
                addressIndex.value = null
                originalAddress.value = {}
            } else if (cns.$constant.isUnLoginCode(res)) {
                cns.appRoute('login')
            }else {
                cns.$toast(res.message)
            }
        })
    } else {
        orderAddressShow.value = false
        addressIndex.value = null
        originalAddress.value = {}
    }
}

const handleClickRouterBack = () =>{
    router.back()
}

const hisSearch = () =>{
    if (localStorage.getItem('orderKeywordList')) {
        search_keywords_all_list.value = search_keywords_list.value = JSON.parse(localStorage.getItem('orderKeywordList'))
    }
    /*搜索历史超出截取处理*/
    nextTick(() => {
        //  设置要截取的索引
        let index = 0
        let children = keywordItem.value
        if (!children) return false
        let boxHeight = ((children[0].clientHeight + parseInt(children[0].style.marginTop)) * 3) + keywordTitle.value.clientHeight + historyHeader.value.clientHeight
        let keyWorldBox = keywordBox.value.clientWidth
        for (let key in children) {
            if (children[key].offsetTop >= boxHeight) {
                if (key - 1) {
                    if (keyWorldBox - children[key - 1].offsetLeft - children[key - 1].clientWidth) {
                        index = (key)
                    }
                }
                break
            }
        }
        //  获取超出2行高度的第一个元素，超过2行截断数据
        if (index > 0) {
            is_show_list_more.value = true
            search_keywords_over_list.value = search_keywords_list.value = search_keywords_all_list.value.slice(0, index)
        } else {
            is_show_list_more.value = false
            search_keywords_over_list.value = search_keywords_list.value = search_keywords_all_list.value
        }
    })
    his_keyword.value =orderInfo.value.keywords
    showOrderHis.value = true
}

const handleSearchConfirm = (value) =>{
    const value_type = Object.prototype.toString.call(value).slice(8, -1)
    if (value != '' && value_type == 'String') {
        his_keyword.value = value
    }
    const query = {}
    //  判断搜索关键词，如果关键词为空，则获取占位关键词
    let list = search_keywords_list.value
    if (his_keyword.value != '') {
        query.keywords = his_keyword.value
        list.unshift(his_keyword.value)
        list = [...new Set(list)]
        search_keywords_list.value = list
        localStorage.setItem('orderKeywordList', JSON.stringify(search_keywords_list.value))
    } else {
        cns.$toast('请输入商品名称/订单编号')
        return false
    }
    showOrderHis.value = false
    cns.appRoute('orderSearch', query, 'replace')
}
const handleClickClearKeywords =()=>{
    search_keywords_list.value = [];
    localStorage.removeItem('orderKeywordList');
}

const handleClickShowMoreKeywords = () =>{
    is_open_list.value = !is_open_list.value
    search_keywords_list.value = is_open_list.value ? search_keywords_all_list.value : search_keywords_over_list.value
}
const search =()=>{
    resetParams()
    getOrderData()
}

const afterSale = (item) =>{
    refundVerifyAxios({ order_sn:item.order_sn, order_detail_id:item.items[0].id }).then(res => {
        if (cns.$constant.isSuccessCode(res)) {
            cns.appRoute('refundEntrance', {order_sn:item.order_sn, order_detail_id:item.items[0].id})
        } else if (cns.$constant.isUnLoginCode(res)) {
            cns.appRoute('login')
        } else if(res.code === 4006) {
            cns.appRoute('refundDetail', { order_sn:item.order_sn, order_detail_id:item.items[0].id })
        } else {
            cns.$toast(res.message)
        }
    })
}
</script>

<style scoped lang="scss">
.order-wrap {
    background-color: #F8F8F8;
    min-height: 100vh;
    .search-history-header { height: 1.10rem; background-color: #ffffff;box-shadow: 0px 2px 3px 0px rgba(219,219,219,0.302); }
    .search-history-header .search-back { font-size: 0.44rem; padding-left: 0.10rem; }
    .search-history-header .search-btn { width: 0.70rem; font-size: 0.28rem; line-height: 0.70rem; color: #666; font-weight: 400; }
    .search-history-header .search-box { width: calc(100% - 30px - 0.6rem);margin: 10px 12px;background: #f7f8fa;border-radius: 0.6rem;height: 0.44rem;padding: 5px 8px 5px 12px; }
    .search-history-header .search-box>div{margin-left: 0.1rem;color: #9C9C9C;}
    .search-history-header .van-search { width: calc(100% - 30px - 0.6rem); }
    .search-history-header .van-search ::v-deep .van-icon-clear,
    .search-history-header .van-search ::v-deep .van-field__left-icon { height: 0.44rem; }
    .search-history-header .van-search ::v-deep .van-icon-clear { line-height: 0.44rem; }
    .search-history-header .van-search ::v-deep .van-cell__value,
    .search-history-header .van-search ::v-deep .van-field__left-icon { display: flex; align-items: center; }
    .search-history-header .van-search ::v-deep .van-cell__value { flex: 1; }
    .search-history-header .van-search ::v-deep .van-field__body { width: 100%; }
    .search-history-header .van-search ::v-deep .van-field__left-icon { margin-right: 0.10rem; }
    .search-history-header .van-search .van-search__content { border-radius: 0.6rem; }
    .search-history-header .search-back { font-size: 0.44rem; padding-left: 0.10rem; }
    .search-history-header .search-btn { width: 0.70rem; font-size: 0.28rem; line-height: 0.70rem; color: #666; font-weight: 400; }
    /*搜索历史*/
    .search-history-keywords { padding: 0 0.30rem; }
    .search-history-keywords .title { padding-top: 0.15rem; }
    .search-history-keywords .title em,
    .search-history-keywords .title label { font-size: 0.28rem; font-weight: 600; color: #343434; position: relative; }
    .search-history-keywords .keywords-list { flex-flow: row wrap; padding: 0.10rem 0; }
    .search-history-keywords .keywords-list .keywords-item { height: 0.44rem; line-height: 0.44rem; padding: 0 0.20rem; margin-top: 10px; margin-right: 0.10rem; text-align: right; font-size: 0.20rem; color: #343434; background-color: #F2F2F2; border-radius: 0.60rem; float: left; }
    .search-history-keywords .keywords-list .history-more { padding: 0 4px !important;; margin: 10px 0.20rem 0 0; }
    .search-history-keywords .keywords-list .history-more.history-more-noright { margin-right: 0 !important; }
    .order-content {
        padding: 0 0.2rem 0.2rem;
    }
    :deep(.van-search__content){
        border-radius: 0.3rem;
    }
    :deep(.van-search__action){
        color: #9C9C9C;
    }
    .order-content {
        padding: 0 0 0.2rem;
        /** 订单列表样式设置 **/
        .order-list {
            box-sizing: border-box;
            padding: 0 0.2rem;
            width: 100%;
            .order-item {
                margin-top: 0.2rem;
                background-color: #fff;
                border-radius: 0.2rem;
                .order-info{
                    height: 0.84rem;
                    border-bottom: 1px solid #EEEEEE;
                    align-items: center;
                    padding: 0 0.3rem;
                    .order-type{
                        font-size: 0.28rem;
                        color: #F71111;
                    }
                    .order-type.order-type-grey{
                        color: #999999;
                    }
                }
                .order-main{
                    padding: 0.3rem 0.2rem;
                    .good-box{
                        .good-model{
                            margin-top: 0.4rem;
                            .good-model-left{
                                .good-img{
                                    width: 1.76rem;
                                    height: 1.76rem;
                                    border-radius: 0.2rem;
                                    overflow: hidden;
                                    border: 1px solid #eeeeee;
                                    background: #f8f8f8;
                                    img{
                                        width: 1.76rem;
                                        height: 1.76rem;
                                        border-radius: 0.2rem;
                                    }
                                }
                                .good-presell-desc{
                                    font-size: 0.26rem;
                                    color: #FF8F1F;
                                    margin-top: 0.1rem;
                                }
                            }
                            .good-model-right{
                                margin-left: 0.3rem;
                                text-align: right;
                                .gift-txt{
                                    font-size: 0.28rem;
                                    padding: 0.06rem 0.12rem;
                                    color: #333333;
                                    margin-bottom: 0.16rem;
                                }
                                .refund-desc{
                                    font-size: 0.28rem;
                                    color: #FF8F1F;
                                }
                            }
                        }
                        .good-more{
                            margin-top: 0.3rem;
                            span{
                                font-size: 0.24rem;
                                color: #666666;
                            }
                        }
                    }
                    .wuliu-box{
                        height: 0.7rem;
                        border-radius: 0.1rem;
                        background: #F8F8F8;
                        margin-top: 0.3rem;
                        padding: 0 0.2rem;
                        .wuliu-icon{
                            width: 0.28rem;
                            height: 0.21rem;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .wuliu-type{
                            font-size: 0.28rem;
                            margin-left: 0.2rem;
                            color: #333333;
                            font-weight: bold;
                        }
                        .wuliu-desc{
                            font-size: 0.26rem;
                            color: #666666;
                            margin-left: 0.1rem;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            word-break: break-all;
                            -webkit-line-clamp: 1;
                        }
                        .iconfont{
                            font-size: 0.56rem;
                            margin-left: 0.04rem;
                            color: #666666;
                        }
                    }
                    .evaluate-box{
                        height: 0.7rem;
                        border-radius: 0.1rem;
                        background: #F8F8F8;
                        margin-top: 0.3rem;
                        padding: 0 0.2rem;
                        .evaluate-desc{
                            font-size: 0.26rem;
                            color: #666666;
                            width: 1.3rem;
                            text-align: right;
                        }
                    }
                    .price-box{
                        align-items: center;
                        margin-top: 0.3rem;
                        .group-box{
                            .group-img{
                                width: 0.4rem;
                                height: 0.4rem;
                                margin-right: -0.08rem;
                                border-radius: 50%;
                                border: 1px solid #E5E5E5;
                                overflow: hidden;
                                img{
                                    width: 0.4rem;
                                    height: 0.4rem;
                                }
                            }
                        }
                    }
                    .btn-box{
                        margin-top: 0.4rem;
                        position: relative;
                        .btn-model{
                            width: 1.8rem;
                            height: 0.7rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 0.45rem;
                            border: 1px solid #CBCBCB;
                            color: #333333;
                            font-size: 0.28rem;
                            margin-left: 0.2rem;
                            box-sizing: border-box;
                        }
                        .btn-model.btn-model-red{
                            border-color: var(--red-color);
                            color: var(--red-color);
                        }
                        .van-popover__wrapper{
                            position: absolute;
                            left: 0;
                            top: 0;
                            bottom: 0;
                            width: 0.6rem;
                        }
                        .btn-more{
                            font-size: 0.28rem;
                            color: #999999;
                            line-height: 0.7rem;
                            height: 0.7rem;
                        }
                    }
                }
            }
        }
        .word-b{word-break: break-all}
    }
}
.btn-more-model{
    height: 0.9rem;
    line-height: 0.9rem;
    width: 1.83rem;
    text-align: center;
    color: #333333;
    font-size: 0.28rem;
}
:deep(.van-popover .van-popover__arrow){
    right: 1rem!important;
}
.noData{
    margin-top: 0.05rem;
    .noImg{
        width: 4rem;
        height: 4rem;
    }
    .noTex{
        margin-top: -0.5rem;
        font-size: 0.3rem;
        color: #3D3D3D;
        font-weight: bold;
    }
    .noDesc{
        margin-top: 0.2rem;
        font-size: 0.26rem;
        color: #3D3D3D;
    }
}
/*修改地址弹窗*/
.order-address .van-popup { padding: 0.16rem 0; box-sizing: border-box; }
.order-address .order-address-title { padding: 0.2rem 0; }
.order-address .order-address-title p { font-size: 0.32rem; font-weight: 600; }
.order-address .order-address-title .close { width: 0.36rem; height: 0.36rem; background-color: #F2F2F2; border-radius: 999px; }
.order-address .order-address-title em { font-size: 0.2rem; font-weight: 600; color: #999999; }
.order-address .order-address-warning { line-height: 1.5; padding: 0.1rem 0 0.3rem 0; font-size: 0.24rem; color: #FB9216; }
.order-address .order-address-warning em { vertical-align: middle; font-size: 0.32rem; }
.order-address .order-address-source { padding: 0.2rem 0.3rem; background-color: #F8F8F8; border: 1px solid #F0F0F0; border-radius: 0.1rem; }
.order-address .order-address-source dt { margin-bottom: 0.2rem; font-size: 0.26rem; font-weight: 600; }
.order-address .order-address-source dd { margin-top: 0.1rem; font-size: 0.24rem; }
.order-address .order-address-source dd:last-child { color: #666666; }
.order-address .order-address-source dd span { margin-right: .42rem; }
.order-address .order-address-fixed { /*height: 4.7rem;*/ padding: 0 0.28rem; }
.order-address .order-address-list__title { padding: 0.2rem 0; }
.order-address .order-address-list__title p { font-size: 0.26rem; color: #777777; }
.order-address .order-address-list__title em { margin-right: 0.1rem; font-size: 0.24rem; }
.order-address .order-address-list__title span { font-size: 0.26rem; }
.order-address .order-address-list__title em,
.order-address .order-address-list__title span { color: #333333; }
.order-address .order-address-list { max-height: calc(100% - 4.7rem - 1.2rem); padding: 0 0.28rem; overflow-y: auto; }
.order-address .order-address-list.no-source { max-height: calc(100% - 1.2rem); }
.order-address .order-address-list .order-address-dd { max-height: calc(100% - 0.82rem - 1.15rem - 1.7rem - 1.4rem); padding: 0.3rem 0; border-bottom: 1px solid #E0E0E0; overflow-y: auto; }
.order-address .order-address-list .order-address-dd:last-child { border-bottom: none; }
.order-address .order-address-list .order-address-dd em.check { margin-right: 0.4rem; font-size: 0.34rem; }
.order-address .order-address-list .order-address-dd.active em.check { color: #f71111; }
.order-address .order-address-list .order-address-detail span { line-height: 1.2; margin-right: 0.44rem; font-size: 0.3rem; font-weight: 600; }
.order-address .order-address-list .order-address-detail .tag { line-height: 1; padding: 0.04rem; vertical-align: middle; background-color: #F71111; border-radius: 0.05rem; font-style: normal; font-size: 0.2rem; color: #ffffff; }
.order-address .order-address-list .order-address-detail p { line-height: 1.2; margin-top: 0.2rem; font-size: 0.24rem; color: #666666; }
.order-address .order-address-btn { width: 7.5rem; height: 1.2rem; background-color: #ffffff; position: fixed; bottom: 0; left: 50%; transform: translate(-50%); box-shadow: 0 0 0.1rem 0 rgba(0,0,0,0.1); }
.order-address .order-address-btn p { width: 4rem; height: 0.88rem; line-height: 0.88rem; margin: 0.16rem auto; text-align: center; border-radius: 333px; background: linear-gradient(90deg, #FA5F5F, #F71111); font-size: 0.3rem; color: #ffffff; }
.order-address .order-address-btn.disabled p { background: #999999; }
.order-address .is-nodata img{width: 100%;height: auto;margin-top: 0.3rem}
.order-address .is-nodata p{font-size: 0.28rem;color: #333333;margin-top: 0.2rem;text-align: center;}
</style>
