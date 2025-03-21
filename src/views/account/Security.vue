<template>
    <div class="security-wrap">
        <common-header :title="title" :is_show_more="false"></common-header>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
const title = ref('账户安全')

onMounted(() => {

})
</script>

<style scoped>

</style>
