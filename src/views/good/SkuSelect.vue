<template>
    <div>
        <div class="s-flex ai-ct" style="padding-left: 0.4rem;padding-bottom: 0.3rem;padding-top: 0.1rem;">
            <span class="fs28 co-666" style="width: 2em;margin-right: 0.18rem;flex: none;" v-if="list[0]">{{list[0].values.length}}种可选</span>
            <div class="sku-wrap s-flex ai-ct" v-if="list[0]">
                <div class="sku-item" :class="{active:item.selected,'no-number':item.hidden}" v-for="(item,index) in list[0].values" @click="selectSku(item,index)">
                    <img :src="item.thumb?item.thumb:main_img" alt="">
                    <p class="elli-1">{{ item.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue'

    const props = defineProps({
        list: {
            type: Array,
            default: () => []
        },
        main_img: {
            type: String,
            default: ''
        },
        http_ing: {
            type: Boolean,
            default: false
        }
    })

    const emit = defineEmits(['select'])

    const selectSku = (item, index) => {
        if (item.selected || item.hidden || props.http_ing) {
            return
        }
        emit('select', item)
    }
</script>

<style scoped lang="scss">
    .sku-wrap::-webkit-scrollbar {
        height: 0; /* 横向滚动条高度 */
    }

    .sku-wrap::-webkit-scrollbar-thumb {
        background: #fff;
        border-radius: 0;
    }

    .sku-wrap::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 0;
    }

    .sku-wrap::-webkit-scrollbar-thumb:horizontal {
        background: #fff; /* 横向滚动条thumb颜色 */
    }
    .sku-wrap{width: calc(7.5rem - 0.98rem - 2em);overflow: auto;}
    .sku-wrap .sku-item{margin-right: 0.2rem;flex:none;width: 1.2rem;border: 1px solid transparent;height: 1.2rem;border-radius: 0.2rem;overflow: hidden;position: relative;border: 1px solid #fff;}
    .sku-wrap .sku-item.active{border: 1px solid var(--red-color);}
    .sku-wrap .sku-item.no-number:after{position: absolute;color:ar(--red-color);font-size:0.2rem;text-align:center;line-height:1.2rem;content: '无货';width: 100%;height: 100%;left: 0;top: 0;background: rgba(118,118,118,0.6);z-index: 9;}
    .sku-wrap .sku-item:last-of-type{margin-right: 0;}
    .sku-wrap .sku-item img{width: 1.2rem;height: 1.2rem;}
    .sku-wrap .sku-item p{background: rgba(0,0,0,0.7);height: 0.4rem;line-height: 0.4rem;color: #fff;text-align: center;font-size: 0.2rem;position: absolute;bottom: 0;left: 0;width: 100%;}
</style>
