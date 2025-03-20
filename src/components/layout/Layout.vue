<template>
    <div class="shop-layout-container">
        <router-view class="shop-view" v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <Tabbar></Tabbar>
    </div>
</template>

<script setup>
import Tabbar from './Tabbar'
</script>

<style lang='scss' scoped>
.shop-layout-container {
    width: 7.5rem;
    height: 100%;
    .shop-view {
        overflow: hidden auto
    }
}
</style>