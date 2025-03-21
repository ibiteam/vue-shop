<template>
    <main class="home-main-container">
        <section class="home-item-wrapper home-search-wrapper">
            <van-search
                shape="round"
                background="transparent"
                show-action
                placeholder="商品推荐"
            >
                <template #action>
                    <van-button
                        class="home-search-btn"
                        type="primary"
                        size="small"
                        color="var(--main-color)"
                        round
                    >搜索</van-button>
                </template>
            </van-search>
        </section>
        <section class="home-item-wrapper home-swiper-wrapper">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="i in 3">
                    <image-item v-bind="{width: '7.1rem', height: '2rem', radius: '.2rem'}"></image-item>
                </van-swipe-item>
            </van-swipe>
        </section>
        <div class="home-item-wrapper home-menu-swiper-wrapper">
            <horizontal-scroller></horizontal-scroller>
        </div>
        <recommend-column></recommend-column>
    </main>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { shopCommonConfig } from '@/api/common'
import ImageItem from '@/components/goods/image'
import HorizontalScroller from '@/components/swiper/horizontalScroller'
import RecommendColumn from '../components/recommendColumn/RecommendColumn'

onMounted(() => {
    // shopCommonConfig()
})
</script>

<style lang='scss' scoped>
.home-main-container {
    padding-bottom: 1rem;
    .home-item-wrapper {
        width: 100%;
        max-width: 7.5rem;
        padding: 0.2rem .2rem 0;
    }
    .home-search-wrapper {
        :deep(.van-search) {
            padding: 0;
        }
        :deep(.van-search__action) {
            line-height: 100%;
            padding-right: 0;
        }
        .home-search-btn {
            width: 1.2rem;
        }
    }
    .home-swiper-wrapper {
        :deep(.van-swipe__indicator--active) {
            width: .26rem;
            border-radius: .2rem;
        }
    }
    .home-menu-swiper-wrapper{
    }
}
</style>