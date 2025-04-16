<template>

</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
</script>

<style scoped>

</style>
