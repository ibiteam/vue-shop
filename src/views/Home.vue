<template>
    <main class="home-main-container">
        <HomeSearch v-if="findNotForData('home_nav')" v-bind="{content: findNotForData('home_nav')}"></HomeSearch>
        <template v-for="(item, index) in decoration.content">
            <HorizontalCarousel v-if="item.component_name == 'horizontal_carousel'" :key="index" v-bind="{content: item}"></HorizontalCarousel>
            <QuickLink v-if="item.component_name == 'quick_link'" :key="index" v-bind="{content: item}"></QuickLink>
            <AdvertisingBanner v-if="item.component_name == 'advertising_banner'" :key="index" v-bind="{content: item}"></AdvertisingBanner>
            <GoodsRecommend v-if="item.component_name == 'goods_recommend'" :key="index" v-bind="{content: item}"></GoodsRecommend>
            <Recommend v-if="item.component_name == 'recommend'" :key="index" v-bind="{content: item}"></Recommend>

        </template>
    </main>
</template>

<script setup>
// import "@/assets/css/iconfont-public.css"
import { ref, reactive, onMounted, nextTick, getCurrentInstance, onUnmounted } from 'vue'
import HomeSearch from '@/views/home/Search'
import HorizontalCarousel from '@/views/home/HorizontalCarousel'
import QuickLink from '@/views/home/QuickLink'
import AdvertisingBanner from '@/views/home/AdvertisingBanner'
import GoodsRecommend from '@/views/home/GoodsRecommend'
import Recommend from '@/views/home/Recommend'
import { getHomeData } from '@/api/home'
import {isSuccessCode} from "@/utils/constant.js";

const cns = getCurrentInstance().appContext.config.globalProperties
const decoration = reactive({
    content: [],
    not_for_data: [],
    temp_index: ''
})

// 查找固定数据
const findNotForData = (component_name) => {
    return decoration.not_for_data.find(item => item.component_name === component_name)
}

onMounted(() => {
    getHomeData().then(res => {
        if (isSuccessCode(res)) {
            decoration.data = res.data
            const { home_nav, danping_advertisement, suspended_advertisement, content } = res.data
            decoration.content = content
            decoration.not_for_data = [
                home_nav,
                danping_advertisement,
                suspended_advertisement
            ]
            let title = document.querySelector('meta[property="og:title"]')
            title.content = res.data.title || ''
            let meta_description = document.querySelector('meta[property="og:description"]')
            meta_description.content = res.data.description || ''
            let meta_keywords = document.querySelector('meta[property="og:keywords"]')
            meta_keywords.content = res.data.keywords || ''
        }
    })
    nextTick(() => {
        nextTick(() => {
            cns.$bus.on('homeOpenLink', (res) => {
                window.open(res, '_self')
            })
        })
    })
})

onUnmounted(() => {
    cns.$bus.off('homeOpenLink')
})

</script>

<style lang="scss">
// 公用swiper分页样式
.swiper-pagination{
    .swiper-pagination-bullet{
        width: 0.12rem;
        height: 0.12rem;
        border-radius: 50%;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
        background: #E2E2E2;
        opacity: 1;
    }
    .swiper-pagination-bullet-active {
        width: 0.26rem;
        border-radius: 0.4rem;
        background-color: var(--main-color);
    }
}
.home-item-wrapper {
    padding: 0.1rem 0.2rem 0.1rem;
    position: relative;
}
</style>
<style lang='scss' scoped>
.home-main-container {
    padding-bottom: 1rem;
}
</style>