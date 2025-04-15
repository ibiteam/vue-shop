<template>
    <div class="ad-banner-wrapper home-item-wrapper">
        <div class="ad-item"
            :style="{
                backgroundColor: content.background && content.background_color ? content.background_color : '',
                padding: content.background ? '0.2rem 0.2rem 0 0.2rem' : '',
                borderRadius: content.background ? '0.2rem' : '',
            }"  
        >
            <div class="ad-title-wrapper s-flex" v-if="content.title.name || content.title.image || content.title.suffix || content.title.url.value" :class="content.title.align == 'center' ? 'jc-ct' : 'jc-fs'" style="margin-bottom: 0.2rem;">
                <div class="ad-title s-flex ai-ct jc-ct" >
                    <common-image v-if="content.title.image" v-bind="{ src: content.title.image, width: '0.32rem', height: '0.32rem', radius: '0' }" style="margin-right: 0.12rem;"/>
                    <span class="fs28 fw-b" :style="{color: content.title.color}">{{content.title.name}}</span>
                </div>
                <div class="ad-title-link s-flex ai-ct fs24" @click.stop="handleOpenLink(content.title.url)">
                    {{ content.title.suffix }}<em class="iconfont" style="font-size: .2rem;" v-if="content.title.url.value">&#xe773;</em>
                    
                </div>
            </div>
            <div class="ad-banner-wrapper s-flex ai-ct jc-bt flex-wrap">
                <div v-for="(item, index) in content.items" :key="index" 
                    :style="{
                        width: (content.width - (content.background ? '10' : 0)) / 100 + 'rem',
                        marginBottom: (content.background ? '0.2rem' : 0)
                    }"
                >
                    <common-image 
                        v-bind="{
                            src: item.image,
                            width: '100%',
                            height: (content.height / 100 ) + 'rem', 
                            radius: '0'
                        }"
                        @click.stop="handleOpenLink(item.url)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const cns = getCurrentInstance().appContext.config.globalProperties
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
.ad-banner-wrapper{
    .ad-item {
        box-sizing: border-box;
    }
    .ad-title-wrapper {
        position: relative;
        .ad-title-link {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
        }
    }
}
</style>