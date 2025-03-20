<script setup>
import { RouterView } from 'vue-router'
import $public from '@/utils/public'
$public.initShopConfig()
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
