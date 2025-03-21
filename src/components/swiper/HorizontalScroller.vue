<template>
    <div class="h-scroll-container">
        <swiper v-bind="swiperOptions" class="h-scroll-wrapper" ref="swiperRef">
            <swiper-slide class="scroll-item" v-for="(i,index) in items" :key="index">
                <image-item v-bind="{width: '0.9rem', height: '0.9rem', src: i.icon}"></image-item>
                <van-text-ellipsis class="subtitle" :content="i.name" rows="1" />
            </swiper-slide>
        </swiper>
        <div class="swiper-scrollbar"></div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import ImageItem from '@/components/goods/image'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Scrollbar } from "swiper/modules"
import 'swiper/css';

const items = ref([
    { name: '我的奖励', icon: '	https://cdn.toodudu.com/2023/12/06/IGVUxefnbjMU4CtmlhHNPiJ7g2zFHpCBjQlcocUU.png' },
    { name: '帮助中心', icon: 'https://cdn.toodudu.com/2023/12/06/QzOPuvlpn2QUHZ4lGIWDjNrUVqIibJnEa9PLfW8b.png' },
    { name: '邀请有奖', icon: 'https://cdn.toodudu.com/2023/12/06/LvYetbeiDCcnMrjv6sU3DagXiDHxeRVZNu7y1HOC.png' },
    { name: '分享APP', icon: 'https://cdn.toodudu.com/2023/12/06/UPsbgAkCw9KDaZNA13pHQ1oSYFwIwWdBxt4vWYeU.png' },
    { name: '官方客服', icon: 'https://cdn.toodudu.com/2023/12/06/J7hJOuXwteR8Ub62QROOTZ63vSPv4Bpgeslc0PRz.png' },
    { name: '服务商入驻', icon: 'https://cdn.toodudu.com/2023/12/06/EJzz3e2TvdmAHrg3xLCoR6EvFV56k6ws1vlUj8m6.png' },
]);

const swiperOptions = ref({
    slidesPerView: 5,
    freeMode: true,
    freeModeSticky: true,
    slidesPerView: 'auto',
    scrollbar: {
        el: '.swiper-scrollbar',
    },
    modules: [Scrollbar],
})



onMounted(() => {
});

onUnmounted(() => {
})
</script>
  
<style scoped lang="scss">
.h-scroll-container {
    width: 100%;
    height: 100%;
    position: relative;
    .h-scroll-wrapper {
        width: 100%;
        padding: 0.1rem 0.2rem 0.2rem 0.2rem;
        background-color: #fff;
        border-radius: 0.2rem;
        box-sizing: border-box;
        .scroll-item {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }
    .swiper-scrollbar {
        width: 0.6rem;
        height: 0.08rem;
        background: #f1f1f1;
        border-radius: 0.05rem;
        overflow: hidden;
        position: absolute;
        left: 50%;
        bottom: 0.14rem;
        margin-left: -0.32rem;
        z-index: 1;
        :deep(.swiper-scrollbar-drag) {
            height: 0.08rem;
            background: var(--main-color);
            -webkit-transition: all 0.6s;
            transition: all 0.6s;
            position: absolute;
            left: 0;
        }
    }
}
    
</style>