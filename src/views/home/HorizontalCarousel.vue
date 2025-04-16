<template>
    <div class="ad-wrapper home-item-wrapper">
        <div class="ad-swiper">
            <swiper v-if="content.style == 2" v-bind="{
                slidesPerView: 3,
                spaceBetween: 0,
                centeredSlides: true,
                autoplay: {
                    'delay': (content.interval || 3) * 1000,
                    'disableOnInteraction': false,
                    'waitForTransition': true,
                },
                loop: content.items.length >= 3 ? true : false,
                pagination: {
                    'clickable': true,
                },
                modules: swiperModules
            }" class="cards-swiper">
                <template v-if="content.items.length <= 3">
                    <swiper-slide class="scroll-item" v-slot="{ isActive }" v-for="(item, index) in [...content.items, ...content.items, ...content.items, ...content.items]" :key="index">
                        <common-image v-bind="{fit: isActive ? 'fill' : 'cover', src: item.image, width: '100%', height: (content.height / 100) + 'rem', radius: '0'}" />
                    </swiper-slide>
                </template>
                <swiper-slide v-else class="scroll-item" v-slot="{ isActive }" v-for="(item, index) in content.items" :key="index">
                    <common-image v-bind="{fit: isActive ? 'fill' : 'cover', src: item.image, width: '100%', height: (content.height / 100) + 'rem', radius: '0'}" />
                </swiper-slide>
            </swiper>
            <!-- 平铺 -->
            <swiper v-if="content.style == 1" v-bind="{
                slidesPerView: 1,
                spaceBetween: 0,
                autoplay: {
                    'delay': (content.interval || 3) * 1000,
                },
                loop: content.items.length >= 3 ? true : false,
                pagination: {
                    'clickable': true,
                },
                modules: swiperModules
            }" class="scroll-wrapper">
                <swiper-slide class="scroll-item" v-for="(item, index) in content.items" :key="index" style="width: 100%;">
                    <common-image
                        v-bind="{src: item.image, width: '100%', height: (content.height / 100) + 'rem', radius: '0.2rem'}"
                        @click.stop="handleOpenLink(item.url)"
                    />
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay,Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const cns = getCurrentInstance().appContext.config.globalProperties
const swiperModules = [Autoplay, Pagination]
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

const handleOpenLink = (res) => {
    res.value && cns.$bus.emit('homeOpenLink', res.value)
}

</script>

<style lang='scss' scoped>
.ad-wrapper{
    // padding: 0.1rem 0.2rem 0.1rem;
    // position: relative;
    .ad-item {
        border-radius: 0.2rem;
    }
    .ad-swiper {
        width: 100%;
        overflow-x: hidden;
    }
    .cards-swiper {
        width: 100%;
        .swiper-slide {
            transition: transform 0.3s ease;
            overflow: hidden;
        }
        .swiper-slide-active {
            transform: scale(2.5,1);
            z-index: 1;
        }
        .swiper-slide-prev,
        .swiper-slide-next {
            transform: scale(0.9);
            opacity: 0.3;
        }
    }
}
</style>