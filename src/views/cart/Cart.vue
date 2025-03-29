<template>
    <div class="cart-container">
        <div class="cart-wrap">
            <!-- 购物车头部 -->
            <div class="cart-header">
                <div class="header s-flex ai-ct jc-ct" :class="is_placeholder ? 'bg-main' : (hasLogin && (shopList.length > 0 || invalid_goods.length>0) ? 'bg-main' : 'bg-fff')">
                    <em class="iconfont" v-if="hasBack" @click="router.back(-1)">&#xe605;</em>
                    <span class="cart-title fs32 co-333 flex-1">购物车</span>
                    <span class="fs26 co-333" v-if="hasLogin && (shopList.length > 0 || invalid_goods.length>0)" @click="editAll=!editAll">{{editAll? "完成" : "编辑"}}</span>
                </div>
            </div>
            <!--购物车内容-->
            <section v-if="!is_placeholder" style="margin-bottom: 0.2rem;">
                <van-pull-refresh v-model="isLoading" @refresh="getData">
                    <div v-if="hasLogin && (shopList.length > 0 || invalid_goods.length>0)" class="padding-horizontal-02">
                        <div class="bg-fff shop-box MT20 shop-box-section">
                            <!--<div class="shop-title s-flex ai-ct">-->
                            <!--    <div v-if="!item.is_check" class="no-check check-grey"></div>-->
                            <!--    <div-->
                            <!--        v-else-if="item.shop_select"-->
                            <!--        class="iconfont checkbox"-->
                            <!--        @click="chooseShop(item,shop_index)"-->
                            <!--    ></div>-->
                            <!--    <div v-else class="no-check" @click="chooseShop(item,shop_index)"></div>-->
                            <!--    <div class="s-flex flex-1 ai-ct" @click="toShop(item.seller_id)">-->
                            <!--        <em class="iconfont">&#xe646;</em>-->
                            <!--        <span class="fs24 co-333 ML20">{{item.shop_name}}</span>-->
                            <!--        <img src="@/assets/images/cart/arrow-right.png" style="height:0.16rem;" class="ML10"/>-->
                            <!--    </div>-->
                            <!--    <div class="control-box s-flex jc-ct ai-ct fs22" v-if="item.is_coupon>0" @click="getCoupon(item)">领券</div>-->
                            <!--</div>-->
                            <div class="goods-box valid-goods" v-for="(goods,index) in shopList" :key="goods.id" :class="!((goods.act_type==1 || goods.act_type==2) && goods.limit_number>0) ? 'border-sty' : '' ">
                                <!--满减-->
                                <!--<div class="s-flex fs24 ai-ct MT20 reduction" v-if="goods.act_type==6">-->
                                <!--    <span class="act-sign MR20">满减</span>-->
                                <!--    <p class="co-333">-->
                                <!--    <span class="fs22 co-333">-->
                                <!--        {{goods.increase_desc}}-->
                                <!--    </span>-->
                                <!--    </p>-->
                                <!--</div>-->

                                <van-swipe-cell>
                                    <template #right>
                                        <van-button square type="danger" class="atten" @click="toAttentionSole(goods.rec_id, shop_index, index)">移入<br>关注</van-button>
                                        <van-button square type="danger" class="right-delet btn-gradient" @click="deleteGoodSole(goods.rec_id, shop_index, index)">删除</van-button>
                                    </template>
                                    <div class="goods-list">
                                        <div class="s-flex ai-ct MT20">
                                            <div class="selectrange">
                                                <div
                                                    v-if="goods.is_check>0"
                                                    class="iconfont checkbox"
                                                    @click="chooseGoods(goods)"
                                                ></div>
                                                <div v-else class="no-check" @click="chooseGoods(goods)"></div>
                                            </div>
                                            <div class="img-box MR20" :style="{backgroundImage:'url('+ goods.goods.image +')'}" style="flex: none;"
                                                 @click="toGood(goods.goods.goods_id)"></div>
                                            <div class="goods-msg flex-1 s-flex flex-dir jc-bt">
                                                <p class="elli-2 fs22 co-333 goods-name" @click="toGood(goods.id)">{{goods.goods.name}}</p>
                                                <!--增值费 价格-->
                                                <!--<cartCost :goods_info="goods" @last_money="lastMoney($event, goods)" @unusual="getData"></cartCost>-->

                                                <div class="s-flex ai-fe jc-bt">
                                                    <!--价格 数量-->
                                                    <form-price :price="goods.goods.price" :unit="goods.goods.unit"
                                                                unit_color="#333" weight="600">
                                                    </form-price>

                                                    <van-stepper v-model="goods.buy_number" :min="1" :max="goods.goods.can_quota === 1? goods.goods.quota_number : goods.goods.total" />
                                                </div>
                                            </div>
                                        </div>
                                        <!--限购-->
                                        <!--<div class="fs22 MT20 limit-sty" v-if="(goods.act_type==1 || goods.act_type==2) && goods.limit_number>0">-->
                                        <!--    每人限购{{goods.limit_number}}{{goods.unit}}-->
                                        <!--</div>-->
                                        <!--<div class="gift-box MT20 s_flex jc_fe" v-if="goods.gift" @click="toGood(goods.gift.goods_id)">-->
                                        <!--    <div>{{ goods.gift.title }}</div>-->
                                        <!--    <div class="gift-box-line"></div>-->
                                        <!--    <div class="elli-1">{{ goods.gift.name }}</div>-->
                                        <!--    <div>x{{ goods.gift.number }}</div>-->
                                        <!--    <em class="iconfont">&#xe60b;</em>-->
                                        <!--</div>-->
                                    </div>
                                </van-swipe-cell>
                            </div>
                        </div>
                        <!--失效商品-->
                        <div class="bg-fff shop-box MT20 shop-box-section lose" v-if="invalid_goods && invalid_goods.length>0">
                            <div class="invalid-box s-flex ai-ct jc-bt">
                                <p class="fs24 co-333">失效商品 {{invalid_goods.length}} 个</p>
                                <p class="fs24" @click="clearInvalid">清空失效宝贝</p>
                            </div>
                            <div class="goods_box" v-for="(goods,index) in invalid_goods" :key="index">
                                <div class="goods-list s-flex ai-ct MT20">
                                    <div class="selectrange">
                                        <div class="invalid-sign">失效</div>
                                    </div>
                                    <div class="img-box s-flex ai-ct jc-ct MR20" :style="{backgroundImage:'url('+ goods.goods.image +')'}"
                                         @click="goods.invalid_type=='out_of_stock' || goods.invalid_type=='promote_change' ? toGood(goods.id) : ''"
                                    >
                                        <img v-if="goods.invalid_type=='out_of_stock'" class="nogood" src="@/assets/images/cart/nogood.png" alt="">
                                    </div>
                                    <div class="goods-msg flex-1 s-flex flex-dir jc-bt">
                                        <p class="elli-2 fs22 co-333 goods-name invalid-name"
                                           @click="goods.invalid_type=='out_of_stock' || goods.invalid_type=='promote_change' ? toGood(goods.goods_id) : ''">{{goods.goods.name}}</p>
                                        <!--失效原因-->
                                        <div class="fs20 co-333">
                                            {{goods.invalid_type=='is_delete' ? '该商品已不能购买,请联系商家处理哦！' : (goods.invalid_type=='out_of_stock' ? '该商品已售罄,请选购其他商品购买吧！': '该商品的促销模式已改变,请重新选购')}}
                                        </div>
                                        <div class="s-flex ai-fe jc-fe">
                                            <van-button color="#F71111" plain round v-if="goods.invalid_type=='promote_change'" @click="toGood(goods.goods_id)">重选</van-button>
                                            <van-button color="#F71111" plain round v-else-if="goods.invalid_type=='out_of_stock'" @click="findSimilar(goods.cat_id, goods.goods.name)">找相似</van-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="all-content s-flex flex-dir ai-ct jc-ct padding-horizontal-02" :class="!(hasLogin && shopList.length > 0) ? 'bg-fff' : ''">
                        <img src="@/assets/images/cart/cart_empty.png" alt="购物车是空的"/>
                        <div v-if="!hasLogin" class="aui-content s-flex jc-ct ai-ct">
                            您还没有登录
                            <div class="btn-icon btn-gradient fs26" @click="toLogin">
                                去登录
                            </div>
                        </div>
                        <div v-else class="aui-content s-flex jc-ct ai-ct">
                            购物车是空的，您可以
                            <div class="btn-icon btn-gradient fs26" @click="appRoute('home')">
                                去逛逛
                            </div>
                        </div>
                    </div>
                    <!--购物车猜你喜欢部分-->
                    <RecommendColumn :recommend="recommend"></RecommendColumn>
                </van-pull-refresh>
            </section>
            <section v-else class="loaded padding-horizontal-02">
                <div class="bg-fff MT20 shop-box" v-for="item in 2" :key="item">
                    <div>
                        <div class="shop-title s-flex ai-ct">
                            <div class="s-flex flex-1 ai-ct">
                                <span class="fs24 co-333 shop-name"></span>
                            </div>
                        </div>

                        <div class="goods-box" v-for="idx in 2" :key="idx">
                            <div class="goods-list s-flex ai-ct MT20">
                                <div class="selectrange"></div>
                                <div class="img-box MR20 bg-f2"></div>
                                <div class="goods-msg flex-1 s-flex flex-dir">
                                    <p class="elli-2 fs22 co-333 goods-name bg-f2"></p>
                                    <p class="elli-2 fs22 co-333 goods-name bg-f2 MT30"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!--结算-->
        <div class="footer-box" v-if="hasLogin && shopList.length > 0" :class="[hasBack ? 'breathe' : '']">
            <div v-if="!editAll" class="footer-content s-flex ai-ct bg-fff jc-bt" :class="[hasBack ? 'footer-act breathe' : '']">
                <div class="s-flex ai-ct">
                    <div v-if="all_isSelect(shopList)" class="no-check M20 check-grey"></div>
                    <div
                        v-else-if="selectAll"
                        class="iconfont checkbox M20"
                        @click="selectAllGoods"
                    ></div>
                    <div v-else class="no-check M20" @click="selectAllGoods"></div>
                    <span class="fs24 sele-all">全选</span>
                    <span class="ML20 fs28 co-333">合计: <span class="fs22">￥</span>{{total_price.toString().split('.')[0]}}<span class="fs22">.{{total_price.toString().split('.')[1] ? total_price.toString().split('.')[1] : '00'}}</span></span>
                </div>
                <section class="to-buy co-999 fs24 btn-gradient" @click="toBuy">去结算({{goods_count < 100 ? goods_count : '99+'}})</section>
            </div>
            <div v-else class="s-flex ai-ct bg-fff jc-bt" :class="[hasBack ? 'footer-act' : '']">
                <section class="s-flex ai-ct">
                    <div v-if="all_isSelect(shopList)" class="no-check M20 check-grey"></div>
                    <div
                        v-else-if="selectAll"
                        class="iconfont checkbox M20"
                        @click="selectAllGoods"
                    ></div>
                    <div v-else class="no-check M20" @click="selectAllGoods"></div>
                    <span class="fs24 sele-all">全选</span>
                </section>
                <section class="s-flex jc-fe ai-ct">
                    <div class="s-flex ai-ct" v-if="invalid_goods && invalid_goods.length>0">
                        <!--<i class="iconfont" style="color:#F71111">&#xe68b;</i>-->
                        <img src="@/assets/images/cart/clear.png" alt="" style="width:0.24rem;height:0.25rem;">
                        <span class="fs22 ML10" style="color: var(--red-color)" @click="clearInvalid">清空失效宝贝</span>
                    </div>
                    <div class="to-attention" @click="toAttentionMass">移入关注</div>
                    <div class="to-delete" @click="deleteGoodMass">删除</div>
                </section>
            </div>
        </div>
        <van-popup
            v-model:show="coupon_popup"
            round
            position="bottom"
            :close-on-click-overlay="false"
            :style="{ 'height': '6.8rem' }"
        >
            <div class="coupon-title flex">
                <div class="coupon-fixed">
                    <h3 class="fs32 flex-1 fw-b">优惠券</h3>
                    <img src="@/assets/images/cart/close.png" alt="" @click="coupon_popup=false">
                </div>
            </div>
            <div class="list-box">
                <div class="coupon-list" :class="[item.status ? 'coupon-act' : '']" v-for="item in coupon_list" @click="receiveCoupon(item)">
                    <div class="s-flex ai-ct">
                        <template v-if="item.status">
                            <form-price :price="item.money" color="var(--color-text)" sign_size="30" INT_size="60" DF_size="30" class="van-ellipsis" style="max-width: 3.5rem;"></form-price>
                        </template>
                        <template v-else>
                            <form-price :price="item.money" color="var(--red-color)" sign_size="30" INT_size="60" DF_size="30" class="van-ellipsis" style="max-width: 3.5rem;"></form-price>
                        </template>
                        <span class="new-guest" v-if="item.is_new_guest == '1'">新客专享</span>
                    </div>
                    <p class="limit co-333 fs24">满{{item.min_amount}}{{item.style_type == 3 ? item.unit : '元'}}可用<span class="xian" v-if="item.info">（{{item.info}}）</span></p>
                    <p class="fs18 co-666">{{item.start_time}}-{{item.end_time}}</p>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import {onMounted, ref, computed , getCurrentInstance} from 'vue'
import {useRouter , useRoute} from 'vue-router'
import {
    cartAxios,
    deleteAxios,
    editByGoodsAxios,
    editByShopAxios,
    emptyInvalidAxios, getCouponAxios,
    getDataAxios, getZhiRecommendAxios,
    newAddAttensionAxios, placeOrderAxios, usercouponAddAxios
} from "@/api/cart.js";
import { showToast } from 'vant';
import RecommendColumn from '@/components/recommendColumn/RecommendColumn'

const cns = getCurrentInstance().appContext.config.globalProperties

const router = useRouter()
const route = useRoute()


const isLoading = ref(false) // 下拉刷新
const is_placeholder = ref(true)
const hasBack = ref(false)
const editAll = ref(false) //判断是否是最上方的编辑
const noData = ref(false) //暂无数据
const hasLogin = ref(true)
const selectAll = ref(false)
// 优惠券
const coupon_popup = ref(false)
const coupon_list = ref([])

const shopList = ref([])
const invalid_goods = ref([])
const recommend = ref([]) // 为你推荐

const total_price = ref(0) // 结算金额
const goods_count = ref(0) // 结算数量

const getData = () => {
    getDataAxios().then(res => {
        isLoading.value = false
        is_placeholder.value = false
        console.log(res)
        if (res.code == 200) {
            if (res.data != null && res.data.length != 0) {
                invalid_goods.value = res.data.invalid_carts
                shopList.value = res.data.valid_carts
                total_price.value = res.data.total.total_price
                goods_count.value = res.data.total.check_count
            } else {
                invalid_goods.value = []
                shopList.value = []
                total_price.value = 0
                goods_count.value = 0
            }


            countTotal()
        } else if (res.code == 403) {
            hasLogin.value = false
        } else {
            showToast(res.message)
        }
    })
}

// 店铺按钮是否可以操作
const shop_isSelect = (value) => {
    let flag_child = true
    value.forEach((child) => {
        if (!child.shop_select) {
            flag_child = false
        }
    })

    return flag_child
}

// 全选按钮是否可以操作
const all_isSelect = (value) => {
    return true
    let flag = true
    value.forEach((item) => {
        let flag_child = true
        item.goods.forEach((child) => {
            if (!child.reselect) {
                flag_child = false
            }
        })
        if (!flag_child) {
            flag = false
        }
    })

    return flag
}

// 单个删除
const deleteGoodSole = (rec_id, shop_index, index) => {
    deleteAxios({'rec_id': rec_id}).then(res => {
        if (res.code == 200) {
            if (shopList.value[shop_index].goods.length == 1) {
                shopList.value.splice(shop_index, 1)
            } else {
                shopList.value[shop_index].goods.splice(index, 1)
            }

            countTotal()

        } else if (res.code == 403) {
            // 去登录
            appRoute('login')
        } else {
            showToast(res.message)
        }
    })
}

// 批量删除
const deleteGoodMass = () => {
    let str = ''
    let count = 0
    shopList.value.forEach((item) => {
        item.goods.forEach((child) => {
            if (child.is_pay == 1) {
                str += !str ? child.rec_id : ','+child.rec_id
                count++
            }
        })
    })

    if (count == 0) {
        showToast('请选择商品')
        return false
    }

    cns.$dialog.confirm({
        message: '确定要将选中的'+count+'个商品删除吗？'
    }).then(() => {
        deleteAxios({'rec_id': str})
            .then((res) => {
                if (res.code == 200) {
                    getData()
                } else if (res.code == 403) {
                    // 去登录
                    appRoute('login')
                } else {
                    showToast(res.message)
                }
            })
    })
}

// 单个移入关注
const toAttentionSole = (rec_id, shop_index, index) => {
    newAddAttensionAxios({'rec_id': rec_id})
        .then((res) => {
            if (res.code == 200) {
                if (shopList.value[shop_index].goods.length == 1) {
                    shopList.value.splice(shop_index, 1)
                } else {
                    shopList.value[shop_index].goods.splice(index, 1)
                }

                countTotal()
                showToast('移入关注成功！')

            } else if (res.code == 403) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        })
}

// 批量移入关注
const toAttentionMass = () => {
    let str = ''
    let count = 0
    shopList.value.forEach((item) => {
        item.goods.forEach((child) => {
            if (child.is_pay == 1) {
                str += !str ? child.rec_id : ','+child.rec_id
                count++
            }
        })
    })

    if (count == 0) {
        showToast('请选择商品')
        return false
    }

    cns.$dialog.confirm({
        message: '确定要将选中的'+count+'个商品移入关注吗？'
    }).then(() => {
        newAddAttensionAxios({'rec_id': str})
            .then((res) => {
                if (res.code == 200) {
                    getData()
                    showToast('关注成功！')
                } else if (res.code == 403) {
                    // 去登录
                    appRoute('login')
                } else {
                    showToast(res.message)
                }
            })
    })
}

// 切换店铺选择
const chooseShop = (item) => {
    item.shop_select = !item.shop_select
    item.goods.forEach((child) => {
        child.is_pay = item.shop_select && !child.reselect ? '1' : '0'
    })
    editByShopAxios({seller_id: item.seller_id, is_pay: item.shop_select ? '1' : '0'})
        .then((res) => {
            if (res.code == 200) {
                countTotal()
            } else if (res.code == 403) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        })
}

// 切换商品的选择
const chooseGoods = (item) => {
    item.is_check = item.is_check>0 ? 0 : 1
    selectAll.value = shopList.value.every(item => item.is_check)

    editByGoodsAxios({goods_id: item.id, is_check: item.is_check,goods_sku_id:item.goods_sku_id})
        .then((res) => {
            if (res.code == 200) {
                countTotal()
            } else if (res.code == 403) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        })
}

// 获取 结算价格 结算数量 是否全选 店铺是否选中
const countTotal = () => {
    let flag = true
    let totalPrice = 0
    let goodsCount = 0
    shopList.value.forEach((item) => {
        let flag_child = true
        if(item.is_check === 1){
            typeof item.buy_number
            totalPrice += item.buy_number
            goodsCount++
        }else{
            flag = false
            flag_child = false
        }
        item.shop_select = flag_child
    })

    selectAll.value = flag
    if (Number(totalPrice) < 0) {
        total_price.value = 0.00
    } else {
        total_price.value = totalPrice.toFixed(2)
    }
    goods_count.value = goodsCount
}

// 全选
const selectAllGoods = () => {
    editByGoodsAxios({goods_id: 0, is_pay: !selectAll.value ? '1' : '0'})
        .then((res) => {
            if (res.code == 200) {
                selectAll.value = !selectAll.value

                let totalPrice = 0
                let goodsCount = 0

                shopList.value.forEach((item) => {
                    item.shop_select = selectAll.value
                    item.goods.forEach((child) => {
                        child.is_pay = selectAll.value && !child.reselect ? '1' : '0'
                        totalPrice += selectAll.value && !child.reselect ? child.subtotal : 0
                        goodsCount += selectAll.value && !child.reselect ? 1 : 0
                    })
                })

                if (Number(totalPrice) < 0) {
                    total_price.value = 0.00
                } else {
                    total_price.value = totalPrice.toFixed(2)
                }
                total_price.value = goodsCount

            } else if (res.code == 403) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        })
}



// 最终价格
const lastMoney = (e, item) => {
    if (e.is_select) {
        item.is_pay = '1' // 加减数量的时候选中该商品
    }

    if (e.last_money) {
        item.goods_price = e.last_money
    }

    if (e.subtotal) {
        item.subtotal = e.subtotal
    }
    if (e.sku&&e.sku.sku_desc) {
        item.sku_desc = e.sku.sku_desc
        item.sku_id = e.sku.sku_id
    }

    item.gift = e.gift
    countTotal()
}

// 清空失效宝贝
const clearInvalid = () => {
    cns.$dialog.confirm({
        message: '您确定要清空购物车中失效商品吗？'
    }).then(() => {
        emptyInvalidAxios()
            .then((res) => {
                if (res.code == 200) {
                    invalid_goods.value = []
                    showToast(res.message)
                } else if (res.code == 403) {
                    // 去登录
                    appRoute('login')
                } else {
                    showToast(res.message)
                }
            })
    })
}

const getRecommend = () => {
    getZhiRecommendAxios()
        .then((res) => {
            if (res.code == 200) {
                recommend.value = res.data
            } else {
                showToast(res.message)
            }
        })
}

// 领券
const getCoupon = (item) => {
    getCouponAxios({'seller_id': item.seller_id})
        .then((res) => {
            if (res.code == 200) {
                coupon_list.value = res.data.data
                coupon_popup.value = true
            } else if (res.code == 403) {
                appRoute('login')
            } else {
                showToast(res.message)
            }
        })
}

// 点击获取优惠券
const receiveCoupon = (item) => {
    usercouponAddAxios({seller_id: item.seller_id, id: item.id})
        .then((res) => {
            if(res.code == 200) {
                showToast('领取成功！')
                item.status = res.data.status
                getCoupon(item)
            } else if (res.code == 403) {
                appRoute('login')
            }  else {
                showToast(res.message)
            }
        })
}

const toLogin = () => {
    appRoute('login')
}

// 去店铺
const toShop = (id) => {
    appRoute('store_index', {}, {seller_id: id})
}

// 去商品详情
const toGood = (id) => {
    appRoute('good', {}, {goods_id: id})
}

// 找相似
const findSimilar = (cat_id, cat_name) => {
    // if(this.$platform.is_app()) {
    //     this.$platform.appRouteTo('/search?keywords='+cat_id)
    // } else {
    //     setTimeout(() => {
    //         appRoute('search', {}, {cat_id: cat_id, keywords: cat_name, search_source: '购物车找相似', search_type: '手动搜索'})
    //     },150)
    // }
}

// 优惠券切换
const coupleChange = (id) => {
    coupon_tab.value = id
}

// 结算
const toBuy = () => {
    placeOrderAxios()
        .then((res) => {
            if (res.code == 200) {
                cartAxios().then(ret => {
                    if (ret.code == 200) {
                        if(ret.data){
                            let vol_info = {
                                shop_type: ret.data.shop_type,
                                shop_id: ret.data.shop_id,
                                shop_name: ret.data.shop_name,
                                shop_star: ret.data.shop_star,
                                buy_source:'购物车',
                                goods_id_list: ret.data.goods_id_list, // 商品的唯一ID
                                goods_name_list: ret.data.goods_name_list, // 商品对应的名称
                                goods_first_cate_id_list: ret.data.goods_first_cate_id_list,
                                goods_first_cate_list: ret.data.goods_first_cate_list,
                                goods_second_cate_id_list: ret.data.goods_second_cate_id_list,
                                goods_second_cate_list: ret.data.goods_second_cate_list,
                                brand_id_list:ret.data.brand_id_list,
                                goods_brand_list: ret.data.goods_brand_list, // 商品对应的品牌
                                goods_price_list:ret.data.goods_price_list,
                                goods_num_list:ret.data.goods_num_list,
                                goods_info:ret.data.goods_info,
                                ref_id:ret.data.shop_id,
                            }
                            if (ret.data.gift_active_info){
                                vol_info.gift_active_info = ret.data.gift_active_info
                            }
                            if (ret.data.favourable_active_info){
                                vol_info.favourable_active_info = ret.data.favourable_active_info
                            }

                            setTimeout(()=>{
                                appRoute('checkout')
                            },150)
                        }
                    } else {
                        showToast(ret.message)
                    }
                })
            } else if (res.code == 403) {
                // 去登录
                appRoute('login')
            } else if (res.code == 1001) {
                cns.$dialog.confirm({
                    message: res.message,
                    confirmButtonText: '去认证',
                    cancelButtonText: '确认'
                }).then(() => {
                    appRoute('company_enter')
                }).catch(() => {})
            } else if (res.code == 1002) {
                showToast({
                    message: res.message,
                    duration: 3000,
                    onClose: () => {
                        getData()
                    }
                })
            }
                // else if (res.code == 1003) {
                //     for(let i = 0; i < res.data.message.length; i++) {
                //         setTimeout(() => {
                //             Toast({
                //                 message: res.data.message[i],
                //                 duration: 3000,
                //                 onClose: () => {
                //                     this.getData()
                //                 }
                //             })
                //         }, i*3000)
                //     }
            // }
            else if (res.code == 1004) {
                cns.$dialog.alert({
                    message: res.message
                }).then(() => {
                    getData()
                })
            } else {
                showToast(res.message)
            }
        })
}

onMounted(() => {
    document.querySelector('body').setAttribute('style', 'background-color: var(--page-bg-color)')
    hasBack.value = route.query.hasBack
    getData()
    // getRecommend()
})

</script>

<style scoped lang="scss">
    .cart-container{
        :deep(.van-button){
            height: 100%;
        }
        .padding-horizontal-02{
            padding: 0 0.2rem;
        }
        .no-check{
            width: 0.34rem;
            height: 0.34rem;
            border-radius: 50%;
            margin: 0 0.3rem 0 0;
            background: url("@/assets/images/cart/select-no.png") 0 0/100% 100%;
            &.check-grey{
                background: url("@/assets/images/cart/select-grey.png") 0 0/100% 100%;
            }
        }
        .cart-wrap{
            .cart-header{
                height: var(--main-header-height);
                .header{
                    width: 7.5rem;
                    height: var(--main-header-height);
                    position: fixed;
                    z-index: 5;
                    padding: 0 0.4rem;
                    box-sizing: border-box;
                    font-size: var(--base-font-size);
                    em{
                        font-size: 2em;
                    }
                    .cart-title{
                        text-align: center;
                    }
                }
            }

            .loaded{
                .goods-name{
                    height: 0.4rem !important;
                    width: 3.5rem !important;
                    &:last-child{
                        width: 2rem !important;
                    }
                }
            }
            .shop-box{
                padding: 0.38rem 0.2rem 0.2rem;
                border-radius: 0.2rem;
                &:first-child{
                    margin-top: 0.1rem !important;
                }
                .shop-title{
                    .shop-name{
                        width: 2rem;
                        height: 0.3rem;
                        border-radius: 4px;
                        background: var(--page-bg-color);
                    }
                }
                .goods-box{
                    padding-bottom: 0.3rem;
                    border-bottom: 1px solid var(--page-bg-color);
                    &:last-child{
                        padding-bottom: 0.18rem;
                        border-bottom: none;
                    }


                }
                .goods-list{
                    .selectrange{
                        .invalid-sign {
                            width: 0.56rem;
                            height: 0.4rem;
                            line-height: 0.4rem;
                            text-align: center;
                            border-radius: 0.2rem;
                            background: var(--page-bg-color);
                            color: var(--color-text-desc);
                            font-size: 0.2rem;
                            margin-right: 0.12rem;
                        }
                    }
                    .img-box{
                        width: 1.82rem;
                        height: 1.82rem;
                        background-position: center;
                        background-size: 100% 100%;
                        box-shadow: 0 4px 21px 0 rgba(233, 233, 233, 0.55);
                        border-radius: 10px;
                        .nogood {
                            width: 1.4rem;
                            height: 1.4rem;
                            border-radius: 50%;
                        }
                    }
                    .goods-msg{
                        height: 1.82rem;
                        width: 4rem;
                        overflow: hidden;
                        .goods-name{
                            height: 0.58rem;
                            line-height: 0.3rem;

                        }
                        .invalid-name{
                            color: rgba(51, 51, 51, 0.5);
                        }
                        :deep(.van-button){
                            height: 0.54rem;
                        }
                    }
                }
            }
            .all-content{
                width: 100%;
                height: 100%;
                text-align: center;
                box-sizing: border-box;
                img{
                    width: 5.3rem;
                    height: 2.71rem;
                    margin: 0.6rem auto 0;
                    display: inline-block;
                }
                .aui-content{
                    color: #999999;
                    font-size: 0.26rem;
                    margin: 0.3rem 0 0.8rem;
                    .btn-icon {
                        padding: 0.1rem 0.4rem;
                        color: #ffffff;
                        margin-left: 0.2rem;
                        border-radius: 0.28rem;
                    }
                }
            }
            .shop-box-section{
                padding: 0.38rem 0 0.2rem 0.2rem;
                margin-top: 0.1rem;
                border-radius: 0.2rem;
                &.lose{
                    padding: 0.38rem 0.2rem 0.2rem;
                    .invalid-box{
                        padding-bottom: 0.2rem;
                        p:last-child{
                            color: var(--red-color);
                        }
                    }
                }
                &:last-child{
                    margin-bottom: 0.2rem;
                }

                .shop-title{
                    padding-right:0.2rem;

                    img{
                        height:0.16rem;
                    }
                    .control-box{
                        width: 1rem;
                        height: 0.46rem;
                        border-radius: 0.23rem;
                        background: rgba(247, 17, 17, 0.1);
                        color: var(--red-color);
                    }
                }
                .checkbox {
                    width: 0.34rem;
                    height: 0.34rem;
                    border-radius: 50%;
                    background: url("https://cdn.toodudu.com/uploads/2021/02/20/select-icon.png") 0 0/100% 100%;
                    margin: 0 0.3rem 0 0;
                }
                .goods-box{
                    padding-bottom: 0.3rem;
                    border-bottom: 1px solid var(--page-bg-color);
                    &:last-child{
                        padding-bottom: 0.18rem;
                        border-bottom: none;
                    }
                    &.valid-goods{
                        padding-bottom: 0rem;
                        border-bottom: none;
                        &:last-child{
                            padding-bottom: 0rem;
                            border-bottom: none;
                            .goods-list{
                                padding-bottom: 0.18rem;
                                border-bottom: none;
                            }
                            .goods-list{
                                padding-bottom: 0.18rem;
                                border-bottom: none;
                            }
                            .limit-sty{
                                padding-bottom: 0.18rem;
                                border-bottom: none;
                            }
                        }
                        .goods-list{
                            margin-right: 0.2rem;
                            padding-bottom: 0.1rem;
                        }
                    }
                    &.border-sty{
                        .goods-list{
                            padding-bottom: 0.3rem;
                            border-bottom: 1px solid var(--page-bg-color);
                        }
                    }

                    .reduction{
                        .act-sign{
                            width: 0.56rem;
                            height: 0.36rem;
                            line-height: 0.36rem;
                            text-align: center;
                            border: 1px solid var(--red-color);
                            border-radius: 0.04rem;
                            color: var(--red-color);
                            font-size: 0.22rem;
                            margin-left: 0.68rem;
                        }
                        p{
                            padding-right:0.2rem;
                        }
                    }
                    .count-down{
                        height: 0.5rem;
                        margin-left: 0.65rem;
                        width: 6.1rem;
                        background: linear-gradient(to right, #feecec, #fff);
                        border-radius: 0.04rem;
                        img{
                            width: 0.25rem;
                            height: 0.25rem;
                            margin-left: 0.12rem;
                        }
                        .count-sign {
                            font-size: 0.22rem;
                            font-weight:bold;
                            color: var(--red-color);
                            line-height: 0.32rem;
                        }
                        .distance {
                            position: relative;
                            line-height: 0.2rem;
                            overflow: visible;
                            &::before {
                                content:'';
                                position: absolute;
                                width: 0.02rem;
                                height: 0.12rem;
                                background:var(--red-color);
                                left: -0.15rem;
                                top: 50%;
                                transform: translateY(-57%);
                            }
                            .co-redF7{
                                color: var(--red-color);
                            }
                            .colon{
                                margin: 0 0.04rem 0 0.04rem;
                                color: var(--red-color);
                            }
                            .block{
                                display: inline-block;
                                min-width: 0.28rem;
                                height: 0.28rem;
                                line-height: 0.28rem;
                                padding: 0 0.02rem;
                                box-sizing: border-box;
                                text-align: center;
                                border-radius: 0.04rem;
                                background: #fff;
                                color: var(--red-color);
                                font-size: 0.2rem;
                            }
                        }
                    }
                    :deep(.van-swipe-cell){
                        .atten {
                            background: linear-gradient(to bottom, #FCB011, #FDC95E);
                            border-color: transparent;
                        }
                        .right-delet {
                            border-color: transparent;
                        }
                        .goods-name{
                            height: 0.58rem;
                            line-height: 0.3rem;
                        }
                        .limit-sty{
                            color: var(--red-color);
                            text-align: right;
                            margin-right: 0.2rem;
                        }
                        .gift-box{
                            color: var(--color-text);
                            font-size: 0.22rem;
                            height: 0.32rem;
                            &>div{
                                font-size: 0.22rem;
                                &:nth-child(1){
                                    margin-right: 0.1rem;
                                }
                                &:nth-child(3){
                                    max-width: 4rem;
                                }
                                &:nth-child(4){
                                    margin: 0 0.2rem 0 0.1rem;
                                    line-height: 0.34rem;
                                }
                            }
                            em{
                                font-size: 0.32rem;
                            }
                            &>.gift-box-line{
                                width: 1px;
                                height: 0.24rem;
                                margin-top: 0.04rem;
                                border-right: 1px solid var(--color-text-desc);
                                margin-right: 0.1rem;
                            }
                        }
                    }

                }
            }
        }
        .footer-box{
            width: 7.5rem;
            height: 1.08rem;
            box-sizing: content-box;
            .M20 {
                margin: 0 0.2rem 0 0 !important;
            }
            .footer-content{
                width: 6.9rem;
                height: 1.08rem;
                border-bottom: 1px solid #e5e5e5;
                position: fixed;
                bottom: calc(50px + constant(safe-area-inset-bottom));
                bottom: calc(50px + env(safe-area-inset-bottom));
                /*bottom: 0.98rem;*/
                z-index: 100;
                padding-left: 0.3rem;
                padding-right: 0.3rem;
                box-sizing: content-box;
                box-shadow: 0 13px 6px -15px var(--page-bg-color);
                &.footer-act{
                    bottom: 0 !important;

                }
            }
            .to-buy{
                width: 2.06rem;
                height: 0.68rem;
                line-height: 0.68rem;
                text-align: center;
                border-radius: 0.34rem;
                color: #ffffff;
                margin-left: 0.2rem;
            }
            .to-attention {
                width: 1.54rem;
                height: 0.56rem;
                line-height: 0.56rem;
                text-align: center;
                border-radius: 0.28rem;
                color: var(--color-text);
                font-size: 0.24rem;
                margin: 0 0.2rem;
                border: 1px solid #C4C4C4;
            }
            .to-delete {
                width: 1.12rem;
                height: 0.56rem;
                line-height: 0.56rem;
                text-align: center;
                border-radius: 0.28rem;
                color: var(--color-text);
                font-size: 0.24rem;
                border: 1px solid #C4C4C4;
            }
        }
        :deep(.van-popup){
            .coupon-title {
                height: 1.47rem;
                font-size: 0.32rem;
                color: var(--color-text);
                position: relative;
                .coupon-fixed {
                    padding: 0 0.25rem 0;
                    height: 1.47rem;
                    line-height: 1.47rem;
                    font-size: 0.32rem;
                    color: var(--color-text);
                    position: fixed;
                    width: 7.5rem;
                    box-sizing: border-box;
                    background: #fff;
                    border-radius: 0.16rem 0.16rem 0 0;
                    img {
                        position: absolute;
                        right: 0.28rem;
                        top: 0.43rem;
                        width: 0.36rem;
                        height: 0.36rem;
                    }
                }
            }
            .list-box {
                padding: 0 0.11rem 0.35rem;
                .coupon-list {
                    width: 7.28rem;
                    height: 1.98rem;
                    padding: 0.27rem 0 0.2rem 0.48rem;
                    box-sizing: border-box;
                    background: url('@/assets/images/cart/coupon-get.png') no-repeat 0 0 / 100% 100%;
                    margin-bottom: 0.1rem;
                    &.coupon-act{
                        background: url('@/assets/images/cart/coupon-have.png') no-repeat 0 0 / 100% 100%;

                    }
                    .new-guest{
                        padding: 4px 0.1rem;
                        margin-left: 0.1rem;
                        background: linear-gradient(to right, #FCB011, #FDC95E);
                        border-radius: 0.1rem;
                        font-size: 0.24rem;
                        color: #ffffff;

                        &.disabled {
                            background: linear-gradient(to right, #CCCCCC, #DCDCDC);
                        }
                        .price, .limit {
                            margin-top: 0.04rem;
                            margin-bottom: 0.08rem;
                        }
                        .price, .xian {
                            color: #F71111;
                        }
                    }
                }
            }
        }
    }
</style>
