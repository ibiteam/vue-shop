<template>
    <div class="search-history">
        <div class="search-history-header s-flex ai-ct" ref="historyHeader">
            <em class="search-back iconfont" @click="handleClickRouterBack">&#xe607;</em>
            <van-search
                v-model="info.keywords"
                :placeholder="search_placeholder || '请输入搜索关键词'"
                left-icon="search"
                ref="searchInput"
                @search="handleSearchConfirm"
                @input="handleInputSearchOptions"
            >
                <template #left-icon>
                    <em class="iconfont cursor-p" style="color: var(--color-text-desc);padding:0;font-size: 0.36rem;">&#xe60a;</em>
                </template>
            </van-search>
            <div class="search-btn" @click="handleSearchConfirm(info.keywords || search_placeholder)">搜索</div>
        </div>
        <!--搜索关键词下拉数据-->
        <div class="search-history-options" v-if="searchKeywordsOptiosn.length">
            <van-cell v-for="(item, index) in searchKeywordsOptiosn" :key="index" :title="item" @click="handleSearchConfirm(item)" />
        </div>
        <template v-else>
            <!--搜索历史列表-->
            <div class="search-history-keywords" v-if="search_keywords_list && search_keywords_list.length">
                <div class="title s-flex" ref="keywordTitle">
                    <label class="flex-1">搜索历史</label>
                    <em class="iconfont co-666" @click="handleClickClearKeywords">&#xe79b;</em>
                </div>
                <div class="keywords-list s-flex" ref="keywordBox">
                    <div class="keywords-item van-ellipsis"
                         v-for="(item, index) in search_keywords_list"
                         :key="index"
                         ref="keywordItem"
                         style="margin: 10px 10px 0 0;"
                         @click="handleSearchConfirm(item)">
                        <template v-if="item">{{item}}</template>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import {ref, reactive, watch, computed, onMounted, onBeforeMount, onActivated} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import $public from '@/utils/public'
import {searchKeywordsPull} from '@/api/search'
import { isSuccessCode } from "@/utils/constant.js";

const router = useRouter();
const route = useRoute();

const search_placeholder = ref('');
const info = reactive({
    keywords: '',
});
const searchKeywordsOptiosn = ref([]);
const search_keywords_list = ref([]);

watch(
    () => info.keywords,
    (value) => {
        info.keywords = value;
    }
);

const handleClickRouterBack = () => {
    if(searchKeywordsOptiosn.value.length){
        searchKeywordsOptiosn.value = []
    }else{
        router.back();
    }
};

const handleSearchConfirm = (value) => {
    const value_type = Object.prototype.toString.call(value).slice(8, -1);
    if (value != '' && value_type == 'String') {
        info.keywords = value;
        search_placeholder.value = '';
    }
    const params = {};
    let list = [...search_keywords_list.value];
    if (info.keywords != '') {
        params.keywords = info.keywords;
        info.keywords.trim() && list.unshift(info.keywords);
        list = [...new Set(list)];
        search_keywords_list.value = list.slice(0, 20); // 关键词只保存前20个
        localStorage.setItem('keywordList', JSON.stringify(search_keywords_list.value));
    }
    router.push({
        name:'search',
        query: params
    })
    setTimeout(() => info.keywords = '', 200);
};

const handleInputSearchOptions = $public.debounce(() => {
	if(!info.keywords){
		searchKeywordsOptiosn.value = []
		return
	}
	searchKeywordsPull(info.keywords).then(res => {
        if (isSuccessCode(res)) {
            searchKeywordsOptiosn.value = res.data;
        }
    });
},300);

const handleClickClearKeywords = () => {
    search_keywords_list.value = [];
    localStorage.removeItem('keywordList');
};

onMounted(() => {
    if (route.query) {
        search_placeholder.value = route.query.placeholder || '';
        info.keywords = route.query.keywords || '';
    }
});

onBeforeMount(() => {
    if (localStorage.getItem('keywordList')) {
        search_keywords_list.value = JSON.parse(localStorage.getItem('keywordList'));
    }
});
</script>

<style lang="scss" scoped>
.search-history {
    height: 100%; background-color: #ffffff;
    .search-history-header { height: 1.10rem; background-color: #ffffff; }
    .search-history-header .van-search { width: calc(100% - 30px - 0.6rem); }
    .search-history-header :deep(.van-search) .van-icon-clear,
    .search-history-header :deep(.van-search) .van-field__left-icon { height: 0.44rem; }
    .search-history-header :deep(.van-search) .van-icon-clear { line-height: 0.44rem; }
    .search-history-header :deep(.van-search) .van-cell__value,
    .search-history-header :deep(.van-search) .van-field__left-icon { display: flex; align-items: center; }
    .search-history-header :deep(.van-search) .van-cell__value { flex: 1; }
    .search-history-header :deep(.van-search) .van-field__body { width: 100%; }
    .search-history-header :deep(.van-search) .van-field__left-icon { margin-right: 0.10rem; }
    .search-history-header :deep(.van-search) .van-search__content { border-radius: 0.6rem; }
    .search-history-header .search-back { font-size: 0.44rem; padding-left: 0.10rem; }
    .search-history-header .search-btn { width: 0.70rem; font-size: 0.28rem; line-height: 0.70rem; color: #666; font-weight: 400; }
    /*搜索下拉*/
    .search-history-options { max-height: calc(100% - 1.10rem); overflow-y: auto; overflow-x: hidden; }
    /*搜索历史*/
    .search-history-keywords { padding: 0 0.30rem; }
    .search-history-keywords .title { padding-top: 0.15rem; }
    .search-history-keywords .title label { font-size: 0.28rem; font-weight: 600; color: #343434; position: relative; }
	.search-history-keywords .title em{ font-weight: normal; color: #666;}
    .search-history-keywords .keywords-list { flex-flow: row wrap; padding: 0.10rem 0; }
    .search-history-keywords .keywords-list .keywords-item { height: 0.44rem; line-height: 0.44rem; padding: 0 0.20rem; margin-top: 10px; margin-right: 0.10rem; text-align: right; font-size: 0.20rem; color: #343434; background-color: var(--page-bg-color); border-radius: 0.60rem; float: left; }
    .search-history-keywords .keywords-list .history-more { padding: 0 4px !important;; margin: 10px 0.20rem 0 0; }
    .search-history-keywords .keywords-list .history-more.history-more-noright { margin-right: 0 !important; }
    /*搜索发现*/
    .search-history-find .keywords-list .keywords-item { width: 40%; text-align: left; margin-bottom: 0.10rem; background: none; font-size: 0.24rem; }
    .search-history-find .title label::before { content: ''; width: 0.50rem; height: 0.05rem; padding: 0 0 0.12rem; background-image: url('@/assets/images/search/active_border.png'); background-position: center bottom; background-repeat: no-repeat; background-size: 0.50rem 0.05rem; position: absolute; bottom: -2px; left: 0.32rem; }
}
</style>
