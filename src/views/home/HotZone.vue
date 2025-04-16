<template>
    <div class="hot-zone-wrapper home-item-wrapper">
        <common-image v-bind="{src: content.image, width: '100%', height: 'auto', radius: '0.2rem'}" />
        <div
            class="hot-zone-item"
            v-for="(item, index) in content.items"
            :key="index"
            :style="{
                width: (item.width / 100) + 'rem',
                height: (item.height / 100) + 'rem',
                top: (item.y / 100) + 'rem',
                left: (item.x / 100) + 'rem',
            }"
            @click="handleOpenLink(item.url)"
        >
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

</script>

<style lang='scss' scoped>
.hot-zone-wrapper {
    position: relative;
    .hot-zone-item {
        position: absolute;
        z-index: 100;
    }
}
</style>