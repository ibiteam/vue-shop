<template>
    <div class="shopping-card" v-if="choose_attr">
        <van-popup
                v-model="choose_attr"
                round
                position="bottom"
                :close-on-click-overlay="false"
                duration="0.5"
                :style="{ 'max-height': '11.8rem','min-height': '9.18rem', overflow: 'visible', 'padding-bottom': 'constant(safe-area-inset-bottom)','padding-bottom': 'env(safe-area-inset-bottom)'}">
            <div class="card-wrap">
                <div class="close-btn" @click="choose_attr = false">
                    <i class="iconfont">&#xea13;</i>
                </div>
                <div class="choose-price">
                    <img :src="thumb_url?thumb_url:goods_info.goods_thumb ? goods_info.goods_thumb : '@/assets/images/common/no-pic.png'">
                    <div>
                        <p class="co-red fs50 fw-b">
                            <template v-if="lastCalPrice">
                                <form-price :price="lastCalPrice.toString().replace('￥','')" :sign_size="28" :DF_size="30" :INT_size="50" weight="bold"></form-price>
                            </template>
                            <template v-else-if="goods_info.shop_price">
                                <form-price :price="goods_info.shop_price.toString().replace('￥','')" :sign_size="28" :DF_size="30" :INT_size="50" weight="bold"></form-price>
                            </template>
                        </p>
                        <p class="fs24 co-999 MT10">
                            <span class="co-333 fs24">商品库存：</span>{{format_goods_number}}
                        </p>
                        <template v-if="skuParamList.length">
                            <div class="select-result elli-1" v-if="!spec_name.length">请选择规格</div>
                            <div class="select-result elli-1" v-if="spec_name.length">
                                已选择 <template v-for="(spec,speci) in spec_name">{{spec}}<template v-if="speci<=spec_name.length-2&&spec_name.length>1">,</template></template>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="choose-quality" style="min-height: 4.3rem;max-height: 7.1rem;">
                    <p class="goods-desc fs26">{{goods_info.goods_subtitle}}</p>
                    <div>
                        <!-- 规格 -->
                        <div class="period" v-for="(param,i) in skuParamList" :key="`param${param.id}`">
                            <h2 class="fs28 co-333 fw-b">{{ param.name }}</h2>
                            <template v-if="i===0">
                                <ul class="paydate s-flex flex-wrap sku-img">
                                    <li :class="{'active':value.selected,'no-mum':value.hidden}" v-for="(value,j) in param.values"  :key="`value${value.id}`" @click="getSkuParam(i,j)">
                                        <img :src="value.thumb?value.thumb:goods_info.goods_thumb" alt="">
                                        <div class="s-flex ai-ct jc-ct">
                                            <p class="elli-2 fs24 co-3D">{{ value.name }}</p>
                                        </div>

                                    </li>
                                </ul>
                            </template>
                            <template v-else>
                                <ul class="paydate s-flex flex-wrap">
                                    <li :class="{'active':value.selected,'no-mum':value.hidden}" v-for="(value,j) in param.values"  :key="`value${value.id}`" @click="getSkuParam(i,j)">{{ value.name }}</li>
                                </ul>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="buy-num s-flex jc-bt">
                    <div>
                        <span class="fs28 co-3D fw-b">数量</span>
                    </div>
                    <div class="s-flex">
                        <span class="iconfont jian" @click="jian" :class="{'hui': buy_number <= min_number || max_number == 0 }">&#xe633;</span>
                        <input type="number" ref="numinput" v-model="buy_number_value" @input="change_buyNum" :class="{'no-click':(act_type == 9 && goods_info.increase_type==1)}">
                        <span class="iconfont jia" @click="jia" :class="{'hui': (max_number == 0 || buy_number >= max_number || (buy_number >= goods_info.limit_number && goods_info.limit_number > 0 ))}">&#xe6aa;</span>
                    </div>
                </div>
                <div class="spec-btn">
                    <span class="fs32 fw-b add-car" @click="toShop('2')">加入购物车</span>
                    <span class="fs32 fw-b now-buy" @click="toShop('1')">立即购买</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
    import { ref, computed, watch, nextTick, onMounted, getCurrentInstance } from 'vue'
    import { useGoodStore } from "@/stores";
    import { useRouter } from 'vue-router'
	const cns = getCurrentInstance().appContext.config.globalProperties

    const goodStore = useGoodStore()
    const props = defineProps({
        sku_param_list: {
            default: () => []
        },
        sku_id: {
            type: String,
            default: ''
        },
        sku_shop_price: {
            type: String,
            default: ''
        },
        choose_attrs: {
            type: Boolean,
            default: false
        },
        goods_info: {
            type: Object,
            default: () => ({})
        },
        shopping_type: {  // 1购买 2加入购物车
            type: Number,
            default: 0
        },
        address_id: {
            default: ''
        },
        init_flag: {
            type: Number,
            default: -1
        },
        is_select_spec: {
            type: Boolean,
            default: false
        },
        shop_info: {
            type: Object,
            default: () => ({})
        }
    })

    const emit = defineEmits(['closeChooseAttr', 'selectSku', 'unusual', 'changeCar'])

    // 响应式数据
    const choose_attr = ref(false)
    const act_type = ref(1) // 活动类型
    const min_number = ref(1) // 最小起购量
    const max_number = ref(1) // 最大购买量，随着仓库变化
    const goods_number = ref(1) // 库存量
    const lastCalPrice = ref(null) // 最终价
    const isLoading = ref(false)
    const timer = ref(null)
    const skuParamList = ref([])
    const spec_id = ref([])
    const spec_name = ref([])
    const skuId = ref('')
    const isSkuIng = ref(false)
    const skuPrice = ref({})
    const thumb_url = ref('')
    const format_goods_number = ref('') // 格式化商品库存
    const numinput = ref(null)

    // 计算属性
    const buy_number = computed(() => goodStore.buyNumber)
    
    const buy_number_value = computed({
        get: () => buy_number.value,
        set: (newVal) => goodStore.setBuyNumber(Number(newVal))
    })

    // 监听属性
    watch(() => props.sku_shop_price, (newVal) => {
        skuPrice.value.shop_price = newVal
    })

    watch(choose_attr, (newVal) => {
        if (!newVal) {
            if (props.is_select_spec) {
                emit('closeChooseAttr', { spec_name: spec_name.value })
            } else {
                emit('closeChooseAttr')
            }
        }
    })

    watch(() => props.choose_attrs, (newVal) => {
        choose_attr.value = newVal
        if (!props.choose_attrs) {
            return false
        }

        // 库存
        goods_number.value = props.goods_info.goods_number // 总库存
        max_number.value = goods_number.value ? goods_number.value : 0 // 当前可用库存

	    if (props.init_flag == 1) {
		    goodStore.setBuyNumber(props.goods_info.min_number)
	    }
        // 商品规格
        if (props.init_flag == 1) {
            skuParamList.value = JSON.parse(JSON.stringify(props.sku_param_list))
            spec_name.value = []
            skuId.value = props.sku_id
            skuParamList.value.length && skuParamList.value.forEach((d) => {
                d.values.forEach(s => {
                    if (s.selected) {
                        if (s.thumb && !thumb_url.value) {
                            thumb_url.value = s.thumb
                        }
                        spec_name.value.push(s.name)
                        spec_id.value.push(s.id)
                    }
                })
            })
        }
        // 计算最终价
        if (props.sku_param_list.length && skuId.value) {
            count(skuPrice.value.shop_price)
        } else {
            count()
        }
    })

    watch(() => props.sku_param_list, (newVal) => {
        skuParamList.value = JSON.parse(JSON.stringify(newVal))
        spec_name.value = []
        skuId.value = props.sku_id
        skuParamList.value.length && skuParamList.value.forEach((d) => {
            d.values.forEach(s => {
                if (s.selected) {
                    if (s.thumb && !thumb_url.value) {
                        thumb_url.value = s.thumb
                    }
                    spec_name.value.push(s.name)
                    spec_id.value.push(s.id)
                }
            })
        })
        if (skuParamList.value.length && skuId.value) {
	        count(skuPrice.value.shop_price)
        }
    })

    watch(() => props.goods_info, (newVal) => {
        act_type.value = newVal.act_type
        min_number.value = newVal.min_number
        format_goods_number.value = newVal.format_goods_number
    })

    // 方法
    const getSkuParam = (i, j) => {
        if (isSkuIng.value) {
            return
        }
        if (skuParamList.value[i].values[j].hidden) {
            return
        }
        isSkuIng.value = true
        spec_id.value = []
        spec_name.value = []
        skuParamList.value.length && skuParamList.value.forEach((d, k) => {
            if (k == i) {
                d.values.forEach((s, l) => {
                    if (l === j) {
                        s.selected = !s.selected
                        if (s.selected) {
                            if (s.thumb) {
                                thumb_url.value = s.thumb
                            }
                            spec_id.value.push(d.values[j].id)
                            spec_name.value.push(d.values[j].name)
                        } else {
                            if (s.thumb) {
                                thumb_url.value = ''
                            }
                        }
                    } else {
                        s.selected = false
                    }
                })
            } else {
                d.values.forEach(s => {
                    if (s.selected) {
                        spec_name.value.push(s.name)
                        spec_id.value.push(s.id)
                    }
                })
            }
        })
        
        const info = {
            goods_id: props.goods_info.goods_id,
            spec_id: spec_id.value.join('_')
        }
        
        cns.$http.doPost("v4/goods/updateSkuParam", info).then((res) => {
            if (res.code == 200) {
                skuParamList.value = JSON.parse(JSON.stringify(res.data.param))
                if (res.data.sku) {
                    goods_number.value = Number(res.data.sku.number) // 总库存
                    format_goods_number.value = res.data.sku.format_goods_number
                    max_number.value = goods_number.value ? goods_number.value : 0 // 当前可用库存
                    count( res.data.sku.shop_price)
                    skuId.value = res.data.sku.id
                    skuPrice.value = {
                        'shop_price': res.data.sku.shop_price,
                        'format_shop_price': res.data.sku.shop_price
                    }
                } else {
                    skuId.value = ''
                    count(props.goods_info.shop_price)
                }
                nextTick(() => {
                    isSkuIng.value = false
                })
                emit('selectSku', res.data)
            } else {
                cns.$toast(res.message)
                isSkuIng.value = false
            }
        })
    }

    // 减少购买量
    const jian = () => {
        if (!isSelectAllSku()) {
            return false
        }
        if (buy_number.value <= min_number.value || max_number.value == 0) {
            cns.$toast('该商品最小起订量是' + min_number.value + props.goods_info.unit)
            return false
        }
        if (act_type.value == 9 && props.goods_info.increase_type == 1) {
            goodStore.setBuyNumber(!props.goods_info.can_use_decimal ? buy_number.value - min_number.value : Number(Math.floor((buy_number.value - min_number.value) * 1000) / 1000))
        } else {
            goodStore.setBuyNumber(!props.goods_info.can_use_decimal ? buy_number.value - 1 : Number(Math.floor((buy_number.value - 1) * 1000) / 1000))
        }
        examine()
    }

    // 增加购买量
    const jia = () => {
        if (!isSelectAllSku()) {
            return false
        }

        if (buy_number.value >= max_number.value || max_number.value == 0) {
            cns.$toast('数量超出范围了~')
            return false
        }
        if (act_type.value == 9 && props.goods_info.increase_type == 1) {
            goodStore.setBuyNumber(!props.goods_info.can_use_decimal ? buy_number.value + min_number.value : Number(Math.floor((buy_number.value + min_number.value) * 1000) / 1000))
        } else {
            goodStore.setBuyNumber(!props.goods_info.can_use_decimal ? buy_number.value + 1 : Number(Math.floor((buy_number.value + 1) * 1000) / 1000))
        }

        examine()
    }

    // 手动改变购买量
    const change_buyNum = () => {
        if (!isSelectAllSku()) {
            buy_number_value.value = min_number.value
            return false
        }
        if (buy_number_value.value.toString().indexOf('.') > -1) {
            if (!props.goods_info.can_use_decimal) {
                goodStore.setBuyNumber(Number(buy_number_value.value.toString().replace(/\./g, '')))
            } else {
                if (buy_number_value.value.toString().split('.')[1].length > 3) {
                    goodStore.setBuyNumber(Number(Math.floor(buy_number_value.value * 1000) / 1000))
                } else {
                    goodStore.setBuyNumber(buy_number_value.value)
                }
            }
        } else {
            goodStore.setBuyNumber(buy_number_value.value)
        }

        timer.value && clearInterval(timer.value)
        timer.value = setTimeout(() => {
            if (buy_number_value.value == '' || buy_number_value.value <= 0) {
                goodStore.setBuyNumber(min_number.value > max_number.value ? max_number.value : min_number.value)
            }
            examine()
        }, 1000)
    }

    // 检查数量和活动异常
    const examine = () => {
        let datas = {}
        let url = 'v3/goods/checkNumber'
        datas = {
            goods_id: props.goods_info.goods_id,
            number: buy_number.value ? buy_number.value : "",
            sku_id: skuId.value
        }
        cns.$http.doPost(url, datas)
            .then((res) => {
                if (res.code === 200) {
                    max_number.value = res.data.goods_number
                    format_goods_number.value = res.data.format_goods_number
                    count()
                } else if (res.code == 403) {
                    cns.appRoute('login')
                } else if (res.code == 404) {
                    choose_attr.value = false
                    cns.$toast({
                        message: res.message,
                        onClose: () => {
                            emit('unusual')
                        }
                    })
                } else {
                    cns.$toast(res.message)
                }
            })
    }

    // 计算单价
    const count = (prices) => {
        let calcPrice = prices != undefined ? prices : skuParamList.value.length && skuId.value ? skuPrice.value.shop_price : props.goods_info.shop_price
        lastCalPrice.value = "￥" + (Number(calcPrice).toFixed(2))
        if (prices != undefined) {
            return (Number(calcPrice).toFixed(2))
        }
    }

    const isSelectAllSku = () => {
        if (skuParamList.value.length && spec_name.value.length < skuParamList.value.length) {
            let flagIndex = -1
            skuParamList.value.forEach((d, i) => {
                let flag = false
                d.values.forEach(s => {
                    if (s.selected) {
                        flag = true
                    }
                })
                if (!flag && flagIndex == -1) {
                    flagIndex = i
                }
            })
            if (flagIndex >= 0) {
                cns.$toast('请选择' + skuParamList.value[flagIndex].name)
            }
            return false
        } else {
            return true
        }
    }

    const toShop = (type) => {
        let fType = type
        if (type == 1 && props.shopping_type > 0) {
            fType = props.shopping_type
        }
        if (skuParamList.value.length) {
            shopDone(fType)
        } else {
            shopDone(props.shopping_type)
        }
    }

    const shopDone = (shopType) => {
        if (!isSelectAllSku()) {
            return false
        }
        if (shopType == 1) { // 立即购买 拼团
            checkNumberAndGoOrder(shopType)
        } else if (shopType == 2) { // 加入购物车
            if (isLoading.value) {
                return false
            }
            if (buy_number.value == 0) {
                cns.$toast("数量不能为0~")
                return
            }

            const info = {
                goods_id: props.goods_info.goods_id,
                goods_number: buy_number.value,
                sku_id: skuId.value
            }

            const pData = {
                goods_id: props.goods_info.goods_id,
                number: buy_number.value ? buy_number.value : "",
                is_buy: true,
                sku_id: skuId.value
            }

            isLoading.value = true
            cns.$http.doPost("v3/goods/checkNumber", pData).then((res) => {
                isLoading.value = false
                if (res.code == 200) {
                    cns.$http.doPost("v3/cart/store", info)
                        .then((ret) => {
                            choose_attr.value = false
                            if (ret.code == 200) {
                                cns.$toast(ret.message)
                                emit('changeCar', ret.data.number)
                            } else if (ret.code == 403) {
                                cns.appRoute('login')
                            } else if (ret.code == 404) {
                                choose_attr.value = false
                                cns.$toast({
                                    message: ret.message,
                                    onClose: () => {
                                        emit('unusual')
                                    }
                                })
                            } else {
                                cns.$toast(ret.message)
                            }
                        })
                } else if (res.code == 403) {
                    cns.appRoute('login')
                } else if (res.code == 404) {
                    choose_attr.value = false
                    cns.$toast({
                        message: res.message,
                        onClose: () => {
                            emit('unusual')
                        }
                    })
                } else {
                    cns.$toast(res.message)
                }
            })
        }
    }

    const checkNumberAndGoOrder = (shopType) => {
        let datas = {}
        let url = 'v3/goods/checkNumber'
        datas = {
            goods_id: props.goods_info.goods_id,
            number: buy_number.value ? buy_number.value : "",
            is_buy: true,
            sku_id: skuId.value
        }
        cns.$http.doPost(url, datas)
            .then((res) => {
                if (res.code === 200) {
                    let info = {
                        goods_id: props.goods_info.goods_id,
                        goods_number: buy_number.value ? buy_number.value : "",
                        address_id: props.address_id,
                        sku_id: skuId.value,
                        buy_type: props.goods_info.buy_type,
                        goods_price: count(skuId.value ? skuPrice.value.shop_price : props.goods_info.shop_price), // goods_price 商品价格必填
                    }
                    //打开下单页面
                    setTimeout(() => {
                        cns.appRoute('active_checkout', {}, info)
                    }, 150)
                } else if (res.code == 403) {
                    cns.appRoute('login')
                } else if (res.code == 404) {
                    choose_attr.value = false
                    cns.$toast({
                        message: res.message,
                        onClose: () => {
                            emit('unusual')
                        }
                    })
                }else {
                    cns.$toast(res.message)
                }
            })
    }
</script>

<style scoped lang="scss">
    .close-btn{
        i{
            font-size: 0.28rem;
            color: var(--color-text-desc);
            font-weight: bold;
        }
        position: absolute;
        right: 0.4rem;
        top: 0.4rem;
        z-index: 9999;
    }
    .active{
        font-size: 0.32rem;
        color: var(--color-text);
        font-weight: bold;
    }
    .hui{
        color:#ddd !important;
        font-weight:400 !important;
    }
    .no-click{
        pointer-events: none;
    }
    .choose-price {
        width: 100%;
        height: 2.4rem;
        position: relative;
        padding: 0.4rem 0.2rem 0.02rem 2.7rem;
        box-sizing: border-box;
        display: flex;
        align-items: flex-end;
    }
    .choose-price>img {
        width: 2rem;
        height: 2rem;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        position: absolute;
        bottom: 0;
        left: 0.4rem;
        border-radius: 0.2rem;
    }
    .choose-price .select-result{
        max-width: 4.4rem;
        height: 0.6rem;
        line-height: 0.6rem;
        background: var(--page-bg-color);
        border-radius:0.08rem;
        padding: 0 0.2rem;
        font-size: 0.24rem;
        color: var(--color-text-desc);
        min-width: 7em;
        text-align: center;
        margin-top: 0.16rem;
    }
    .choose-quality {
        margin-top: 0.2rem;
        width: 100%;
        max-height: 5.4rem;
        overflow: auto;
        padding-left: 0.4rem;
    }
    .goods-desc {
        padding: 0.1rem 0.3rem 0.1rem 0;
        line-height: 0.4rem;
    }
    .choose-quality h2 {
        padding: 0.1rem 0 0.2rem;
    }
    .choose-quality li {
        margin-bottom: 0.2rem;
        font-size: 0.28rem;
        height: 0.7rem;
        line-height: 0.68rem;
        padding: 0 0.2rem;
        border: 1px solid var(--page-bg-color);
        background: var(--page-bg-color);
        color: var(--color-text);
        border-radius: 0.08rem;
        margin-right: 0.2rem;
    }
    .choose-quality .sku-img li{
        width: 2.1rem;
        height: 2.7rem;
        background: var(--page-bg-color);
        border-radius: 0.08rem;
        padding: 0;
        font-size: 0;
        border: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .choose-quality .sku-img li.active{
        border: 1px solid var(--red-color);
        background: #FFF1F1;
        >div>p{
            color: var(--red-color);
        }
    }
    .choose-quality .sku-img li img{
        width: 100%;
        height: 2.1rem;
        border-radius: 0.08rem;
    }
    .choose-quality .sku-img li>div{
        height: 0.6rem;
        line-height: 0.3rem;
        overflow: hidden;
        padding: 0 0.1rem;
    }
    .choose-quality li.active {
        color: var(--red-color);
        border: 1px solid var(--red-color);
        background: #FFF1F1;
        font-weight: normal;
    }
    .choose-quality li.unclick {
        color: var(--color-text-desc);
        border-color: transparent !important;
        background: #f6f6f6;
        pointer-events: none;
    }
    .choose-quality li.no-mum{
        color: rgba(51,51,51,0.5);
        background: #f6f6f6;
        pointer-events: none;
        position: relative;
    }
    .choose-quality li.no-mum:after{
        content: '缺货';
        width: 0.56rem;
        height: 0.3rem;
        line-height: 0.3rem;
        text-align: center;
        position: absolute;
        border-radius: 0.15rem 0.02rem 0.15rem 0.02rem;
        right: -0.2rem;
        top: -0.26rem;
        font-size: 0.20rem;
        color: var(--color-text);
        background: #F6F6F6;
        border: 1px solid #D9D9D9;
    }
    .choose-quality .sku-img li.no-mum{
        opacity: 0.8;
    }
    .choose-quality .sku-img li.no-mum:after{
        content: '缺货';
        width: 0.8rem;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        position: absolute;
        border-radius: 0.4rem;
        top: 0.65rem;
        left: 0.65rem;
        font-size: 0.24rem;
        color: #fff;
        background: rgba(0,0,0,0.5);
        border: none;
    }
    .buy-num {
        padding: 0 0.4rem;
        margin-top: 0.3rem;
        padding-right: 0.5rem;
    }
    .buy-num>div {
        border-radius: 0.04rem;
        text-align: center;
        align-items: center;
    }
    .jian {
        color: var(--color-text);
        font-size: 0.36rem;
        font-weight: bold;
        margin-right: 0.1rem;
    }
    .jia {
        color: var(--color-text);
        font-size: 0.36rem;
        font-weight: bold;
    }
    .buy-num>div>span {
        width: 0.5rem;
        height: 0.6rem;
        line-height: 0.65rem;
    }
    .buy-num>div>input {
        width: 0.92rem;
        height: 0.5rem;
        line-height: 0.5rem;
        background-color: var(--page-bg-color);
        text-align: center;
        border-radius: 0.08rem;
    }
    .choose_btn {
        width: 6.5rem;
        height: 0.8rem;
        text-align: center;
        margin: 0.2rem auto 0.2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: linear-gradient(to right, var(--red-color), #FA6060);
        color: #fff;
        border-radius: 34px;
    }
    .spec-btn{
        width: 6.5rem;
        height: 0.8rem;
        margin: 0.2rem auto 0.2rem;
        display: flex;
        justify-content: space-between;
        span{
            display: inline-block;
            cursor: pointer;
            height: 0.8rem;
            line-height: 0.8rem;
            color: #fff;
            text-align: center;
            width: 3.1rem;
            border-radius: 0.4rem;
        }
        .add-car{
            background: linear-gradient(-90deg, #FECB00, #FF9801);
        }
        .now-buy{
            background: linear-gradient(-90deg, #FA5F5F, var(--red-color));
        }
    }
</style>
