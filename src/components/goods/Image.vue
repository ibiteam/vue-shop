<template>
    <van-image v-bind="props" block>
        <template v-slot:loading>
            <van-loading type="spinner" size="20" />
        </template>
    </van-image>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    src: {
        type: String,
        default: 'https://cdn.toodudu.com/2019/01/09/nk0mSH9IIlnDjq0BzUpr9Rf0zVRoDMmTvLfVVZCa.jpeg?imageView2/1/w/350/h/350',
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