<template>
    <van-image v-bind="props" block>
        <template v-slot:loading>
            <van-loading type="spinner" size="20" />
        </template>
        <template v-slot:error>
            <img style="width: 100%; height: 100%; max-width: 100%; max-height:100%;" src="@/assets/images/common/no-pic.png" />
        </template>
    </van-image>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    src: {
        type: String,
        default: '',
    },
    width: {
        type: String,
        default: '3.5rem'
    },
    height: {
        type: String,
        default: '3.5rem'
    },
    radius: {
        type: String,
        default: '0'
    },
    fit: {
        type: String,
        default: 'fill', // cover, contain, fill, none, scale-down
    }
})

</script>

<style lang='scss' scoped>
</style>