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
                            <div class="goods-box valid-goods" v-for="(goods,index) in shopList" :key="goods.id" :class="!((goods.act_type==1 || goods.act_type==2) && goods.limit_number>0) ? 'border-sty' : '' ">
                                <van-swipe-cell>
                                    <template #right>
                                        <van-button square type="danger" class="atten" @click="toAttentionSole(goods,index)">移入<br>关注</van-button>
                                        <van-button square type="danger" class="right-delet btn-gradient" @click="deleteGoodSole(goods,index)">删除</van-button>
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
                                            <div class="img-box MR20" :style="{backgroundImage:'url('+ goods.goods.image +')'}" style="flex: none;" @click="toGood(goods.goods.no)"></div>
                                            <div class="goods-msg flex-1 s-flex flex-dir jc-bt">
                                                <p class="elli-2 fs22 co-333 goods-name" @click="toGood(goods.goods.no)">{{goods.goods.name}}</p>
                                                <p class="elli-2 fs20 co-666 goods-name" v-if="goods.goods.sku_desc">{{goods.goods.sku_desc}}</p>
                                                <div class="s-flex ai-fe jc-bt">
                                                    <!--价格 数量-->
	                                                <div class="s-flex ai-ct">
		                                                <form-price :price="goods.goods.price" :unit="goods.goods.unit" unit_color="#333" weight="600"></form-price>
		                                                <template v-if="goods.goods.integral">
															<span style="margin: 0 0.04rem;">+</span>
			                                                <span class="co-red fs30 fw-b">{{goods.goods.integral}}</span>
			                                                <span class="co-red fs24" style="margin-left: 0.02rem;">积分</span>
														</template>
	                                                </div>

                                                    <van-stepper v-model="goods.buy_number" :before-change="(value) => changeUpdate(value,goods,index)" :min="1" :max="goods.goods.can_quota === 1? goods.goods.quota_number : goods.goods.total" />
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
                                    <div class="img-box s-flex ai-ct jc-ct MR20" :style="{backgroundImage:'url('+ goods.goods.image +')'}" @click="goods.goods.invalid_type=='out_of_stock' ? toGood(goods.goods.no) : ''">
                                        <img v-if="goods.goods.invalid_type=='out_of_stock'" class="nogood" src="@/assets/images/cart/nogood.png" alt="">
                                    </div>
                                    <div class="goods-msg flex-1 s-flex flex-dir jc-bt">
                                        <p class="elli-2 fs22 co-333 goods-name invalid-name"
                                           @click="goods.goods.invalid_type=='out_of_stock' ? toGood(goods.goods.no) : ''">{{goods.goods.name}}</p>
                                        <!--失效原因-->
                                        <div class="fs20 co-333">
                                            {{goods.goods.invalid_type=='status_not_sale' ? '该商品已下架' : (goods.goods.invalid_type=='out_of_stock' ? '该商品已售罄,请选购其他商品购买吧！': '该商品不支持购买')}}
                                        </div>
                                        <div class="s-flex ai-fe jc-fe">
                                            <van-button color="#F71111" plain round v-if="goods.invalid_type=='out_of_stock'" @click="findSimilar(goods.cat_id, goods.goods.name)">找相似</van-button>
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
                    <div v-if="all_isSelect" class="no-check M20 check-grey"></div>
                    <div
                        v-else-if="selectAll"
                        class="iconfont checkbox M20"
                        @click="selectAllGoods"
                    ></div>
                    <div v-else class="no-check M20" @click="selectAllGoods"></div>
                    <span class="fs24 sele-all">全选</span>
                    <span class="ML20 fs28 co-333">合计:
	                    <template v-if="total_price || (!total_price && !total_integral)">
		                     <span class="fs22">￥</span>{{total_price.toString().split('.')[0]}}<span class="fs22">.{{total_price.toString().split('.')[1] ? total_price.toString().split('.')[1] : '00'}}</span>
	                    </template>
	                    <template v-if="total_integral">
		                    <span class="fs22" style="margin: 0 0.02rem;">+</span>
		                    <span class="fs22">{{total_integral}}</span>积分
	                    </template>
                    </span>
                </div>
                <section class="to-buy co-999 fs24 btn-gradient" @click="toBuy">去结算({{goods_count < 100 ? goods_count : '99+'}})</section>
            </div>
            <div v-else class="footer-content s-flex ai-ct bg-fff jc-bt" :class="[hasBack ? 'footer-act' : '']">
                <section class="s-flex ai-ct">
                    <div v-if="all_isSelect" class="no-check M20 check-grey"></div>
                    <div v-else-if="selectAll" class="iconfont checkbox M20" @click="selectAllGoods"></div>
                    <div v-else class="no-check M20" @click="selectAllGoods"></div>
                    <span class="fs24 sele-all">全选</span>
                </section>
                <section class="s-flex jc-fe ai-ct">
                    <div class="s-flex ai-ct" v-if="invalid_goods && invalid_goods.length>0">
                        <img src="@/assets/images/cart/clear.png" alt="" style="width:0.24rem;height:0.25rem;">
                        <span class="fs22 ML10" style="color: var(--red-color)" @click="clearInvalid">清空失效宝贝</span>
                    </div>
                    <div class="to-attention" @click="toAttentionMass">移入关注</div>
                    <div class="to-delete" @click="deleteGoodMass">删除</div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref, computed , getCurrentInstance} from 'vue'
import {useRouter , useRoute} from 'vue-router'
import {
    changeNumberAxios,
    deleteAxios,
    editByGoodsAxios,
    emptyInvalidAxios,
    getDataAxios, getZhiRecommendAxios,
    newAddAttensionAxios, placeOrderAxios
} from "@/api/cart.js";
import { showToast } from 'vant';
import { isUnLoginCode, isSuccessCode} from "@/utils/constant.js";
import RecommendColumn from '@/components/recommendColumn/RecommendColumn'

const cns = getCurrentInstance().appContext.config.globalProperties

const router = useRouter()
const route = useRoute()


const isLoading = ref(false) // 下拉刷新
const is_placeholder = ref(true)
const hasBack = ref(false)
const editAll = ref(false) //判断是否是最上方的编辑
const hasLogin = ref(true)
const selectAll = ref(false)

const shopList = ref([])
const invalid_goods = ref([])
const recommend = ref([]) // 为你推荐

const total_price = ref(0) // 结算金额
const total_integral = ref(0) // 结算积分
const goods_count = ref(0) // 结算数量

const getData = () => {
    getDataAxios().then(res => {
        isLoading.value = false
        is_placeholder.value = false
        if (isSuccessCode(res)) {
            if (res.data != null && res.data.length != 0) {
                invalid_goods.value = res.data.invalid_carts
                shopList.value = res.data.valid_carts
                total_price.value = res.data.total.total_price
	            total_integral.value = res.data.total.total_integral
                goods_count.value = res.data.total.check_count
            } else {
                invalid_goods.value = []
                shopList.value = []
                total_price.value = 0
	            total_integral.value = 0
                goods_count.value = 0
            }
            countTotal()
        } else if (isUnLoginCode(res)) {
            hasLogin.value = false
        } else {
            showToast(res.message)
        }
    })
}

// 全选按钮是否可以操作
const all_isSelect = computed(() => {
    let flag = !shopList.value.length
    return flag
})

// 单个删除
const deleteGoodSole = (goods,index) => {
    deleteAxios({ids:[goods.id]}).then(res => {
        if (isSuccessCode(res)) {
            shopList.value.splice(index,1)
            countTotal()
        } else if (isUnLoginCode(res)) {
            // 去登录
            appRoute('login')
        } else {
            showToast(res.message)
        }
    })
}

// 批量删除
const deleteGoodMass = () => {
    let str = shopList.value.filter(item => item.is_check === 1).map(item => item.id);
    let count = str.length

    if (count == 0) {
        showToast('请选择商品')
        return false
    }

    cns.$dialog.confirm({
        message: '确定要将选中的'+count+'个商品删除吗？'
    }).then(() => {
        deleteAxios({'ids': str})
            .then((res) => {
                if (isSuccessCode(res)) {
                    getData()
                } else if (isUnLoginCode(res)) {
                    // 去登录
                    appRoute('login')
                } else {
                    showToast(res.message)
                }
            })
    })
}

// 单个移入关注
const toAttentionSole = (goods,index) => {
    newAddAttensionAxios({ids: [goods.id]})
        .then((res) => {
            if (isSuccessCode(res)) {
                shopList.value.splice(index, 1)
                countTotal()
                showToast('移入关注成功！')

            } else if (isUnLoginCode(res)) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        }).catch(err=>{
            console.log(err)
        })
}

// 批量移入关注
const toAttentionMass = () => {
    let str = shopList.value.filter(item => item.is_check === 1).map(item => item.id);
    let count = str.length

    if (count == 0) {
        showToast('请选择商品')
        return false
    }

    cns.$dialog.confirm({
        message: '确定要将选中的'+count+'个商品移入关注吗？'
    }).then(() => {
        newAddAttensionAxios({ids: str})
            .then((res) => {
                if (isSuccessCode(res)) {
                    getData()
                    showToast('关注成功！')
                } else if (isUnLoginCode(res)) {
                    // 去登录
                    appRoute('login')
                } else {
                    showToast(res.message)
                }
            })
    })
}

// 切换商品的选择
const chooseGoods = (item) => {
    item.is_check = item.is_check>0 ? 0 : 1
    selectAll.value = shopList.value.every(item => item.is_check)

    editByGoodsAxios({goods_no: item.goods.no, is_check: item.is_check,goods_sku_id:item.goods_sku_id})
        .then((res) => {
            if (isSuccessCode(res)) {
                countTotal()
            } else if (isUnLoginCode(res)) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        })
}

// 获取 结算价格 结算数量 是否全选 店铺是否选中
const countTotal = () => {
    let totalPrice = 0
    let totalIntegral = 0
    let goodsCount = 0
    shopList.value.forEach(item => {
        if(item.is_check === 1){
            totalPrice += Number(item.buy_number) * Number(item.goods.price)
	        totalIntegral += Number(item.buy_number) * Number(item.goods.integral)
        }
    })

    selectAll.value = shopList.value.every(item => item.is_check)
    if (Number(totalPrice) < 0) {
        total_price.value = 0.00
    } else {
        total_price.value = totalPrice.toFixed(2)
    }
    goods_count.value = goodsCount
}

//
const changeUpdate = (value,goods,index) => {
    changeNumberAxios({id:goods.id,goods_no:goods.goods.no,goods_sku_id:goods.goods_sku_id,buy_number:value}).then(res => {
        if (isSuccessCode(res)) {
            goods.buy_number = value
            countTotal()
            return true
        } else if (isUnLoginCode(res)) {
            return false
            // 去登录
            appRoute('login')
        } else {
            return false
            showToast(res.message)
        }
    })
}

// 全选
const selectAllGoods = () => {
    editByGoodsAxios({goods_no: 0, is_check: selectAll.value?0:1,goods_sku_id:0})
        .then((res) => {
            if (isSuccessCode(res)) {
                selectAll.value = !selectAll.value
                let totalPrice = 0
	            let totalIntegral = 0
                let goodsCount = 0

                shopList.value.forEach(item => {
                    item.is_check = selectAll.value?1:0
                    if(item.is_check === 1){
                        totalPrice += Number(item.buy_number) * Number(item.goods.price)
	                    totalIntegral += Number(item.buy_number) * Number(item.goods.integral)
                    }
                })

                if (Number(totalPrice) < 0) {
                    total_price.value = 0.00
                } else {
                    total_price.value = totalPrice.toFixed(2)
                }
                goods_count.value = goodsCount
            } else if (isUnLoginCode(res)) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        })
}

// 清空失效宝贝
const clearInvalid = () => {
    cns.$dialog.confirm({
        message: '您确定要清空购物车中失效商品吗？'
    }).then(() => {
        emptyInvalidAxios()
            .then((res) => {
                if (isSuccessCode(res)) {
                    invalid_goods.value = []
                    showToast(res.message)
                } else if (isUnLoginCode(res)) {
                    // 去登录
                    appRoute('login')
                } else {
                    showToast(res.message)
                }
            })
    }).catch(() => {})
}

const getRecommend = () => {
    getZhiRecommendAxios()
        .then((res) => {
            if (isSuccessCode(res)) {
                recommend.value = res.data
            } else {
                showToast(res.message)
            }
        })
}

const toLogin = () => {
    appRoute('login')
}

// 去商品详情
const toGood = (no) => {
    appRoute('good', {goods_no: no})
}

// 找相似
const findSimilar = (cat_id, cat_name) => {
    appRoute('search', {cat_id: cat_id, keywords: cat_name})
}

// 结算
const toBuy = () => {
    placeOrderAxios()
        .then((res) => {
            if (isSuccessCode(res)) {
                appRoute('checkout')
            } else if (isUnLoginCode(res)) {
                // 去登录
                appRoute('login')
            } else {
                showToast(res.message)
            }
        }).catch(error => {
            console.log(error)
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
    .checkbox {
        width: 0.34rem;
        height: 0.34rem;
        border-radius: 50%;
        background: url("https://cdn.toodudu.com/uploads/2021/02/20/select-icon.png") 0 0/100% 100%;
        margin: 0 0.3rem 0 0;
    }
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
                padding: 0.2rem 0 0.2rem 0.2rem;
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
    }
</style>
