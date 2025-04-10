<script setup>
import {provide, computed} from "vue";
import { RouterView } from 'vue-router'
import { initShopConfig } from '@/utils/public'
import { useConfigStore } from "@/stores/index.js";

initShopConfig().then(()=>{
	const configStore = useConfigStore()
	const shopConfig = computed(() => configStore.shopConfig)

	provide('shopConfig', shopConfig)
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
