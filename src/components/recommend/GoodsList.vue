<template>
	<div class="goods-box">
		<div class="goods-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
			<div class="goods-item-img">
				<van-image :src="item.image" class="re-img">
					<template v-slot:loading>
						<img src="@/assets/images/common/no-pic.png" alt="" class="re-img">
					</template>
					<template v-slot:error>
						<img src="@/assets/images/common/no-pic.png" alt=""
						     class="re-img">
					</template>
				</van-image>
			</div>
			<div class="MT10" style="padding: 0 0.15rem;">
				<div class="item-name fs26 co-333 elli-2">
					<van-tag color="linear-gradient(90deg, #5436D5 4%, #735CFF 99%)" v-if="item.label">{{item.label}}</van-tag>{{ item.name }}
				</div>
				<div style="margin-bottom: 0.14rem;" class="s-flex ai-ct jc-bt">
					<div class="s-flex ai-ct">
						<form-price :price="item.price" :unit="item.unit" unit_color="#333" weight="bold"></form-price>
						<template v-if="item.integral">
							<p class="co-333 fs28" style="margin: 0 0.08rem;"> + </p>
							<span class="co-red fs28 fw-b">{{ item.integral }}</span>
							<span class="co-333 co-red" style="margin-left: 0.05rem;">{{ shopConfig.integral_name || '积分' }}</span>
						</template>
					</div>
					<div class="co-666"><span v-if="item.sales_volume">已售{{item.sales_volume}}</span></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {appRoute} from "@/router/appRoute.js";
import {inject} from "vue";
const shopConfig = inject('shopConfig')
defineProps({
	list: {
		type: Array,
		default: () => []
	}
})

const toDetail = (data) => {
	appRoute('good', {goods_no: data.no})
}
</script>

<style scoped lang="scss">
/*推荐*/
.goods-box {
	padding: 0.2rem 0.2rem;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 0.2rem;

	.goods-item {
		border-radius: 0.1rem;
		overflow: hidden;
		background: #fff;
		padding-bottom: 0.1rem;

		.re-img {
			width: 100%;
			height: 3.45rem;
			border-radius: 5px 5px 0 0;
		}

		.goods-item-img {
			width: 100%;
			height: 3.45rem;
		}

		.item-name {
			width: 3.15rem;
			height: 0.72rem;
			line-height: 0.36rem;
			margin-bottom: 0.1rem;

			span {
				margin-right: 0.1rem;
				font-size: 0.2rem;
				padding: 0 0.1rem;
			}
		}
	}
}
</style>