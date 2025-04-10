<script setup>
import { RouterView } from 'vue-router'
import $public from '@/utils/public'
$public.initShopConfig()
import {onMounted, provide, computed} from "vue";

import { useConfigStore } from "@/stores/index.js";

const configStore = useConfigStore()
const shopConfig = computed(() => configStore.shopConfig)

provide('shopConfig', shopConfig)

onMounted(() => {
    function getCssVariableValue(variableName) {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    }
    const mainColor = getCssVariableValue('--main-color')
    let root = document.querySelector(":root")
    let color_number = 10
    root.style.setProperty("--main-color", mainColor)
    while (color_number < 100) {
        root.style.setProperty(`--main-color-${color_number}`, mainColor + color_number)
        color_number += 10
    }
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
