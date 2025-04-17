<template>
	<div>
		<common-header :title="title"></common-header>
		<div style="padding-top: 0.2rem;">
			<SwiperBanner :list="banner"></SwiperBanner>
		</div>
		<GoodsList :list="goodsList"></GoodsList>
	</div>
</template>

<script setup>
import {ref, onMounted, inject} from "vue";
import { useRoute } from "vue-router";
import SwiperBanner from "@/components/swiper/SwiperBanner.vue";
import GoodsList from "@/components/recommend/GoodsList.vue";
import { getSpecialData } from '@/api/home.js'
import { isSuccessCode } from "@/utils/constant.js";
import {toast} from "@/utils/toast.js";

const route = useRoute()

const title = ref('')
const banner = ref([
	{
		"url": {
			"name": "支付成功",
			"value": "https://vue-shop.ptdmeta.cn/pay/success"
		},
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/15/mkwvoUoUNysZh36ZDxRwantr9YNbCCKrGAX5i08W.jpg",
		"is_show": 1,
		"date_type": 1,
		"time": []
	},
	{
		"url": {
			"name": "支付成功",
			"value": "https://vue-shop.ptdmeta.cn/pay/success"
		},
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/15/z5ei2hijBO8xtSvMaHGKC3yglgBHFQsrDRTPfb9a.jpg",
		"is_show": 1,
		"date_type": 1,
		"time": []
	},
	{
		"url": {
			"name": "下单成功",
			"value": "https://vue-shop.ptdmeta.cn/order/success"
		},
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/15/gVmlLzb91AlJg46Y42BQ1LzJ34X4RtWmGZdhXI5X.jpg",
		"is_show": 1,
		"date_type": 1,
		"time": []
	}
])

const goodsList = ref([])

onMounted(()=>{
	const id = route.query.id
	getSpecialData(id).then(res=>{
		if(isSuccessCode(res)){
			title.value = res.data.title
			goodsList.value = res.data.goods_list
			banner.value = res.data.banner
		}else {
			toast(res.message)
		}
	})
})

</script>

<style scoped lang="scss">
.special-header {
	background: #fff;
	height: 0.98rem;
	padding: 0 0.2rem;
	.view-input {
		height: 0.6rem;
		width: 6rem;
		line-height: 0.6rem;
		padding: 0 0.2rem;
		background-color: #F4F4F4;
		border-radius: 0.3rem;
		font-size: 0.28rem;
		color: #9C9C9C;
		flex: none;
		.iconfont {
			margin-right: 0.24rem;
		}
	}
}
</style>