<template>
	<div class="back-top" @click="setTop" v-if="showBackTop">
		<div class="back-top-con">
			<span class="iconfont">&#xe60c;</span>
		</div>
	</div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'

const showBackTop = ref(false);
const setTop = () => {
	document.documentElement.scrollTop = document.body.scrollTop = 0;
}

const scrolls = () => {
	const sTop = window.scrollY || document.documentElement.scrollTop;
	showBackTop.value = sTop > 350;
};

onMounted(() => {
	window.addEventListener('scroll', scrolls);
})

onBeforeUnmount(() => {
	window.removeEventListener('scroll', scrolls);
})
</script>

<style scoped lang="scss">
.back-top{
	position: fixed;
	right: 0.2rem;
	bottom: 1.4rem;
	width: 0.52rem;
	height: 0.52rem;
	background: #f2f2f2;
	border-radius: 0.26rem;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
</style>