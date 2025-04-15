<template>
	<div class="recommend" id="recommend" style="padding: 0 0.2rem;">
		<div class="re-tit s-flex ai-ct jc-ct">
			<img class="re-tit-img" src="@/assets/images/common/recommend-left.png" alt="">
			<span class="co-333 fs28 MR30 ML30">为您推荐</span>
			<img class="re-tit-img" src="@/assets/images/common/recommend-right.png" alt="">
		</div>
		<van-list v-model:loading="loading" :finished="finished" @load="loadRecommend" finished-text="没有更多了"
		          :immediate-check="false" :offset="50">
			<div class="recommend-box" style="padding: 0;">
				<div class="recommend-item" v-for="(item, index) in recommend" :key="index"
				     style="border-radius: 0.2rem;overflow: hidden;" @click="toDetail(item)">
					<div class="recommend-item-img">
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
							{{ item.name }}
						</div>
						<div style="margin-bottom: 0.14rem;" class="s-flex ai-ct jc-bt">
							<form-price :price="item.price" :unit="item.unit" unit_color="#333" weight="bold"></form-price>
						</div>
					</div>
				</div>
			</div>
		</van-list>
	</div>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue'
import {getRecommend} from '@/api/common.js'
import {appRoute} from "@/router/appRoute.js";
import {isSuccessCode} from "@/utils/constant.js";

const recommend = ref([]);
const loading = ref(false);
const finished = ref(false);

const pageInfo = ref({
	total: 0,
	per_page: 6,
	current_page: 1
})

const countLastPage = () => {
	return (pageInfo.value.total % pageInfo.value.per_page ? 1 : 0) + Math.floor(pageInfo.value.total / pageInfo.value.per_page)
}

const loadRecommend = () => {
	loading.value = true
	let {current_page} = pageInfo.value
	getRecommend({page: current_page}).then(res => {
		loading.value = false
		if (isSuccessCode(res)) {
			recommend.value = recommend.value.concat(res.data.list)
			pageInfo.value = res.data.meta
			if (res.data.meta.current_page == countLastPage()) {
				finished.value = true
			} else {
				pageInfo.value.current_page++
			}
		}else {
			finished.value = false
		}
	})
}
const toDetail = (data) => {
	appRoute('good', {goods_no: data.no})
}

onMounted(() => {
	loadRecommend()
})

</script>

<style scoped lang="scss">
.recommend {
	.re-tit {
		width: 100%;
		padding: 0.26rem 0 0.26rem;

		.re-tit-img {
			width: 0.36rem;
			height: 0.3rem;
		}
	}

	/*推荐*/
	.recommend-box {
		padding: 0 0.2rem;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.2rem;

		.recommend-item {
			border-radius: 0.2rem;
			overflow: hidden;
			background: #fff;
			padding-bottom: 0.1rem;

			.re-img {
				width: 100%;
				height: 3.5rem;
				border-radius: 5px 5px 0 0;
			}

			.recommend-item-img {
				width: 100%;
				height: 3.5rem;
			}

			.item-name {
				width: 3.15rem;
				height: 0.72rem;
				line-height: 0.36rem;
				margin-bottom: 0.1rem;

				span {
					line-height: 0.36rem;
					height: 0.36rem;
					margin-right: 0.1rem;
					min-width: auto;
					font-size: 0.2rem;
					padding: 0 0.1rem;
				}
			}
		}
	}
}
</style>