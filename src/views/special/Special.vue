<template>
	<div>
		<common-header title="超市"></common-header>
		<div style="padding-top: 0.2rem;">
			<SwiperBanner :list="banner"></SwiperBanner>
		</div>
		<GoodsList :list="goodsList"></GoodsList>
	</div>
</template>

<script setup>
import { ref ,onMounted } from "vue";
import { appRoute } from "@/router/appRoute.js";
import { useRouter } from "vue-router";
import SwiperBanner from "@/components/swiper/SwiperBanner.vue";
import GoodsList from "@/components/recommend/GoodsList.vue";

const router = useRouter()


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

const goodsList = ref([
	{
		"no": "5769f804-94ea-4564-ac33-65857eeb6629",
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/08/2025/04/08/v1o6GdUhmGH84kNt0a0dIPiYWF9xGFvQSFAITb5R.jpg",
		"name": "华为 mate 60 pro",
		"price": "6999.00",
		"label": "折扣",
		"sub_name": "本商品可支持申请国家补贴",
		"sales_volume": null
	},
	{
		"no": "b7841a73-5341-46eb-9856-9f0bcc305063",
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/02/zyY1K9aWwpQbZCTfWEkS1PpPIFP9g9jNlyIJ55aj.jpg",
		"name": "懒人沙发",
		"price": "0.01",
		"label": "热卖",
		"sub_name": "懒人沙发平价款",
		"sales_volume": null
	},
	{
		"no": "85922ff0-d32e-4a89-9c51-e3c2bb825f96",
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/02/Bzn4Qptn1gaUr8S7aOkd20c3P7DOWz88CsqeXeMn.jpg",
		"name": "懒人沙发",
		"price": "1399.00",
		"label": "热卖",
		"sub_name": "懒人沙发",
		"sales_volume": null
	},
	{
		"no": "790fde4a-a1b3-4f64-8b8a-314ea762ef65",
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/02/N9Tk9WAyWv8pfyp6VAUNDCHxNQZfNYst7YBS0bXf.jpg",
		"name": "戴尔",
		"price": "2399.00",
		"label": "推荐",
		"sub_name": "戴尔台式机",
		"sales_volume": null
	},
	{
		"no": "a571d598-8d69-4a94-970a-397a057adda0",
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/02/1Hg5cn8r7Ot3X0Z2fvMNcjMX01hGqUXovkX7F6CN.jpg",
		"name": "小米100",
		"price": "299.00",
		"label": "热卖",
		"sub_name": "高清液晶电视",
		"sales_volume": null
	},
	{
		"no": "bedae4a8-7413-41a8-9c54-f51a1a6e5f12",
		"image": "https://laravel-shop.ptdmeta.cn/storage/manage/2025/04/01/MxwQZrlgaeP2HMRupRReZmD87JGUplIcjFFPjvH0.jpg",
		"name": "华为低端机",
		"price": "1999.00",
		"label": "推荐",
		"sub_name": "华为低端机，物有所值的一款！",
		"sales_volume": null
	}
])
const handleBack = () => {
	router.back(-1)
}

const clickToSearch = () => {
	appRoute('search_history', {placeholder: ''})
}
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