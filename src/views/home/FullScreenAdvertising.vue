<template>
    <div class="fullscreen-advertising-wrapper" v-if="content.items.image">
        <div class="s-flex ai-ct jc-ct" style="width: 100%; height: 100%;">
            <common-image v-bind="{ src: content.items.image, width: 'auto', height: 'auto', radius: '0' }" @click.stop="handleOpenLink(content.items.url)"></common-image>
            <em class="iconfont icon-guanbi" @click="handleClose"></em>
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

const handleOpenLink = (res) => {
    res.value && cns.$bus.emit('homeOpenLink', res.value)
}

const handleClose = () => {
    cns.$bus.emit('homeCloseScreenImage')
}

</script>

<style lang='scss' scoped>
.fullscreen-advertising-wrapper {
    width: 7.5rem;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 9999;
    overflow: hidden;
    em.icon-guanbi{
        position: absolute;
        right: 0;
        left: 0;
        bottom: 1rem;
        margin: 0 auto;
        color: #fff;
        font-size: .5rem;
        height: .44rem;
        width: .44rem;
    }
}
</style>