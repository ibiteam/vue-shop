<template>
	<div class="pay-wrap">
		<common-header :title="title"></common-header>
		<section v-if="!isLoading">
			<!--订单信息-->
			<div class="order-box MB20">
				<div class="ord-item">
					<span class="co-333 fs28">订单号：</span>
					<span class="co-333 fs28">{{ info.order_sn }}</span>
				</div>
				<div class="ord-item">
					<span class="co-333 fs28">下单时间：</span>
					<span class="co-333 fs28">{{ info.created_at }}</span>
				</div>
				<div class="ord-item">
					<span class="co-333 fs28">应付款总金额：</span>
					<span class="co-red fs28">￥{{ info.order_amount }}</span>
				</div>
			</div>
			<!--在线支付-->
			<div class="pay-box MB20" v-if="payments.length>0">
				<div class="pay-tit fs32 co-333">在线支付</div>
				<div class="pay-item s-flex ai-ct jc-bt" v-for="item in payments" :class="item.can_use ? '' : 'act-bg'"
				     @click="selectPay(item,true)">
					<div class="s-flex ai-ct">
						<img class="pay-img" :src="item.icon" alt="">
						<div class="middle">
							<div class="midd-tit fs28 co-333 MB10">{{ item.name }}</div>
							<div class="fs24 co-666">{{ item.description }}</div>
						</div>
					</div>
					<div class="sele-box" v-if="item.can_use">
						<img v-if="payInfo.pay_alias === item.alias" src="@/assets/images/cart/select.png" alt="">
						<img v-else src="@/assets/images/cart/select-no.png" alt="">
					</div>
				</div>
			</div>
			<!--确定-->
			<div class="sure-box">
				<van-button class="sure" size="small" type="primary" :disabled="!payInfo.pay_alias" @click="wechatPay">
					确认支付
				</van-button>
			</div>
		</section>
		<section v-else style="height:100vh;border:1px solid transparent" class="bg-fff">
			<section class="">
				<p style="width:6rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 MT20 ML20"></p>
				<p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
				<p style="width:3rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
			</section>
			<section style="margin-top: 0.6rem;">
				<p style="width:6rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 MT20 ML20"></p>
				<p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
			</section>
			<section style="margin-top: 0.7rem;">
				<div style="width:7.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
			<section class="MT20">
				<div style="width:6.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
			<section class="MT20">
				<div style="width:5.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
			<section class="MT20">
				<div style="width:4.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
			</section>
		</section>
	</div>
</template>

<script setup>
import {ref, onMounted, getCurrentInstance} from 'vue'
import {useRoute} from 'vue-router'
import {payInit,wxPay} from '@/api/order.js'
import { isUnLoginCode, isSuccessCode} from "@/utils/constant.js";
import { appRoute } from "@/router/appRoute.js";

const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()

const title = ref('收银台')
const isLoading = ref(true)
const orderSn = ref(route.query.order_sn)
const info = ref({})
const payments = ref([])
const payInfo = ref({
	order_sn: '',
	pay_amount: '',
	pay_alias: ''
})

const getData = () => {
	payInit(orderSn.value).then((res) => {
		if (isSuccessCode(res)) {
			isLoading.value = false
			info.value = res.data.order
			payments.value = res.data.payments
			let isRecommendPay = payments.value.filter(item => item.is_recommend)
			if (isRecommendPay.length) {
				payInfo.value.pay_alias = isRecommendPay[0].alias
			} else if (payments.value.length) {
				payInfo.value.pay_alias = payments.value[0].alias
			}
		} else if (isUnLoginCode(res)) {
			appRoute('login')
		} else {
			cns.$dialog.alert({
				message: res.message
			}).then(() => {
				appRoute('orderList', {}, 'replace')
			})
		}
	})
}

// 选择付款方式
const selectPay = (item) => {
	payInfo.value.pay_alias = item.alias
}

// 微信支付
const wechatPay = () => {
	let info = {
		order_sn: orderSn.value,
	}
	const ua = navigator.userAgent.toLowerCase()
	const isWeixin = ua.indexOf('micromessenger') != -1
	if (isWeixin) {
		info.pay_form = 'wechat'
	} else {
		info.pay_form = 'h5'
	}
	wxPay(info).then((res) => {
		if (isSuccessCode(res)) {
			if (info.pay_form == 'wechat') {
				// 微信网页版支付
				payment(res.data.payment)
			} else if (info.pay_form == 'h5') {
				// h5支付
				window.location.href = res.data.payment
			}
		} else {
			cns.$dialog.alert({message: res.message})
		}
	})
}

const payment = (payment) => {
	function onBridgeReady() {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', payment,
			function (res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					// 跳转页面
					appRoute('orderList', {}, 'replace')
				}
			})
	}

	if (typeof WeixinJSBridge == "undefined") {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
			document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
		}
	} else {
		onBridgeReady()
	}
}

onMounted(() => {
	getData()
})
</script>

<style scoped lang="scss">
.pay-wrap {
	border-bottom: 1px solid transparent;

	.order-box {
		width: 100%;
		padding: 0.2rem 0.3rem;
		background: #fff;
		box-sizing: border-box;
		border-radius: 0 0 0.2rem 0.2rem;

		.ord-item {
			line-height: 0.54rem;
		}
	}

	/*在线支付*/
	.pay-box {
		padding: 0.2rem 0;
		width: 100%;
		background: #fff;
		border-radius: 0.2rem;

		.pay-tit {
			font-size: 0.30rem;
			color: #333;
			line-height: 0.5rem;
			padding-left: 0.2rem;
			margin-bottom: 0.2rem;
		}

		.pay-item {
			height: 1.4rem;
			padding: 0 0.28rem;
			width: 100%;
			box-sizing: border-box;
		}

		.pay-item.act-bg {
			background: var(--page-bg-color);
		}

		.pay-img {
			width: 0.62rem;
			height: 0.54rem;
		}

		.middle {
			margin-left: 0.2rem;
		}

		.sele-box img {
			width: 0.4rem;
			height: 0.4rem;
		}

		.sele-box-btn span {
			width: 1.5rem;
			height: 0.60rem;
			line-height: 0.60rem;
			border: 1px solid var(--red-color);
			display: inline-block;
			text-align: center;
			border-radius: 0.31rem;
			color: var(--red-color);
			font-size: 0.26rem;
		}
	}

	/*确定*/
	.sure-box {
		width: 7.5rem;
		height: 1.06rem;
		display: flex;
		justify-content: center;

		:deep(.van-button) {
			position: fixed;
			bottom: 0;
			margin-bottom: 0.38rem;
			width: 6.94rem;
			height: 0.68rem;
			border-radius: 0.34rem;
			background: var(--red-color);
			border: 1px solid transparent !important;
			font-size: 0.24rem;
		}
	}
}

</style>
