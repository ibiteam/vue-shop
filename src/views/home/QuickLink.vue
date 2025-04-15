<template>
    <div class="quick-link-wrapper home-item-wrapper">
        <swiper v-bind="{
            slidesPerView: content.column,
            slidesPerGroup: content.column,
            pagination: {
                'clickable': true,
            },
            grid: {
                'fill': 'row',
                'rows': content.row
            },
            modules: swiperModules
        }" class="scroll-wrapper">
            <swiper-slide class="scroll-item" v-for="(item, index) in content.items" :key="index">
                <div class="link-item s-flex ai-ct jc-ct flex-dir" @click.stop="handleOpenLink(item.url)">
                    <common-image
                        v-bind="{src: item.image, width: '0.9rem', height: '0.9rem'}" 
                    />
                    <p class="elli-1 title">{{item.title}}</p>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const cns = getCurrentInstance().appContext.config.globalProperties
const swiperModules = [Pagination]
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
.quick-link-wrapper{
    padding: 0.1rem 0.2rem 0.1rem;
    position: relative;
    :deep(.swiper-pagination-bullets.swiper-pagination-horizontal) {
        bottom: 0;
    }
    .scroll-wrapper {
        width: 100%;
        background: #fff;
        border-radius: 10px;
        padding-top: 10px;
        .link-item {
            margin-bottom: 10px;
            .title {
                width: 100%;
                height: 20px;
                line-height: 20px;
                text-align: center;
            }
        }
    }
}
</style>