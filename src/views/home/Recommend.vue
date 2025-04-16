<template>
    <div class="goods-recommend-you-wrapper home-item-wrapper">
        <div class="recommend-wrapper">
            <div class="recommend-title-wrapper fs28">
                {{content.title ? content.title : '为您推荐'}}
            </div>
            <van-list v-model:loading="pageInfo.loading" :finished="pageInfo.finished" @load="loadRecommend" :finished-text="paging ? '没有更多了' : ''" :immediate-check="false" :offset="50">
                <div class="goods-wrapper2 s-flex ai-ct jc-bt flex-wrap" v-if="recommend.length">
                    <div class="goods-item" v-for="item in recommend" :key="item.no" @click.stop="appRoute('good', {goods_no: item.no})">
                        <common-image v-bind="{ src: item.image, width: '100%', height: wrapper2OffsetWidth + 'px', radius: '0.2rem 0.2rem 0 0' }"/>
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
            </van-list>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, onMounted, nextTick } from 'vue'
import {getRecommend} from '@/api/common.js'
import {appRoute} from "@/router/appRoute.js";
import {isSuccessCode} from "@/utils/constant.js";

const cns = getCurrentInstance().appContext.config.globalProperties
const props = defineProps({
    content: {
        type: Object,
        default: () => {
            return {}
        }
    },
    paging: {
        type: Boolean,
        default: false,
    }
})
const wrapper2OffsetWidth = ref(0)
const recommend = ref([])
const pageInfo = reactive({
    loading: false,
    finished: false,
	total: 0,
	per_page: 6,
	current_page: 2
})

const countLastPage = () => {
	return (pageInfo.total % pageInfo.per_page ? 1 : 0) + Math.floor(pageInfo.total / pageInfo.per_page)
}

const loadRecommend = () => {
	pageInfo.loading = true
	getRecommend({page: pageInfo.current_page}).then(res => {
		pageInfo.loading = false
		if (isSuccessCode(res)) {
			recommend.value = recommend.value.concat(res.data.list)
			pageInfo.current_page = res.data.meta.current_page
            pageInfo.per_page = res.data.meta.per_page
            pageInfo.total = res.data.meta.total
			if (res.data.meta.current_page == countLastPage()) {
				pageInfo.finished = true
			} else {
				pageInfo.current_page++
			}
		}else {
			pageInfo.finished = false
		}
	})
}

const handleOpenLink = (res) => {
    res.value && cns.$bus.emit('homeOpenLink', res.value)
}

watch(() => props.content, (val) => {
    if (val) {
        recommend.value = val.items.list
    }
},{
    immediate: true,
    deep: true,
})

watch(() => props.paging, (val) => {
	if (!val) {
        pageInfo.finished = true
        pageInfo.loading = false
	}
}, {
    immediate: true
})

onMounted(() => {
    nextTick(() => {
        let element2 = document.querySelector('.goods-recommend-you-wrapper .goods-wrapper2 .goods-item')
        if (element2) {
            wrapper2OffsetWidth.value = element2.offsetWidth
        }
    })
})

</script>

<style lang='scss' scoped>
.goods-recommend-you-wrapper{
    .recommend-wrapper {
        border-radius: 10px;
        // background-color: #fff;
        box-sizing: border-box;
    }
    .recommend-title-wrapper{
        width: fit-content;
        max-width: 100%;
        padding: 0.26rem 0.66rem;;
        margin: 0 auto;
        text-align: center;
        position: relative;
        &::before{
            content: '';
            display: block;
            width: 0.36rem;
            height: 0.3rem;
            background: url('@/assets/images/common/recommend-left.png') 100% no-repeat;
            background-size: cover;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
        }
        &::after{
            content: '';
            display: block;
            width: 0.36rem;
            height: 0.3rem;
            background: url('@/assets/images/common/recommend-right.png') 100% no-repeat;
            background-size: cover;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto 0;
        }
    }
    .goods-wrapper2 {
        .goods-item {
            background: #fff;
            margin-bottom: 0.1rem;
            flex: 0 0 calc(50% - 0.1rem);
            border-radius: 0.2rem;
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
}
</style>