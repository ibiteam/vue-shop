<template>
    <div class="orderDetail-wrap">
        <common-header :title="title"></common-header>
        <section v-if="page_load" style="height:100vh;border:1px solid transparent" class="bg-fff">
            <section class="">
                <p style="width:6rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 MT20 ML20"></p>
                <p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
                <p style="width:3rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
            </section>
            <section style="margin-top: 0.6rem;">
                <p style="width:6rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 MT20 ML20"></p>
                <p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB20 bg-f2 ML20"></p>
            </section>
            <section style="margin-top: 0.6rem;">
                <div class="MT10">
                    <div class="goods_list s_flex ai_ct">
                        <div class="img_box bg-f2"></div>
                        <div class="s_flex flex_dir flex_1" style="height:1.82rem">
                            <p style="width:4rem;height:0.5rem;border-radius:0.06rem" class="MB30 bg-f2 ML20"></p>
                            <div style="width:2rem;height:0.5rem;border-radius:0.06rem" class="bg-f2 ML20"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section  style="margin-top: 0.7rem;">
                <div style="width:7.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:6.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:5.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:4.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
            <section class="MT20">
                <div style="width:3.1rem;height:0.5rem;border-radius:0.06rem" class="ML20 bg-f2 MR20"></div>
            </section>
        </section>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
const cns = getCurrentInstance().appContext.config.globalProperties
const title = ref('订单详情')
const page_load = ref(true)
</script>

<style scoped lang="scss">
.orderDetail-wrap{

}
</style>
