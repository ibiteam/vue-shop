<template>
    <van-nav-bar
        v-bind="props"
        placeholder
        fixed
        @click-left="handleClickLeft"
        @click-right="handleClickRight"
    >
        <template #right v-if="showRight">
            <van-icon name="ellipsis" size="18" />
        </template>
    </van-nav-bar>
</template>

<script setup>
import { defineProps, getCurrentInstance } from 'vue'

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

const handleClickLeft = () => {
    cns.$router.go(-1)
    cns.$bus.emit('navbar-click-left')
}

const handleClickRight = () => {
    cns.$bus.emit('navbar-click-right')
}
</script>

<style lang='scss'>
.van-nav-bar .van-icon,
.van-nav-bar__text{
    color: #333;
}
</style>