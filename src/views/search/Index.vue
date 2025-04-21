<template>
    <div class="search-index">
        <van-sticky>
            <div class="search-selection"
                 @touchmove.prevent @mousemove.prevent>
                <div class="search-box backF bg-fff">
                    <span class="iconfont" @click="router.back()" style="font-size: 24px;margin-left: 0;">&#xe607;</span>
                    <div class="search" @click="hisSearchCancel">
                        <span class="iconfont icon" style="color: var(--color-text-desc);font-size: 14px;">&#xe60a;</span>
                        <p class="van-ellipsis keywords-word" v-if="keywords">
                            {{keywords}}
                        </p>
                        <p v-else style="padding-left: 8px;color: #bbb;">{{info.keywords}}</p>
                    </div>
                    <div class="text" @click="rank=!rank">
                        <img :src="rank?searchType1:searchType2" alt="">
                    </div>
                </div>
                <div class="search-filter s-flex backF bg-fff">
                    <div class="filter-item" :class="{ active : searchType == '' }" @click="searchTypeChange('')">综合排序
                    </div>
	                <div class="filter-item" :class="{ active : searchType == 'time_desc'}"
	                     @click="searchTypeChange('time_desc')">最新
	                </div>
                    <div class="filter-item" :class="{ active : searchType == 'sale_desc'}"
                         @click="searchTypeChange('sale_desc')">销量
                    </div>
                    <div class="filter-item filter-price s-flex" :class="{ active : searchType == 'price_asc' || searchType == 'price_desc' }" @click="searchTypeChange('price')">
                        <span>价格</span>
                        <div style="width: 20px;">
                            <em class="iconfont" :class="{ active : searchType == 'price_asc' }">&#xe6b2;</em>
                            <em class="iconfont" :class="{ active : searchType == 'price_desc' }">&#xe604;</em>
                        </div>
                    </div>
                </div>
            </div>
        </van-sticky>
        <div class="search-list" :class="{'wrap-row':rank}"
             :style="{backgroundColor:!listNoData&&rank?'#fff':'#f2f2f2'}">
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="已到底部"
                :offset="1"
                @load="loadMore"
                :immediate-check="false"
            >
                <van-sticky :offset-top="0" v-if="!listNoData&&info.keywords">
                    <p class="result">
                        为您显示“<span>{{info.keywords.length>15?info.keywords.substr(0,15)+'..':info.keywords}}</span>”相关的搜索结果
                    </p>
                </van-sticky>
                <div class="search-dl">
                    <div class="search-dd flex-pack-justify flex-wrap s-flex">
                        <div class="search-li" v-for="(item, index) in searchList" :class="{'type-row':rank}"
                             @click="routerGoodsDetail(item.no)"
                             :key="item.id">
                            <div>
                                <div class="search-img">
                                    <van-image :src="item.image+'?imageView2/1/w/350/h/350'" width="100%"
                                               height="100%">
                                        <template v-slot:loading>
                                            <img src="@/assets/images/search/app_nopic.png" alt="">
                                        </template>
                                        <template v-slot:error>
                                            <img src="@/assets/images/search/app_nopic.png" alt="">
                                        </template>
                                    </van-image>
                                </div>
                            </div>
                            <div class="right-content">
                                <div class="search-gname elli-1">
                                    {{ item.name }}
                                </div>
                                <div class="search-view-price s-flex">
                                    <form-price :price="item.price" :unit="item.unit"
                                                :unit_color="'#333'">
                                    </form-price>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--没有数据-->
                    <div class="noData" v-if="listNoData" style="padding-top: 1.5rem;">
                        <img class="noImg" src="@/assets/images/search/nodata.png"/>
                        <div class="noTex">没有符合条件的内容</div>
                    </div>
                </div>
            </van-list>
        </div>
        <div class="back-top" @click="setTop" v-if="show_back">
            <div class="back-top-con">
                <span class="iconfont">&#xe60c;</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, onBeforeUnmount, computed, watch, nextTick} from 'vue';
import { useRouter , useRoute , onBeforeRouteLeave } from 'vue-router';
import { showToast } from 'vant';
import {searchAxios} from '@/api/search'

import searchType1 from '@/assets/images/search/search_type_row_2.png'
import searchType2 from '@/assets/images/search/search_type_row_1.png'
import {isSuccessCode} from "@/utils/constant.js";
import {appRoute} from "@/router/appRoute.js";

const route = useRoute();
const router = useRouter();

const keywords = ref(route.query.keywords);
const rank = ref(false)
const searchType = ref('')
const info = reactive({
    category_id: route.query.cat_id,
    keywords: route.query.keywords,
    page: 1,
    sort_type: null,
})
const loading = ref(false)
const finished = ref(false)

const searchList = ref([])
const listNoData = ref(false)
const show_back = ref(false)

onBeforeRouteLeave((to, from, next) => {
    if (to.name === 'good' || to.name === 'search_history') {
        from.meta.keepAlive = true;
    } else {
        from.meta.keepAlive = false;
    }
    next();
});

const setTop = () => {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
}

const routerGoodsDetail = (no) => {
    let query = {'goods_no': no}
    appRoute('good', query)
}

const searchData = () => {
    Object.assign(info,{
        ...info,
        page:1,
    })
    let params = JSON.parse(JSON.stringify(info))
    params['number'] = 15
    searchAxios(params).then(res => {
        if (isSuccessCode(res)) {
            listNoData.value = !res.data.list.length
            keywords.value = res.data.keywords
            if ((route.query.cat_id && params.category_id && route.query.cat_id==params.category_id) && route.query.keywords != res.data.keywords) {
                Object.assign(info,{
                    ...info,
	                category_id:'',
                })
            }
            // 如果购物车找相似进来，则获取到cat_id返回的kewwords时，清除cat_id
            if (res.data.list.length < res.data.meta.per_page) {
                finished.value = false;
            }
            searchList.value = res.data.list;
            Object.assign(info,{
                ...info,
                page:info.page++,
            })
        }else{
            showToast(res.message)
        }
    })
}

/** 上拉加载 **/
const loadMore = () => {
    if (searchList.value.length >= 10) {
        setTimeout(() => {
            let ids = []
            let params = JSON.parse(JSON.stringify(info))
            if ((route.query.cat_id && params.category_id && route.query.cat_id==params.category_id) && route.query.keywords == params.keywords) {
                params.keywords = ''
            }else {
                params.category_id = ''
            }

            params['number'] = 15
            searchAxios(params).then(res => {
                if (isSuccessCode(res)) {
                    loading.value = false;
                    if (res.data.list.length == 0) {
                        finished.value = true;
                        return;
                    } else {
                        if (info.page == 1) {
                            searchList.value = res.data.list;
                        } else {
                            for (var key in res.data.list) {
                                searchList.value.push(res.data.list[key]);
                            }
                        }
                    }
                    Object.assign(info,{
                        ...info,
                        page:info.page++
                    })
                }
                loading.value = false;
            })
        }, 200);
    } else {
        loading.value = false;
        finished.value = false;
    }
}
/***************************店铺数据部分  ****************/
const searchTypeChange = (type) => {
    if(searchType.value == type) return false
    if (type == 'price') {
        searchType.value = searchType.value == 'price_asc' ? 'price_desc' : 'price_asc'
    } else {
        searchType.value = type
    }
    Object.assign(info,{
        ...info,
        sort_type:searchType.value
    })
	searchList.value = []
	searchData()

}
/** 点击显示搜索历史 **/
const hisSearchCancel = () => {
	appRoute('search_history', {placeholder: keywords.value || info.keywords})
}
const scrolls = () => {
    const sTop = window.scrollY || document.documentElement.scrollTop;
    show_back.value = sTop > 350;
};

watch(route, (value) => {
    if(value.query.keywords !== info.keywords || value.query.cat_id !== info.category_id){
        keywords.value = value.query.keywords
        Object.assign(info,{
            ...info,
            keywords:value.query.keywords,
	        category_id:value.query.cat_id,
        })
        rank.value = false
        listNoData.value = false
        searchList.value = []
        finished.value = false
        loading.value = false
        searchData()
    }
})

// 生命周期钩子
onMounted(() => {
    searchData()
    document.querySelector('body').setAttribute('style', 'background-color: var(--page-bg-color)');
    window.addEventListener('scroll',scrolls)
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll',scrolls)
});
</script>

<style scoped lang="scss">
    .search-index{
        background: var(--page-bg-color);
        height:100%;
    }
    .search-list :deep(.van-sticky--fixed){
        z-index: 1;
    }
        /*搜索历史显示更多*/
    .history-more {
        padding: 0 4px !important;
        margin: 10px 0.2rem 0 0;
    }

    .search-selection {
        background: var(--page-bg-color);
        height: 1.98rem;
        position: static;
        top: 0;
    }

    .history-more-noright {
        margin-right: 0 !important;
    }

    :deep(.van-popup--right.van-popup--round) {
        border-radius: 0.25rem 0 0 0.25rem;
    }

    :deep(.van-icon__image) {
        width: 1.2em;
        height: 1.2em;
    }

    :deep(.van-field__left-icon) {
        margin-right: 8px;
    }

    :deep(.van-search__action) {
        line-height: 30px;
    }

    :deep(.van-icon-clear) {
        right: 0.15rem;
    }

    .shop-enter > div {
        background: url('@/assets/images/search/arrow-right.png') no-repeat right center;
        background-size: 0.1rem auto;
    }

    /*搜索历史样式设置*/
    .home-history {
        .van-search {
            float: left;
            width: calc(100% - 1.4rem);
            padding: 9px 12px;
        }

        form {
            height: 50px;

            .iconfont {
                float: left;
                padding-top: 11px;
                font-size: 24px;
                padding-left: 5px;
            }
        }

        .search-btn {
            width: 40px;
            font-size: 0.28rem;
            line-height: 50px;
            color: #666;
            font-weight: 400;
        }
    }

    .home-history .home-discover {
        .title {
            label {
                span {
                    background-image: url("@/assets/images/search/active_border.png");
                    background-position: center bottom;
                    background-repeat: no-repeat;
                    background-size: 0.5rem 0.05rem;
                    padding: 0 0 0.12rem;
                }
            }
        }

        .keywords-item {
            background: none;
            font-size: 0.24rem;
            width: 40%;
            text-align: left;
            margin-bottom: 0.1rem;
        }

        .keywords-item:nth-of-type(2n) {
            padding-left: 0.5rem;
            box-sizing: border-box;
        }
    }

    .home-history .van-search__content {
        border-radius: 0.6rem;
    }

    .home-history .van-field__body {
        padding-right: 0.2rem;
    }

    .home-history .van-field__left-icon .van-icon {
        font-size: 20px;
        margin: 0.05rem 0.1rem;
    }

    .home-history .van-search .van-cell {
        padding: 0;
        line-height: 30px;
    }

    .home-history .home-keywords {
        padding: 0 0.3rem;
    }

    .home-keywords {
        .title {
            font-size: 0.28rem;
            font-weight: 600;
            color: #343434;
            padding-top: 0.15rem;

            label {
                font-size: 0.28rem;

                span {
                    font-size: 0.28rem;
                }
            }
        }
    }

    .home-history .keywords-list {
        flex-flow: row wrap;
        padding: 0.1rem 0;
    }

    .home-history .keywords-item {
        padding: 0 0.2rem;
        margin-top: 10px;
        margin-right: 0.1rem;
        text-align: right;
        font-size: 0.20rem;
        color: #343434;
        background-color: var(--page-bg-color);
        border-radius: 0.6rem;
        line-height: 0.44rem;
        height: 0.44rem;
        float: left;
    }

    .home-history .van-field__control { /*font-size: 0.24rem; color: #999999;*/
        width: 100%;
        padding: 0.05rem 0.1rem;
        font-size: 0.24rem;
        color: #666;
        height: 0.58rem;
        box-sizing: border-box;
        line-height: 0.28rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    /* 搜索框样式设置 */
    .search-box { /*width: 100%;*/
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.15rem;
    }

    .search-box .iconfont {
        margin-left: 0.2rem;
        font-size: 0.24rem;
    }

    .search-box .search {
        width: 5.9rem;
        height: 0.58rem;
        line-height: 0.58rem;
        background: var(--page-bg-color);
        border-radius: 15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    :deep(.van-search__content) {
        background: var(--page-bg-color);
    }

    .search-box .search-inputs {
        width: 100%;
        padding: 0rem 0.1rem;
        font-size: 0.24rem;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        box-sizing: border-box;
    }

    .search-box .text {
        font-size: 0.24rem;
        width: 0.45rem;
        height: 0.45rem;
        color: #666;
    }

    .search-box .text img {
        width: 100%;
    }

    .search-box .icon-to-left {
        margin-left: 0;
        font-size: 24px;
    }

    .search-box {
        padding-left: 0.1rem;
    }

    /** 搜索筛选样式设置 **/
    .search-filter {
        height: 0.9rem;
        padding: 0 0.2rem 0.3rem;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }

    .search-filter .filter-item,
    .search-filter .filter-item span {
        font-size: 0.28rem;
    }

    .search-filter .filter-item {
        position: relative;
    }

    .search-filter .filter-item.filter-price > div {
        position: relative;
    }

    .search-filter .filter-item.filter-price > div .iconfont {
        font-size: 0.3rem;
        color: var(--color-text);
        position: absolute;
        left: 0;
    }

    .search-filter .filter-item.filter-price > div .iconfont:nth-of-type(1) {
        top: 0;

    }

    .search-filter .filter-item.filter-price > div .iconfont:nth-of-type(2) {
        top: 0.12rem;
        /*left: 0.01rem;*/
    }

    .search-filter .filter-item.filter-price > div .iconfont.active {
        color: var(--main-color);
    }

    .search-filter .filter-item.active {
        &::after {
            content: '';
            width: 0.55rem;
            height: 0.05rem;
            background: var(--main-color);
            background-size: 100% 100%;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            bottom: -0.2rem;
        }

        font-weight: bold;
    }

    /** 品牌样式设置 **/
    .select-wrap {
        background-color: var(--page-bg-color);
        height: 100%;
        width: 100%;
    }

    .brand-dropdown {
        background-color: #fff;
        border-radius: 0.20rem;
        padding: 0 0.3rem;

        h4 {
            font-size: 0.24rem;
            color: #000000;
            line-height: 0.6rem;
            font-weight: bold;
            padding-top: 0.2rem;
        }
    }

    .brand-dropdown ul {
        max-height: calc(100vh - 3.8rem);
        overflow-y: auto;
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .brand-dropdown ul li {
        display: inline-block;
        width: 30%;
        margin-bottom: 0.2rem;
        text-align: center;
        height: 0.58rem;
        border-radius: 0.29rem;
        line-height: 0.58rem;
        background-color: var(--page-bg-color);
        color: #000;
        border: 1px solid var(--page-bg-color);
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        span {
            font-size: 0.2rem;
        }
    }

    .brand-dropdown ul li.active {
        color: var(--main-color);
        background: var(--main-color-30);
        border: 1px solid var(--main-color);
    }

    .brand-dropdown .brand-btns {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        position: absolute;
        width: 100%;
        padding: 0.2rem 0.3rem 0.3rem;
        background: #fff;
        box-sizing: border-box;
        left: 0;
        bottom: 0;
    }

    .brand-dropdown .brand-btns > div {
        width: 48%;
        line-height: 0.58rem;
        height: 0.58rem;
        text-align: center;
        font-size: 0.24rem;
        color: #666;
        border-radius: 0.29rem;
        border: 1px solid #C4C4C4;
    }

    .brand-dropdown .brand-btns > div.reset {
    }

    .brand-dropdown .brand-btns > div.confirm {
        background-color: var(--main-color);
        border-color: var(--main-color);
        color: #ffffff;
    }

    .form-price {
        :deep(.van-cell){
            width: 45%;
            line-height: 0.40rem;
            padding: 0.09rem 0;
            height: 0.58rem;
            border-radius: 0.29rem;
            background: var(--page-bg-color);
            display: inline-block;

            .van-field__control {
                text-align: center;
            }
        }

        > span {
            width: 10%;
            display: inline-block;
            text-align: center;
            line-height: 0.58rem;
            vertical-align: top;
        }
    }

    .search-list {
        height: auto;
        background-color: var(--page-bg-color);

        .result {
            line-height: 0.80rem;
            height: 0.8rem;
            background: linear-gradient(180deg, #FFFFFF, var(--page-bg-color));
            padding: 0 0.2rem;
            font-size: 0.22rem;
            color: #333;
            border-radius: 0.1rem 0.1rem 0 0;

            span {
                font-weight: bold;
            }
        }
    }

    .wrap-row {
        background-color: #fff;
        border-radius: 0.1rem 0.1rem 0 0;

        .result {
            background: #fff;
        }
    }

    .search-list .search-dl .search-dd {
        padding: 0 0.1rem;
        overflow: hidden;
    }

    .search-list .search-dl .search-dd .search-li {
        width: 3.55rem;
        padding-bottom: 0.05rem;
        margin: 0 0.05rem 0.2rem;
        border-radius: 0.1rem;
        background-color: #ffffff;
        overflow: hidden;
        position: relative;
    }

    .search-list .search-dl .search-dd .hf {
        margin: 0 0.04rem 0.2rem;
    }

    .search-list .search-dl .search-dd .search-li .search-img {
        width: 3.54rem;
        height: 3.49rem;
    }

    .search-list .search-dl .search-dd .search-li .search-img img {
        width: 100%;
        height: 100%;
    }

    .search-list .search-dl .search-dd .search-li .search-gname {
        height: 0.60rem;
        line-height: 0.30rem;
        padding: 0.05rem 0.2rem 0.1rem;
        margin-top: 0.08rem;
        font-size: 0.24rem;
        color: var(--color-text);
        -webkit-line-clamp: 2;
        box-sizing: border-box;
    }

    .search-list .search-dl .search-dd .search-li .search-view-price {
        display: inline-block;
        padding: 0 0.2rem;
        margin: 0.05rem 0;
        font-size: 0.26rem;
        color: #f61d4a;
    }

    .search-list .search-dl .search-dd .search-li .search-view-price em {
        font-style: normal;
        color: var(--color-text);
    }

    .search-list .search-dl .search-dd .search-li .search-view-price span i {
        font-style: normal;
        font-size: 0.22rem;
    }

    .search-list .search-dl .search-dd .search-li .search-view-price span {
        font-size: 0.33rem;
        /*font-weight: bold;*/
    }

    .search-list .search-dl .search-dd .search-li .search-view-price em {
        display: inline-block;
        font-size: 0.22rem;
    }

    .search-list .home-foryou-store {
        line-height: 0.35rem;
        padding: 0.05rem 0.15rem;
        color: #666;
        font-size: 0.2rem;

        i {
            font-style: normal;
            font-size: 0.2rem;
            display: inline-block;
            max-width: 2.9rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 0.35rem;
        }

        span {
            display: inline-block;
            font-size: 0.34rem;
            position: relative;
            top: -0.04rem;
        }
    }

    .group-mark {
        padding: 0 0.15rem;

        span {
            border-radius: 0.06rem;
            display: inline-block;
            font-size: 0.2rem;
            height: 0.3rem;
            line-height: 0.34rem;
            padding: 0 0.07rem;
        }

        .isZiying {
            line-height: 0.34rem;
            padding: 0 0.1rem;
            border: none;
            background: linear-gradient(-90deg, #FA5F5F, var(--red-color));
        }
        .attribute {
            line-height: 0.34rem;
            padding: 0 0.1rem;
            border: none;
            background: #FF8C11;
            color: #fff;
            margin-right: 0.05rem;
        }
        .def {
            color: #fff;
            background: linear-gradient(90deg, #735CFF, #5436D5);
        }

        .good_activity {
            border: 0.02rem solid var(--red);
            background: #fff;
            color: var(--red);
            line-height: 0.30rem;
            height: 0.26rem;
        }

        .mark-border {
            border: 0.02rem solid var(--red);
            background: #fff;
            color: var(--red);
            line-height: 0.30rem;
            height: 0.26rem;
            margin-right: 0.05rem;
        }
    }

    .group-mark .mark-vip {
        line-height: 0.34rem;
        color: #fff;
        background: #f31717;
        border: none;
        height: 0.3rem;
        /*font-size: 0.24rem;*/
        border-radius: 3px;
        padding: 0 0.1rem;
        box-sizing: border-box;

    }

    .group span {
        display: inline-block;
        float: right;
        color: var(--color-text);
        line-height: 1;
        padding: 0.06rem 0;
    }

    .group span:last-of-type i {
        color: #f31717;
        font-style: normal;
    }

    .group {
        height: 0.53rem;
        padding: 0 0.2rem;
    }

    .group span:first-of-type {
        color: #fff;
        background: linear-gradient(90deg, #FF7B1B, #FFA842);
        float: left;
        border-radius: 0.1rem;
        padding: 0.06rem 0.1rem;
    }

    .search-list .search-dl .search-dd .type-row {
        width: 100%;
        padding: 0 0.1rem;

        .search-img {
            width: 2.3rem;
            height: 2.3rem;
            /*border: 1px solid #f2f2f2;*/
            box-shadow: 0 4px 21px 0 rgb(233 233 233 / 55%);
            border-radius: 0.15rem;
            overflow: hidden;
            float: left;
        }

        .right-content {
            float: left;
            width: calc(100vw - 3rem);
            margin: 0 0 0 0.1rem;
            height: 2.3rem;
            border-bottom: 1px solid #eee;
        }

        .search-view-price {
            margin-top: 0.2rem;
        }

        .group-mark {
            height: 0.45rem;
            padding-top: 0.05rem;
        }

        .home-foryou-store {
            padding-bottom: 0.13rem;
        }
    }

    .search .keywords-word {
        padding: 0 0.12rem 0 0.12rem;
        box-sizing: border-box;
        line-height: 0.38rem;
        border-radius: 0.29rem;
        /*margin: 0.1rem 0.2rem 0.1rem 0.2rem;*/
        color: var(--color-text);
        height: 0.38rem;
        /*background: #8C8C8C;
        background-size: 14%;*/
        background-position: 93% center;
    }

    /** 店铺列表样式设置 **/
    .shop-list {
        background: #fff;
        padding: 0.35rem 0 0.15rem;

        .shop-config {
            .shop-logo {
                width: 0.66rem;
                height: 0.66rem;
                box-sizing: border-box;
                border: 1px solid #eee;
                border-radius: 50%;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .shop-name {
                width: 6.2rem;
                margin-left: 0.16rem;
                position: relative;

                :deep(.van-rate__icon--full.van-rate__icon--disabled) {
                    color: #ee0a24;
                }

                .name-text {
                    line-height: 0.31rem;;
                    height: 0.30rem;
                    font-size: 0.24rem;
                    color: var(--color-text);

                    span {
                        height: 0.30rem;
                        display: inline-block;
                        padding: 0 0.1rem;
                        line-height: 0.26rem;
                        margin-left: 0.1rem;
                        box-sizing: border-box;
                    }
                }

                :deep(.van-rate__icon){
                    font-size: 0.18rem;

                }

                :deep(.van-rate) {
                    background: var(--page-bg-color);
                    padding: 0.04rem 0.1rem;
                    border-radius: 0.2rem;
                    margin-right: 0.1rem;
                }

                p {
                    padding: 0.04rem 0;
                    color: #666;
                    font-size: 0.20rem;
                    line-height: 0.2rem;

                    span {
                        display: inline-block;
                        font-size: 0.20rem;
                        line-height: 0.2rem;
                        position: relative;
                        top: -0.02rem;
                    }
                }

                > span {
                    width: 0.86rem;
                    height: 0.44rem;
                    border: 1px solid var(--red-color);
                    border-radius: 0.22rem;
                    position: absolute;
                    line-height: 0.44rem;
                    right: 0;
                    top: 0.08rem;
                    text-align: center;
                    color: var(--red-color);
                    box-sizing: border-box;
                }
            }
        }
    }

    .shop-list li {
        margin: 0 0.2rem 0.18rem;
        /*border-bottom: 1px solid #eee;*/
        padding: 0 0 0.2rem;
    }

    .shop-list li .shop-config {
        width: 100%;
        height: 0.8rem;
        background-color: #fff;
        box-sizing: border-box;
    }

    .shop-list li .shop-photo {
        width: 100%;
        height: 2.3rem;
        background-color: #fff;
        font-size: 0;
        box-sizing: border-box;
        justify-content: space-between;
    }

    .shop-list li .shop-photo .shop-photo-item {
        width: 32%;
        height: 2.3rem;
        position: relative;
        overflow: hidden;
        border-radius: 0.06rem;

        span {
            position: absolute;
            height: 0.30rem;
            background: #000000;
            opacity: 0.5;
            bottom: 0;
            right: 0;
            color: #fff;
            padding: 0 0.1rem;
            font-size: 0.2rem;
            border-radius: 0.06rem 0 0 0;
        }
    }

    .shop-list li .shop-photo img {
        width: 100%;
        height: 100%;
    }


</style>
