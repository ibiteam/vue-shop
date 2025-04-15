<template>
    <div class="goods-recommend-wrapper home-item-wrapper">
        <div class="recommend-wrapper" v-if="content.items.goods_data && content.items.goods_data.length">
            <div class="recommend-title-wrapper s-flex" :class="content.title.align == 'center' ? 'jc-ct' : 'jc-fs'" style="margin-bottom: 0.2rem;">
                <div class="ad-title s-flex ai-ct jc-ct" >
                    <common-image v-if="content.title.image" v-bind="{ src: content.title.image, width: '0.32rem', height: '0.32rem', radius: '0' }" style="margin-right: 0.12rem;"/>
                    <span class="fs28 fw-b" :style="{color: content.title.color}">{{content.title.name}}</span>
                </div>
                <div class="recommend-title-link s-flex ai-ct fs24" @click.stop="handleOpenLink(content.title.url)">
                    {{ content.title.suffix }}<em class="iconfont" style="font-size: .2rem;" v-if="content.title.url.value">&#xe773;</em>
                </div>
            </div>
            <div class="goods-wrapper1" v-if="content.layout == 1 && content.items.goods_data">
                <div class="goods-item s-flex ai-fs jc-bt" v-for="item in content.items.goods_data" :key="item.no" @click.stop="appRoute('good', {goods_no: item.no})">
                    <common-image v-bind="{ src: item.image, width: '2.6rem', height: '2.6rem', radius: '0.2rem' }"/>
                    <div class="goods-info s-flex jc-bt flex-dir">
                        <div class="goods-name elli-2 s-flex ai-ct fs26">
                            <van-tag color="linear-gradient(90deg, #5436D5 4%, #735CFF 99%)" v-if="item.label">{{item.label}}</van-tag>
                            {{item.name}}
                        </div>
                        <div class="goods-subname elli-1" v-if="item.sub_name">
                            {{item.sub_name}}
                        </div>
                        <common-price v-bind="{price: item.price, priceColor: '#f71111'}"></common-price>
                    </div>
                </div>
            </div>
            <div class="goods-wrapper2 s-flex ai-ct jc-bt flex-wrap" v-if="content.layout == 2 && content.items.goods_data">
                <div class="goods-item" v-for="item in content.items.goods_data" :key="item.no" @click.stop="appRoute('good', {goods_no: item.no})">
                    <common-image v-bind="{ src: item.image, width: '100%', height: '100%', radius: '0.2rem 0.2rem 0 0' }"/>
                    <div class="goods-info s-flex jc-bt flex-dir">
                        <div class="goods-name elli-2 s-flex ai-ct fs26">
                            <van-tag color="linear-gradient(90deg, #5436D5 4%, #735CFF 99%)" v-if="item.label">{{item.label}}</van-tag>
                            {{item.name}}
                        </div>
                        <div class="s-flex ai-ct jc-bt">
                            <common-price v-bind="{price: item.price, priceColor: '#f71111'}"></common-price>
                            <span class="fs20 co-999" v-if="item.sales_volume">已售{{item.sales_volume}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="goods-wrapper3 s-flex ai-ct jc-bt flex-wrap" v-if="content.layout == 3 && content.items.goods_data">
                <div class="goods-item" v-for="item in content.items.goods_data" :key="item.no" @click.stop="appRoute('good', {goods_no: item.no})">
                    <common-image v-bind="{ src: item.image, width: '100%', height: '100%', radius: '0.2rem 0.2rem 0 0' }"/>
                    <div class="goods-info s-flex jc-bt flex-dir">
                        <div class="goods-name elli-2 s-flex ai-ct fs26">
                            {{item.name}}
                        </div>
                        <div class="s-flex ai-ct jc-bt">
                            <common-price v-bind="{price: item.price, priceColor: '#f71111'}"></common-price>
                            <span class="fs20 co-999" v-if="item.sales_volume">已售{{item.sales_volume}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { appRoute } from '@/router/appRoute'

const cns = getCurrentInstance().appContext.config.globalProperties
const props = defineProps({
    content: {
        type: Object,
        default: () => {
            return {}
        }
    },
})

const handleOpenLink = (res) => {
    res.value && cns.$bus.emit('homeOpenLink', res.value)
}

</script>

<style lang='scss' scoped>
.goods-recommend-wrapper{
    .recommend-wrapper {
        border-radius: 0.2rem;
        padding: 0.2rem 0.2rem 0;
        background-color: #fff;
        box-sizing: border-box;
    }
    .recommend-title-wrapper {
        position: relative;
        .recommend-title-link {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
        }
    }
    .goods-wrapper1 {
        padding-bottom: 0.2rem;
        .goods-item {
            height: 2.6rem;
            margin-bottom: 0.3rem;
            overflow: hidden;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .goods-info {
            width: calc(100% - 2.6rem);
            height: 100%;
            padding-left: 0.2rem;
        }
        .goods-subname {
            color: #f71111;
            width: 100%;
        }
    }
    .goods-wrapper2 {
        .goods-item {
            flex: 0 0 calc(50% - 0.1rem);
            border-radius: 0.2rem 0.2rem 0 0;
            overflow: hidden;
            .goods-info {
                width: 100%;
                padding: 0.2rem;
                box-sizing: border-box;
                .goods-name {
                    margin-bottom: 0.16rem;
                }
            }
        }
    }
    .goods-wrapper3 {
        .goods-item {
            margin-bottom: 0.1rem;
            flex: 0 0 calc(33.33% - 0.1rem);
            border-radius: 0.2rem 0.2rem 0 0;
            overflow: hidden;
            .goods-info {
                width: 100%;
                padding: 0.1rem 0;
                box-sizing: border-box;
                .goods-name {
                    margin-bottom: 0.08rem;
                }
            }
        }
    }
}
</style>