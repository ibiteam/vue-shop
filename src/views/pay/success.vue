<template>
	<div class="success-wrap s-flex flex-dir" style="height: 100%;">
		<common-header :title="title"></common-header>
		<div class="top-box flex-1">
			<img class="img" src="@/assets/images/pay-success.png" alt="">
			<p class="txt fs28 co-333 fw-b">支付成功！</p>
			<div class="s-flex jc-ct">
				<div class="btn-com btn-left" @click="appRoute('home')">返回首页</div>
				<div class="btn-com btn-right" @click="appRoute('orderList')">我的订单</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { appRoute } from "@/router/appRoute.js";

const title = ref('订单支付成功')

</script>

<style scoped lang="scss">
.top-box {
	padding-top: 0.68rem;
	background: #fff;
	border-radius: 0 0 0.2rem 0.2rem;
	padding-bottom: 0.3rem;
}

.top-box .img {
	display: block;
	width: 2.08rem;
	height: 1.98rem;
	margin: 0 auto 0.58rem;
}

.txt {
	text-align: center;
	padding: 0 0.9rem;
	margin-top: 0.4rem;
}

.btn-com {
	width: 2.4rem;
	height: 0.56rem;
	line-height: 0.56rem;
	text-align: center;
	border-radius: 0.28rem;
	margin: 0.5rem 0;
	box-sizing: border-box;
}

.btn-left {
	border: 0.02rem solid #F71111;
	color: #F71111;
	margin-right: 0.3rem;
}

.btn-right {
	background: linear-gradient(to left, #FA5F5F, #F71111);
	color: #fff;
}
</style>
