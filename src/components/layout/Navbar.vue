<template>
    <van-nav-bar
        v-bind="props"
        placeholder
        fixed
        @click-left="handleClickLeft"
        @click-right="handleClickRight"
    >
        <template #right>
            <van-icon name="search" size="18" v-if="showSearch" @click="toSearch"/>
            <van-icon name="ellipsis" size="18" v-if="showRight"/>
        </template>
    </van-nav-bar>
</template>

<script setup>
import { defineProps, getCurrentInstance, defineEmits } from 'vue'

const cns = getCurrentInstance().appContext.config.globalProperties
const props = defineProps({
    // 标题
    title: {
        type: String,
        default: ''
    },
    // 左侧文案
    leftText: {
        type: String,
        default: '',
    },
    // 是否显示右侧更多
    showRight: {
        type: Boolean,
        default: false
    },
    // 是否显示右侧搜索图标
    showSearch: {
        type: Boolean,
        default: false
    },
    // 右侧文案
    rightText: {
        type: String,
        default: '',
    },
    // 是否禁用左侧按钮
    leftDisabled: {
        type: Boolean,
        default: false
    },
    // 是否禁用右侧按钮
    rightDisabled: {
        type: Boolean,
        default: false
    },
    // 是否显示左侧箭头
    leftArrow: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['click-left', 'click-right','click-search'])

const handleClickLeft = () => {
    cns.$router.go(-1)
    emit('click-left')
}

const handleClickRight = () => {
    emit('click-right')
}
const toSearch = () =>{
    emit('click-search')
}
</script>

<style lang='scss'>
.van-nav-bar--fixed{
    z-index: 1000;
}
.van-nav-bar .van-icon,
.van-nav-bar__text{
    color: #333;
}
</style>
