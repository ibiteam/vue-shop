<template>
	<div class="sure-order">
		<common-header :title="title"></common-header>
		<div v-if="!placeholder">
			<!--收货地址-->
			<section class="s-flex address-box bg-fff ai-ct" v-if="address!=null" @click="changeAddress">
				<div class="flex-1">
					<p class="MB20 s-flex ai-ct">
						<span class="default-addr" v-if="address.is_default==1">默认</span>
						<!--<span class="default-addr"-->
						<!--      :class="{ home: address.address_type == '家', company: address.address_type == '公司', repos: address.address_type == '仓库' }">{{ address.address_type }}</span>-->
						<span
							class="fs24 co-333">{{ address.province }}{{ address.city }}{{ address.district }}</span>
					</p>
					<p class="fs30 co-333 fw-b elli-2">{{ address.address_detail }}</p>
					<p>
						<span class="fs24 co-333">{{ address.recipient_name }}</span>
						<span class="fs24 co-333">{{ address.recipient_phone }}</span>
					</p>
				</div>
				<img class="ML10" style="width:0.11rem;height:0.19rem" src="@/assets/images/arrow-right.png" alt="">
			</section>
			<section class="s-flex ai-ct address-box no-address bg-fff ai-ct" @click="changeAddress" v-else>
				<p class="fw-b fs28 flex-1">请选择收货地址</p>
				<img style="width:0.11rem;height:0.19rem" src="@/assets/images/arrow-right.png" alt="">
			</section>
			<!--商品内容-->
			<section class="MT20">
				<div class="shop-list bg-fff MT10" v-for="(good,goodsIdx) in goodsInfo" :key="goodsIdx">
					<div class="goods-list s-flex ai-ct">
						<div class="img-box" :style="{backgroundImage:'url('+ good.thumb +')'}"></div>
						<div class="goods-msg s-flex flex-dir flex-1">
							<p class="elli-2 fs22 goods-name">{{ good.name }}</p>
							<p class="elli-2 fs20 goods-attr" v-if="good.sku_data">{{ good.sku_data }}</p>
							<div class="fs24 s-flex jc-bt MB10">
								<form-price :price="good.price" :unit="good.unit" unit_color="#333"
								            weight="bold"></form-price>
								<template v-if="good.integral">
									<p class="co-333 fs40" style="margin: 0 0.08rem;"> + </p>
									<span class="co-red fs50 fw-b">{{ goodsInfo.integral }}</span>
									<span class="co-333 co-red"
									      style="margin-left: 0.05rem;">{{ shopConfig.integral_name || '积分' }}</span>
								</template>
								<div class="number-box s-flex">x {{ good.buy_number }}</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<!--留言-->
			<section class="bg-fff MT20">
				<div class="discount ML30 MR30 s-flex ai-ct" style="padding:0.4rem 0;">
					<span class="fs24 co-333 MR20">留言</span>
					<input class="fs24" type="text" v-model="formData.remark" maxlength="50"
					       placeholder="选填 （50个字以内）" style="width:6.2rem;">
				</div>
			</section>
			<!--附加信息-->
			<section class="bg-fff MT20" style="padding:0.1rem 0" v-if="Object.keys(total).length>0">
				<div style="padding: 0 0.3rem">
					<div class="fs24 s-flex jc-bt discount">
						<span>商品总额</span>
						<span class="fw-b">￥{{ total.goods_amount }}</span>
					</div>
					<div class="fs24 s-flex jc-bt discount" v-if="total.goods_integral">
						<span>商品积分</span>
						<span class="fw-b">{{ total.goodsIntegral }}</span>
					</div>
					<div class="fs24 s-flex jc-bt discount">
						<span>运费</span>
						<span class="fw-b">+￥{{ total.shipping_fee }}</span>
					</div>
				</div>
			</section>
			<!--支付方式-->
			<section class="bg-fff MT20" v-if="payType.length>0">
				<div class="fs24 s-flex jc-bt discount ML30 MR30" @click="openPay">
					<span>支付方式</span>
					<span class="co-333 fw-b">{{ payType[payTypeIndex].name }}<img style="width:0.11rem;height:0.19rem"
					                                                               class="ML20"
					                                                               src="@/assets/images/arrow-right.png"
					                                                               alt=""></span>
				</div>
			</section>
			<!--底部-->
			<div class="footer-box MT20 breathe">
				<div class="s-flex ai-ct bg-fff jc-fe">
					<section class="s-flex fs28 flex-1 ML30 breathe">
						<form-price :price="total.total_amount" sign_size="28" INT_size="48" DF_size="28"></form-price>
						<template v-if="total.goods_integral">
							<p class="co-333 fs40" style="margin: 0 0.08rem;"> + </p>
							<span class="co-red fs50 fw-b">{{ total.goods_integral }}</span>
							<span class="co-333 co-red" style="margin-left: 0.05rem;">{{shopConfig.integral_name || '积分' }}</span>
						</template>
					</section>
					<div class="breathe">
						<section class="to-buy co-999 fs24" @click="done">
							提交订单
						</section>
					</div>
				</div>
			</div>
		</div>
		<div v-else style="height:100vh;border:1px solid transparent" class="bg-fff">
			<section>
				<p style="width:6rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 MT20 ML20"></p>
				<p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
			</section>
			<section class="MT20">
				<div class="MT10" v-for="i in 2">
					<div class="goods-list s-flex ai-ct">
						<div class="img-box bg-f2"></div>
						<div class="s-flex flex-dir flex-1" style="height:1.82rem">
							<p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB30 bg-f2 ML20"></p>
							<div style="width:2rem;height:0.5rem;border-radius:0.06rem" class="bg-f2 ML20"></div>
						</div>
					</div>
				</div>
			</section>
			<section class="MT20">
				<div style="width:7.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
			<section class="MT20">
				<div style="width:6.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
				<div style="width:6.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
			<section class="MT20">
				<div style="width:5.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
			<section class="MT20">
				<div style="width:4.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
			<section class="MT20">
				<div style="width:3.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
		</div>
		<!--支付方式弹窗-->
		<div class="delivery-box" v-if="showPay">
			<van-popup
				v-model:show="showPay"
				round
				closeable
				close-icon="close"
				position="bottom"
				:close-on-click-overlay="false"
				:style="{ 'height': '8.6rem' }"
			>
				<div class="delivery-title flex jc-bt">
					<h3 class="fs32 co-333 flex-1 ai-ct">支付方式</h3>
				</div>
				<div class="delivery-content">
					<div class="btns-box s-flex ai-ct">
						<div class="btn s-flex ai-ct jc-ct"
						     :class="tempPayType == index?'active':''"
						     v-for="(item,index) in payType"
						     :key="index"
						     @click="tempPayType = index"
						>
							<span>{{ item.name }}</span>
						</div>
					</div>
				</div>
				<div class="btn-box s-flex" @click="choosenPayType">确认</div>
			</van-popup>
		</div>
		<!--收货地址弹窗-->
		<AddressListPopup v-model:show="showAddress" :addressId="formData.user_address_id"
		                  @changeAddress="clickAddressBack"></AddressListPopup>
	</div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, onActivated, getCurrentInstance, nextTick, inject} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import AddressListPopup from "@/components/common/AddressListPopup.vue";

const router = useRouter()
const route = useRoute()
import {appRoute} from "@/router/appRoute.js";
import {isUnLoginCode, isSuccessCode} from "@/utils/constant.js";
import {getCheckoutData, checkoutDone} from "@/api/order.js";

const shopConfig = inject('shopConfig')

const cns = getCurrentInstance().appContext.config.globalProperties

// 状态定义
const title = ref('填写订单')
const address = ref(null) // 收货地址
const goodsInfo = ref({}) // 商品信息
const formData = reactive({
	user_address_id: 0,
	remark: '', // 备注
	payment_method: '' // 支付方式
})
const routeQuery = computed(() => {
	return route.query
})

const total = ref({})

// 支付方式相关
const payType = ref([])
const showPay = ref(false)
const tempPayType = ref(0)
const payTypeIndex = ref(-1)

const placeholder = ref(true)
const doLoading = ref(false)

// 地址相关
const showAddress = ref(false)

const changeAddress = () => {
	showAddress.value = true
}

const openPay = () => {
	tempPayType.value = payTypeIndex.value
	showPay.value = !showPay.value
}

const choosenPayType = () => {
	showPay.value = !showPay.value
	payTypeIndex.value = tempPayType.value
	formData.payment_method = payType.value[payTypeIndex.value].alias
}

const done = () => {
	if (doLoading.value) return false

	doLoading.value = true
	const params = {...routeQuery.value, ...formData}
	checkoutDone(params).then((res) => {
		doLoading.value = false
		if (isSuccessCode(res)) {
			cns.$toast('下单成功')
			setTimeout(() => {
				if (res.data.can_pay) {
					appRoute('payIndex', {no: res.data.no}, 'replace')
				} else {
					appRoute('orderSuccess', {no: res.data.no}, 'replace')
				}
			}, 150)
		} else {
			cns.$dialog.alert({
				message: res.message
			}).then(() => {
				router.back()
			})
		}
	}).catch(() => {
		doLoading.value = false
	})
}

const getData = () => {
	getCheckoutData(Object.keys(routeQuery.value).length ? routeQuery.value : null).then((res) => {
		if (isSuccessCode(res)) {
			placeholder.value = false

			// 商品信息
			goodsInfo.value = res.data.goods

			// 地址信息
			address.value = res.data.user_address
			formData.user_address_id = res.data.user_address !== null ? address.value.id : 0

			// 其他信息
			total.value = res.data.total

			// 支付方式
			payType.value = res.data.payment_methods
			let recommendPay = res.data.payment_methods.filter(item => item.is_recommend)
			if (recommendPay.length > 0) {
				payTypeIndex.value = recommendPay[0].id
				formData.payment_method = recommendPay[0].alias
			}else if (payType.value.length > 0) {
				payTypeIndex.value = 0
				formData.payment_method = payType.value[0].alias
			}
		} else if (isUnLoginCode(res)) {
			appRoute('login', {}, 'replace')
		} else {
			cns.$dialog.alert({
				message: res.message
			}).then(() => {
				router.back()
			})
		}
		window.scrollTo({top: 0})
	})
}

const clickAddressBack = (item) => {
	sessionStorage.setItem('address_id', item.id)
	address.value = item
	formData.user_address_id = item.id
	showAddress.value = false
	getData()
}

onMounted(() => {
	formData.user_address_id = routeQuery.value.user_address_id || sessionStorage.getItem('address_id')
	getData()
})
</script>

<style scoped lang="scss">
/*收货地址*/
.address-box {
	padding: 0.3rem 0.3rem;
	//border-top: 1px solid #e5e5e5;
	background: #fff url("@/assets/images/address/xq-bg.png") repeat-x left bottom;
}

.address-box img {
	width: 0.22rem;
	height: 0.28rem;
}

.address-box > div > p:last-child {
	margin-top: 0.1rem;
}

.address-box > div > p > span {
	margin-right: 0.1rem;
}

.default-addr {
	display: inline-block;
	min-width: 0.5rem;
	height: 0.28rem;
	background: var(--red-color);
	color: #fff;
	font-size: 0.18rem;
	border-radius: 0.04rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.home {
	background-color: #49CF94;
}

.company {
	background-color: #2172F7;
}

.repos {
	background-color: #FEB700;
}

.no-address {
	height: 1.7rem;
}

.img-box {
	width: 1.82rem;
	height: 1.82rem;
	background-position: center;
	background-size: 100% 100%;
	box-shadow: 0 0 15px 0 rgba(233, 233, 233, 0.55);
	border-radius: 10px;
	background-color: #f2f2f2;
}

.img-box img {
	border-radius: 10px;
}

.goods-list {
	padding: 0.2rem 0;
	margin: 0 0.3rem;
}

.goods-msg {
	margin-left: 0.3rem;
	height: 1.82rem;
	justify-content: space-between;
}

.goods-name {
	height: 0.6rem;
	line-height: 0.3rem;
}

.goods-attr {
	height: 0.48rem;
	line-height: 0.24rem;
	color: #999;
}

.shop-name {
	margin-left: 0.15rem;
}

.number-box {
	/*width: 2.2rem;*/
	-webkit-border-radius: 0.04rem;
	-moz-border-radius: 0.04rem;
	border-radius: 0.04rem;
	text-align: center;
	float: right;
	display: flex;
	align-items: center;
}

.minus {
	margin-right: 0.1rem;
	color: #555;
	font-size: 0.36rem;
	font-weight: bold;
}

.number-box > div {
	/*width: 0.4rem;*/
	height: 0.34rem;
	line-height: 0.34rem;
}

.number-box > input {
	width: 0.66rem;
	height: 0.34rem;
	line-height: 0.45rem;
	background: #f5f5f5;
	text-align: center;
	-webkit-border-radius: 0;
	-moz-border-radius: 0;
	border-radius: 0;
}

.plus {
	margin-left: 0.1rem;
	color: #555;
	font-size: 0.36rem;
	font-weight: bold;
}

/*留言*/
.discount {
	padding: 0.3rem 0;
}

.discount > span {
	line-height: 0.24rem;
}

.discount > span > i {
	font-size: 0.24rem;
	line-height: 0.24rem;
	color: #666666;
}

textarea {
	width: 100%;
	resize: none;
}


/*底部*/
.footer-box {
	width: 7.5rem;
	height: 1rem;
	box-sizing: content-box;
}

.footer-box > div {
	width: 7.5rem;
	/*height: 1rem;*/
	border-bottom: 1px solid #e5e5e5;
	position: fixed;
	bottom: 0;
	padding: 0.15rem 0;
}

.footer-box > div > section:first-child {
	width: 1.4rem;
}

.footer-box p {
	text-align: left;
}

.to-buy {
	width: 2.06rem;
	height: 0.68rem;
	line-height: 0.68rem;
	color: #ffffff;
	text-align: center;
	margin-right: 0.3rem;
	background: var(--red-color);
	border-radius: 34px;
}

.to-buy09 {
	opacity: 0.9;
	cursor: not-allowed;
	color: rgba(255, 255, 255, 0.3);
}

/*支付弹框*/
.pay-title {
	padding: 0.3rem 0 0.6rem 0.3rem;
	font-size: 0.32rem;
	color: #333;
}

.pay-state {
	margin: 0 0.3rem 0.4rem;
	width: 6.9rem;
	height: 0.8rem;
	background: #FDF7D9;
	border-radius: 0 40px 40px 0;
	padding: 0 0.4rem 0 0.2rem;
	box-sizing: border-box;
	color: #BD7445;
}

.pay-type-box {
	padding: 0 0.68rem;
}

.pay-type {
	width: 1.65rem;
	height: 0.62rem;
	border-radius: 31px;
	background: #F2F2F2;
	line-height: 0.62rem;
	text-align: center;
	font-size: 0.22rem;
	color: #333;
	margin-right: 0.58rem;
	margin-bottom: 0.3rem;
}

.pay-type:nth-child(3n) {
	margin-right: 0;
}

.act-pay {
	border: 1px solid var(--red-color);
	background: rgba(247, 17, 17, 0.1);
	color: var(--red-color);
}

.btn-box {
	width: 6.94rem;
	height: 0.68rem;
	border-radius: 34px;
	background: var(--red-color);
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	left: 0;
	right: 0;
	margin: auto;
	bottom: 0.15rem;
	color: #fff;
	font-size: 0.24rem;
}

.use-state {
	width: 100%;
	text-align: center;
	padding: 0.4rem 0 0.3rem;
	font-size: 0.3rem;
	color: #333;
}

.list-state-box {
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	padding: 0 0.3rem;
}

.arrowed {
	width: 0.25rem;
	height: 0.25rem;
}

.icon-arrow {
	font-size: 0.32rem !important;
	margin-top: 0.04rem;
}

.goods-box {
	width: 100%;
	height: 1.6rem;
	display: flex;
	box-sizing: border-box;
}

.goods-box:not(:first-child) {
	margin-top: 0.3rem;
}

.goods-box .img-box {
	width: 1.4rem;
	height: 1.4rem;
	vertical-align: middle;
	flex-shrink: 0;
	box-shadow: 0 4px 21px 0 rgba(233, 233, 233, 0.55);
}

.goods-box .img-box img {
	width: 100%;
	height: 100%;
	vertical-align: middle;
}

.goods-box .left {
	flex-shrink: 1;
	flex-grow: 1;
	margin-left: 0.2rem;
	height: 1.6rem;
}

/*无效商品*/
:deep(.van-dialog__content) {
	max-height: 5rem;
	overflow: auto;
}

:deep(.delivery-box) {
	.delivery-title {
		padding: 0.3rem;
		padding-bottom: 0;
	}

	.delivery-content {
		padding: 0.6rem 0.3rem;

		.btns-box {
			.btn {
				width: 2.3rem;
				height: 0.72rem;
				border-radius: 2.93rem;
				background: #F2F2F2;
				margin-right: 0.3rem;

				&.active {
					background: var(--red-color);

					span {
						font-size: 0.24rem;
						color: #FFFFFF;
					}
				}

				span {
					font-weight: 400;
					font-size: 0.22rem;
					color: #333333;
				}
			}
		}

		.tips {
			margin-top: 0.4rem;

			span {
				font-weight: 400;
				font-size: 0.24rem;
				color: #FF8C10;
			}
		}
	}
}
</style>
