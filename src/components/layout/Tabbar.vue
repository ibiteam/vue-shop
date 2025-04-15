<template>
    <van-tabbar
        v-model="active"
        placeholder
        safe-area-inset-bottom
        active-color="var(--main-color)"
        inactive-color="#333"
        route
        :before-change="handleBeforChange">
        <van-tabbar-item v-for="tab in tabbarStore.tabs"
            :key="tab.alias"
            :name="tab.alias"
            :icon="active == tab.alias ? tab.selection_image : tab.default_image"
            :badge="tab.is_show_number && tab.number ? tab.number : ''"
            :to="{name:tab.alias}"
        >{{ active == tab.alias ? tab.check_title : tab.title }}</van-tabbar-item>
    </van-tabbar>
</template>

<script setup>
import { ref } from 'vue'
import { useTabbarStore } from '@/stores/modules/tabbar';

const tabbarStore = useTabbarStore();
const active = ref(0);
const handleBeforChange = (name) => {
    return true
}

</script>

<style lang='scss' scoped>
:deep(.van-badge) {
    background-color: var(--main-color);
}
:deep(.van-tabbar){
	max-width: 7.5rem;
	left: 0;
	right: 0;
	margin: 0 auto;
}
</style>
