<template>
    <div class="set-wrap">
        <common-header :title="title" :is_show_more="false"></common-header>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
const title = ref('用户设置')

onMounted(() => {

})
</script>

<style scoped>

</style>
