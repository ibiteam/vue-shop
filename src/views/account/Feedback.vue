<template>
    <div class="feedback-wrap">
        <common-header :title="title" :is_show_more="false"></common-header>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
const title = ref('意见反馈')

onMounted(() => {

})
</script>

<style scoped>

</style>
