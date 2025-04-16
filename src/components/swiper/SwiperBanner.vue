<template>
	<div class="banner-wrap">
		<swiper v-if="list.length" v-bind="{
                slidesPerView: 1,
                spaceBetween: 0,
                autoplay: {
                    'delay': 3000,
                },
                loop: loop,
                pagination: {
                    'clickable': true,
                },
                modules: swiperModules
            }" class="scroll-wrapper">
			<swiper-slide class="scroll-item" v-for="(item, index) in list" :key="index" style="width: 100%;">
				<common-image v-bind="{src: item.image, width: '100%', height: '2rem', radius: '0.2rem'}" @click.stop="linkUrl(item.url)"/>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay,Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const swiperModules = [Autoplay, Pagination]

defineProps({
	list: {
		type: Array,
		default: () => []
	},
	loop: {
		type: Boolean,
		default: true
	}
})

const linkUrl = (url) => {
	url.value && window.open(url.value)
}
</script>

<style scoped lang="scss">
.banner-wrap{
	width: 100%;
	padding: 0 0.2rem;
	:deep(.swiper-pagination-bullet){
		height: 8px;
		width: 8px;
		border-radius: 4px;
	}
	:deep(.swiper-pagination-bullet-active){
		width: 0.4rem;
		background: #fff;
	}
}
</style>