<template>
    <div class="search-history">
        <div class="search-history-header s-flex ai-ct" ref="historyHeader">
            <van-icon name="arrow-left" size="18" @click="handleClickRouterBack"/>
            <van-search
                    v-model="info.keywords"
                    placeholder="搜索商品名称/订单编号"
                    left-icon="search"
                    autofocus
                    ref="searchInput"
                    @search="handleSearchConfirm"
            >
                <template #left-icon>
                    <van-icon name="search" size="18"/>
                </template>
            </van-search>
            <div class="search-btn" @click="handleSearchConfirm">搜索</div>
        </div>
        <!--搜索历史列表-->
        <div class="search-history-keywords" v-if="search_keywords_list && search_keywords_list.length">
            <div class="title s-flex" ref="keywordTitle">
                <label class="flex-1">搜索历史</label>
                <em class="iconfont icon-shanchu" @click="handleClickClearKeywords"></em>
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
                <div class="history-more keywords-item van-ellipsis"
                     v-if="is_show_list_more"
                     :class="{ 'history-more-noright': !is_open_list }"
                     @click="handleClickShowMoreKeywords"
                >
                    <em class="iconfont" :class="is_open_list ? 'icon-xiala' : 'icon-to_down'" style="font-size: 0.40rem;"></em>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, getCurrentInstance, watch, computed} from 'vue'
import { useRoute,useRouter } from 'vue-router'
const cns = getCurrentInstance().appContext.config.globalProperties
const route = useRoute()
const router = useRouter()

const info = ref({
    keywords: ''
})
const search_keywords_list = ref([])
const search_keywords_all_list = ref([])
const search_keywords_over_list = ref([])
const is_show_list_more = ref(false)
const is_open_list = ref([])
const keywordItem = ref(null)
const keywordTitle = ref(null)
const historyHeader = ref(null)
const keywordBox =ref(null)

onMounted(() => {
    if (route.query) {
        info.value.keywords = route.query.keywords || ''
    }
    if (localStorage.getItem('orderKeywordList')) {
        search_keywords_all_list.value = search_keywords_list.value = JSON.parse(localStorage.getItem('orderKeywordList'))
    }
    /*搜索历史超出截取处理*/
    nextTick(() => {
        //  设置要截取的索引
        let index = 0
        let children = keywordItem.value
        if (!children) return false
        let boxHeight = ((children[0].clientHeight + parseInt(children[0].style.marginTop)) * 3) + keywordTitle.value.clientHeight + historyHeader.value.clientHeight
        let keyWorldBox = keywordBox.value.clientWidth
        for (let key in children) {
            if (children[key].offsetTop >= boxHeight) {
                if (key - 1) {
                    if (keyWorldBox - children[key - 1].offsetLeft - children[key - 1].clientWidth) {
                        index = (key)
                    }
                }
                break
            }
        }
        //  获取超出2行高度的第一个元素，超过2行截断数据
        if (index > 0) {
            is_show_list_more.value = true
            search_keywords_over_list.value = search_keywords_list.value = search_keywords_all_list.value.slice(0, index)
        } else {
            is_show_list_more.value = false
            search_keywords_over_list.value = search_keywords_list.value = search_keywords_all_list.value
        }
    })
})

const handleClickRouterBack = () =>{
    router.back()
}

const handleSearchConfirm = (value) => {
    const value_type = Object.prototype.toString.call(value).slice(8, -1)
    if (value != '' && value_type == 'String') {
        info.value.keywords = value
    }
    const query = {}
    //  判断搜索关键词，如果关键词为空，则获取占位关键词
    let list = search_keywords_list.value
    if (info.value.keywords != '') {
        query.keywords = info.value.keywords
        list.unshift(info.value.keywords)
        list = [...new Set(list)]
        search_keywords_list.value = list
        localStorage.setItem('orderKeywordList', JSON.stringify(search_keywords_list.value))
    } else {
        cns.$toast('请输入商品名称/货号/订单编号')
        return false
    }
    cns.appRoute('orderSearch', query, 'replace')
    setTimeout(() => info.value.keywords = '', 200)
}

const handleClickClearKeywords =()=>{
    search_keywords_list.value = [];
    localStorage.removeItem('orderKeywordList');
}

const handleClickShowMoreKeywords = () =>{
    is_open_list.value = !is_open_list.value
    search_keywords_list.value = is_open_list.value ? search_keywords_all_list.value : search_keywords_over_list.value
}
</script>

<style lang="scss" scoped>
.search-history {
    height: 100%; background-color: #ffffff;
    .search-history-header { height: 1.10rem; background-color: #ffffff;box-shadow: 0px 2px 3px 0px rgba(219,219,219,0.302); }
    .search-history-header .van-search { width: calc(100% - 30px - 0.6rem); }
    .search-history-header .van-search ::v-deep .van-icon-clear,
    .search-history-header .van-search ::v-deep .van-field__left-icon { height: 0.44rem; }
    .search-history-header .van-search ::v-deep .van-icon-clear { line-height: 0.44rem; }
    .search-history-header .van-search ::v-deep .van-cell__value,
    .search-history-header .van-search ::v-deep .van-field__left-icon { display: flex; align-items: center; }
    .search-history-header .van-search ::v-deep .van-cell__value { flex: 1; }
    .search-history-header .van-search ::v-deep .van-field__body { width: 100%; }
    .search-history-header .van-search ::v-deep .van-field__left-icon { margin-right: 0.10rem; }
    .search-history-header .van-search .van-search__content { border-radius: 0.6rem; }
    .search-history-header .search-back { font-size: 0.44rem; padding-left: 0.10rem; }
    .search-history-header .search-btn { width: 0.70rem; font-size: 0.28rem; line-height: 0.70rem; color: #666; font-weight: 400; }
    /*搜索历史*/
    .search-history-keywords { padding: 0 0.30rem; }
    .search-history-keywords .title { padding-top: 0.15rem; }
    .search-history-keywords .title em,
    .search-history-keywords .title label { font-size: 0.28rem; font-weight: 600; color: #343434; position: relative; }
    .search-history-keywords .keywords-list { flex-flow: row wrap; padding: 0.10rem 0; }
    .search-history-keywords .keywords-list .keywords-item { height: 0.44rem; line-height: 0.44rem; padding: 0 0.20rem; margin-top: 10px; margin-right: 0.10rem; text-align: right; font-size: 0.20rem; color: #343434; background-color: #F2F2F2; border-radius: 0.60rem; float: left; }
    .search-history-keywords .keywords-list .history-more { padding: 0 4px !important;; margin: 10px 0.20rem 0 0; }
    .search-history-keywords .keywords-list .history-more.history-more-noright { margin-right: 0 !important; }
}
</style>
