<template>
    <div>home</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { shopCommonConfig } from '@/api/common'

onMounted(() => {
    shopCommonConfig()
})
</script>

<style lang='scss' scoped>
</style>