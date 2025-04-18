<template>
    <div class="evaluate-wrap" style="padding-bottom: 0.3rem;background: #f8f8f8;height: 100vh;">
        <common-header :title="title"></common-header>
        <div class="eval-box">
            <!--列表-->
            <van-list v-model="loading" :finished="finished" :finished-text="noText" @load="getData" v-if="list.length>0" :immediate-check="false">
                <div class="list" v-for="item in list">
                    <div class="users s-flex jc-bt ai-ct">
                        <div class="user-left s-flex ai-ct">
                            <div style="width:0.7rem;height:0.7rem;border-radius:100%;border:0.02rem solid #f2f2f2;overflow: hidden;" class="s-flex ai-ct jc-ct MR10">
                                <img class="user-img" v-if="item.avatar" :src="item.avatar" alt="">
                                <img class="user-img" v-else src="@/assets/images/header-photo.png" alt="">
                            </div>
                            <div class="star" style="margin: 0;">
                                <div>
                                    <span class="user-name fs28 co-333" v-if="item.nickname">{{item.nickname}}</span>
                                    <span class="user-name fs28 co-333" v-else>未设置昵称</span>
                                </div>
                                <ShopRate :rank="item.rank"></ShopRate>
                            </div>

                        </div>
                        <div class="co-999 fs28">{{item.comment_at}}</div>
                    </div>
                    <div class="star s-flex flex-wrap star-all">
                        <div class="s-flex ai-ct" v-if="item.goods_rank">
                            <span>产品服务：</span>
                            <ShopRate :rank="item.product_rank"></ShopRate>
                        </div>
                        <div class="s-flex ai-ct" v-if="item.price_rank">
                            <span>价格合理度：</span>
                            <ShopRate :rank="item.price_rank"></ShopRate>
                        </div>
                        <div class="s-flex ai-ct" v-if="item.bus_rank">
                            <span>商家服务：</span>
                            <ShopRate :rank="item.bus_rank"></ShopRate>
                        </div>
                        <div class="s-flex ai-ct" v-if="item.delivery_rank">
                            <span>交货速度：</span>
                            <ShopRate :rank="item.delivery_rank"></ShopRate>
                        </div>
                        <div class="s-flex ai-ct" v-if="item.service_rank">
                            <span>售后服务：</span>
                            <ShopRate :rank="item.sales_rank"></ShopRate>
                        </div>
                    </div>
                    <div class="content fs28 co-333" style="word-break: break-all;">{{item.content}}</div>
                    <div class="img-box s-flex flex-wrap">
                        <van-image width="2.1rem" height="2.1rem" fit="contain" v-for="(childItem,childIndex) in item.images" :src="childItem" @click="lookBigImg(item, childIndex)"/>
                    </div>
                </div>
            </van-list>
        </div>
        <div class="no-data text-center" style="padding-top: 0.5rem;" v-if="!list.length&&!dataLoading">
            <img class="no-img" src="@/assets/images/good/no-data-evaluate.png"/>
            <div class="noText">暂时没有评论</div>
        </div>
        <!--大图-->
        <div class="big-img">
            <van-image-preview
                    v-model:show="bigImgShow"
                    :images="images"
                    :start-position="startIdx"
                    @change="idxChange"
            >
                <template v-slot:index>{{ index + 1 }}/{{ images.length }}</template>
            </van-image-preview>
        </div>
    </div>
</template>

<script setup>
    import ShopRate from "./ShopRate.vue";
    import { ref, onMounted, getCurrentInstance } from 'vue'
    import { useRoute } from 'vue-router'
    import { getGoodsEvaluate } from '@/api/good.js'
    import { isSuccessCode, isUnLoginCode} from "@/utils/constant.js";
	import { appRoute } from "@/router/appRoute.js";

    const cns = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()

    // 响应式数据
    const title = ref('全部商品评价')
    const no = ref(0)
    const dataLoading = ref(true)
    const loading = ref(false)
    const finished = ref(false)
    const bigImgShow = ref(false)
    const index = ref(0)
    const startIdx = ref(0)
    const images = ref([])
    const list = ref([])
    const page = ref(1)
    const pageSize = ref(10)
    const noText = ref('没有更多了')

    // 大图翻页
    const idxChange = (idx) => {
        index.value = idx
    }

    // 查看大图
    const lookBigImg = (item, idx) => {
        startIdx.value = idx
        images.value = item.images
        bigImgShow.value = true
    }

    // 加载列表
    const getData = () => {
		const info = {
			page: page.value,
			no: no.value,
			number: 10
		}
	    getGoodsEvaluate(info).then((res) => {
            loading.value = false
            dataLoading.value = false
            if (isSuccessCode(res)) {
                finished.value = res.data.meta.total/res.data.meta.per_page <= res.data.meta.current_page
                list.value.push(...res.data.list)
                if (finished.value && list.value.length <= pageSize.value) {
	                noText.value = ''
                } else {
	                noText.value = '没有更多了'
                }
                page.value++
            } else if (isUnLoginCode(res)) {
	            appRoute('login')
            } else {
	            cns.$toast(res.message)
            }
        })
    }

    onMounted(() => {
        document.documentElement.scrollTop = document.body.scrollTop = 0
        no.value = route.query.no
	    getData()
    })
</script>

<style scoped lang="scss">
	.eval-box{
		padding-top: 0.2rem;
	}
    .give-good {
        padding: 0.1rem;
        background: var(--page-bg-color);
        border-radius: 0.1rem;
        margin-top: 0.08rem;
	    img{
		    width: 1rem;
		    height: 1rem;
		    box-shadow: 0 0 0.06rem 0 rgba(0,0,0,0.2);
		    border-radius: 0.1rem;
		    margin-right: 0.2rem;
		    flex: none;
	    }
	    p{
		    line-height: 0.36rem;
		    height: 0.72rem;
		    font-size: 0.24rem;
	    }
    }
    /*无数据样式设置*/
    .no-data{
        background: transparent;
	    .no-img{
		    width:4rem;
		    height:4rem;
	    }
	    .noText{
		    text-align:center;
		    color:#333;
		    font-size:0.26rem;
	    }
    }
    /*评价*/
    .list {
        width: 7.1rem;
        padding: 0.3rem 0.2rem 0.1rem;
        box-sizing: border-box;
        background: #fff;
        border-radius: 0.2rem;
        margin: 0 auto 0.2rem;
	    .user-img {
		    max-width: 0.7rem;
		    max-height: 0.7rem;
	    }
	    .star {
		    margin: 0.2rem 0 0.24rem;
	    }
	    .star-all{
		    >div{
			    width: 50%;
		    }
	    }
	    .content {
		    width: 100%;
		    word-break: break-all;
		    margin-bottom: 0.24rem;
	    }
	    .img-box :deep(.van-image){
		    border: 0.02rem solid var(--page-bg-color);
		    margin-right: 0.2rem;
		    margin-bottom: 0.2rem;
		    box-sizing:border-box;
		    border-radius: 0.2rem;
		    overflow: hidden;
		    &:nth-child(3n+3) {
			    margin-right: 0;
		    }
	    }
    }
</style>
