<template>
    <div class="side-advertising-wrapper" v-if="content.items.image" @click.stop="handleOpenLink(content.items.url)">
        <common-image v-bind="{ src: content.items.image, width: '2rem', height: '2rem', radius: '0' }"></common-image>
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
.side-advertising-wrapper {
    width: 2rem;
    height: 2rem;
    margin: auto;
    position: fixed;
    right: calc(50% - 3.55rem);
    bottom: 150px;
    z-index: 1000;
}
</style>