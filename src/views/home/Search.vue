<template>
    <div class="search-wrapper home-item-wrapper s-flex ai-ct jc-bt">
        <div class="search-logo" v-if="content.logo">
            <common-image v-bind="{ src: content.logo, width: '1.6rem', height: '0.6rem', radius: '0' }"></common-image>
        </div>
        <div class="search-input s-flex ai-ct jc-bt flex-1" @click="handleSearch">
            <swiper v-if="content.items?.length" v-bind="{
                direction: 'vertical',
                autoplay: {
                    'delay': (content.interval || 3) * 1000,    
                },
                loop: content.items.length >= 3 ? true : false,
                modules: swiperModules,
            }" 
            @swiper="onSwiper"
            class="search-swiper">
                <swiper-slide class="scroll-item" v-for="(item, index) in content.items" :key="index">
                    <div class="search-placeholder" > {{ item.title }} </div>
                </swiper-slide>
            </swiper>
            <div class="search-placeholder" v-else> {{ content.keywords }} </div>
            <div class="search-btn" :style="{color: '#fff', backgroundColor: content.button_color}">搜索</div>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { appRoute } from "@/router/appRoute.js";
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const cns = getCurrentInstance().appContext.config.globalProperties
const swiperModules = [Autoplay]
const props = defineProps({
    content: {
        type: Object,
        default: () => {
            return {}
        }
    },
})

const swiperRef = ref(null)

const onSwiper = (swiper) => {
    swiperRef.value = swiper
}

const handleSearch = () => {
    if (swiperRef.value) {
        const {activeIndex} = swiperRef.value
        if (props.content.items[activeIndex].url.value) {
            cns.$bus.emit('homeOpenLink', props.content.items[activeIndex].url?.value)
            return
        }
        // props.content.items[activeIndex].url?.value && cns.$bus.emit('homeOpenLink', props.content.items[activeIndex].url?.value)
    }
    appRoute('search_history', {keywords: props.content.keywords})
}
</script>

<style lang='scss' scoped>
.search-wrapper{
    padding: 0.2rem 0.2rem 0.1rem;
    .search-logo {
        max-width: 1.6rem;
        max-height: 0.6rem;
        margin-right: 0.08rem;
        overflow: hidden;
    }
    .search-input {
        height: 0.66rem;
        padding: 0 0.08rem 0 0.16rem;
        box-sizing: border-box;
        background: #fff;
        border-radius: 0.3rem;
        overflow: hidden;
    }
    .search-swiper {
        flex: 1;
        height: 0.66rem;
        border-radius: 0.3rem;
    }
    .search-placeholder {
        color: #c1c1c1;
        line-height: 0.66rem;
    }
    .search-btn {
        width: 1.2rem;
        height: 0.56rem;
        line-height: 0.56rem;
        text-align: center;
        color: #fff;
        border-radius: 0.3rem;
    }
}
</style>