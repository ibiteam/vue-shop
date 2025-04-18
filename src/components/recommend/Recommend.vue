<template>
	<div class="recommend" id="recommend">
		<div class="re-tit s-flex ai-ct jc-ct">
			<img class="re-tit-img" src="@/assets/images/common/recommend-left.png" alt="">
			<span class="co-333 fs28 MR30 ML30">为您推荐</span>
			<img class="re-tit-img" src="@/assets/images/common/recommend-right.png" alt="">
		</div>
		<van-list v-model:loading="loading" :finished="finished" @load="loadRecommend" finished-text="没有更多了" :immediate-check="false" :offset="50">
			<GoodsList :list="recommend"></GoodsList>
		</van-list>
	</div>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue'
import GoodsList from "@/components/recommend/GoodsList.vue";
import {getRecommend} from '@/api/common.js'
import {appRoute} from "@/router/appRoute.js";
import {isSuccessCode} from "@/utils/constant.js";

const recommend = ref([]);
const loading = ref(false);
const finished = ref(false);

const props = defineProps({
	no:{
		type: String,
		default: ''
	}
})
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
	getRecommend({page: current_page, no: props.no}).then(res => {
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


onMounted(() => {
	loadRecommend()
})

</script>

<style scoped lang="scss">
.recommend {
	.re-tit {
		width: 100%;
		padding: 0.2rem 0 0.1rem;

		.re-tit-img {
			width: 0.36rem;
			height: 0.3rem;
		}
	}


}
</style>