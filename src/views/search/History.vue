<template>
    <div class="search-history">
        <div class="search-history-header s-flex ai-ct" ref="historyHeader">
            <em class="search-back iconfont" @click="handleClickRouterBack">&#xe605;</em>
            <van-search
                v-model="info.keywords"
                :placeholder="search_placeholder || '请输入搜索关键词'"
                left-icon="search"
                ref="searchInput"
                @search="handleSearchConfirm"
                @input="handleInputSearchOptions"
            >
                <template #left-icon>
                    <em class="iconfont cursor-p" style="color: var(--color-text-desc);padding:0;font-size: 0.36rem;">&#xe7c3;</em>
                </template>
            </van-search>
            <div class="search-btn" @click="handleSearchConfirm">搜索</div>
        </div>
        <!--搜索关键词下拉数据-->
        <div class="search-history-options" v-if="search_keywords_optiosn.length">
            <van-cell v-for="(item, index) in search_keywords_optiosn" :key="index" :title="item" @click="handleSearchConfirm(item)" />
        </div>
        <template v-else>
            <!--搜索历史列表-->
            <div class="search-history-keywords" v-if="search_keywords_list && search_keywords_list.length">
                <div class="title s-flex" ref="keywordTitle">
                    <label class="flex-1">搜索历史</label>
                    <em class="iconfont" @click="handleClickClearKeywords">&#xe666;</em>
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
                        <em class="iconfont" style="font-size: 0.40rem;">{{ is_open_list ? '&#xe6b2;' : '&#xe604;' }}</em>
                    </div>
                </div>
            </div>
            <!--搜索发现列表-->
            <div class="search-history-keywords search-history-find" v-if="searchFind && searchFind.length">
                <div class="title s-flex ai-ct" ref="keywordTitle">
                    <label class="flex-1">搜索发现</label>
                    <em class="iconfont" style="font-size: 0.32rem;" @click="is_show_find = !is_show_find">{{ is_show_find ? '&#xe681;' : '&#xe67d;' }}</em>
                </div>
                <div class="keywords-list s-flex ai-ct" v-if="is_show_find">
                    <div class="keywords-item van-ellipsis" v-for="(item, index) in searchFind" :key="index" @click="handleClickSearchFindItem(item)">
                        <template v-if="item.web_path">{{item.title}}</template>
                    </div>
                </div>
                <p v-else class="co-999" style="text-align: center; padding: 0.40rem 0;">已隐藏搜索发现</p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const router = useRouter();
const route = useRoute();

const router_name = ref('search');
const router_url = ref('');
const router_url_alias = ref('');
const from_path_name = ref('');
const search_placeholder = ref('');
const info = reactive({
    keywords: '',
});
const search_keywords_optiosn = ref([]);
const search_keywords_list = ref([]);
const search_keywords_all_list = ref([]);
const search_keywords_over_list = ref([]);
const is_show_list_more = ref(false);
const is_open_list = ref(false);
const search_keywords_find = ref([]);
const is_show_find = ref(true);


const searchFind = [
    {
        "title": "\u91d1\u7ea2\u77f3",
        "app_path": "tooduduapp:\/\/toodudu.com\/shopcrop?type=1&title=\u91d1\u7ea2\u77f3",
        "web_path": "https:\/\/test-tooduduh5.ptdplat.com\/#\/supermarket?type=1&title=\u91d1\u7ea2\u77f3",
        "mini_url": "\/pages\/zhuanti\/shopcrop?type=1&title=\u91d1\u7ea2\u77f3"
    },
    {
        "title": "\u8367\u5149\u5242",
        "app_path": "tooduduapp:\/\/toodudu.com\/try_center?title=\u8367\u5149\u5242",
        "web_path": "https:\/\/test-tooduduh5.ptdplat.com\/#\/try?title=\u8367\u5149\u5242",
        "mini_url": "\/pages\/try\/list?title=\u8367\u5149\u5242"
    },
    {
        "title": "\u6eb6\u5242",
        "app_path": "tooduduapp:\/\/toodudu.com\/integral?title=\u6eb6\u5242",
        "web_path": "https:\/\/test-tooduduh5.ptdplat.com\/#\/integral?title=\u6eb6\u5242",
        "mini_url": "https:\/\/test-tooduduh5.ptdplat.com\/#\/integral?title=\u6eb6\u5242"
    },
    {
        "title": "\u949b\u767d\u7c89",
        "app_path": "tooduduapp:\/\/toodudu.com\/goods?goods_id=1218&title=\u949b\u767d\u7c89",
        "web_path": "https:\/\/test-tooduduh5.ptdplat.com\/#\/good?goods_id=1218&title=\u949b\u767d\u7c89",
        "mini_url": "\/pages\/good\/detail?goods_id=1218&title=\u949b\u767d\u7c89"
    }
]

watch(
    () => info.keywords,
    (value) => {
        info.keywords = value;
    }
);

watch(
    () => route,
    (to, from) => {
        from_path_name.value = from.name;
    },
    { deep: true }
);

const computedDataType = computed(() => {
    return function (value) {
        const type = Object.prototype.toString.call(value).slice(8, -1);
        return type;
    };
});

const handleClickRouterBack = () => {
    router.back();
};

const isValidHttpUrl = (string) => {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
};

const handleSearchConfirm = (value) => {
    const value_type = Object.prototype.toString.call(value).slice(8, -1);
    if (value != '' && value_type == 'String') {
        info.keywords = value;
        search_placeholder.value = '';
    }
    const params = {};
    let list = [];
    if (info.keywords != '') {
        params.keywords = info.keywords;
        info.keywords.trim() && list.unshift(info.keywords);
        list = [...new Set(list)];
        search_keywords_list.value = list;
        localStorage.setItem('keywordList', JSON.stringify(search_keywords_list.value));
    } else if (search_placeholder.value && (router_url.value || (router_url_alias.value && router_url_alias.value == 'customer_service'))) {
        if (router_url_alias.value == 'customer_service') {
            handleCheckServiceVolcengine();
        } else {
            if (isValidHttpUrl(router_url.value)) {
                locationUrl(router_url.value);
            } else {
                $toast('无效链接地址');
            }
        }
        return false;
    }
    params.search_source = '首页';
    if (from_path_name.value == router_name.value) {
        if (cookies.get('back_search_keywords')) {
            cookies.remove('back_search_keywords');
        }
        cookies.set('back_search_keywords', params);
        router.back();
    } else {
        appRoute(router_name.value, {}, params, 'replace');
    }
    setTimeout(() => info.keywords = '', 200);
};

const handleInputSearchOptions = (value) => {
    setTimeout(() => {
        $http.doPost("v3/search/keywords", { keywords: value }).then(res => {
            if (res.code == 200) {
                search_keywords_optiosn.value = res.data;
            }
        });
    }, 300);
};

const handleClickClearKeywords = () => {
    search_keywords_list.value = [];
    localStorage.removeItem('keywordList');
};

const handleClickShowMoreKeywords = () => {
    is_open_list.value = !is_open_list.value;
    search_keywords_list.value = is_open_list.value ? search_keywords_all_list.value : search_keywords_over_list.value;
};

const handleCheckServiceVolcengine = () => {
    $http.doPost('v3/chatUrl', { source_url: window.location.href }).then(res => {
        if (res.code == 200) {

            if ($platform.is_wx()) {
                $volcengine.getCollectToken().then((token) => {
                    let hs_uuid = (token.user_unique_id == token.web_id) ? token.web_id : token.user_unique_id;
                    locationUrl(`${res.data.chat_url}&hs_uuid=${hs_uuid}&v=${(new Date().getTime())}`);
                });
            } else {
                $volcengine.getCollectToken().then((token) => {
                    let hs_uuid = (token.user_unique_id == token.web_id) ? token.web_id : token.user_unique_id;
                    locationUrl(`${res.data.chat_url}&hs_uuid=${hs_uuid}`);
                });
            }
        } else {
            $toast(res.message);
        }
    });
};

const handleClickSearchFindItem = (item) => {
    if (item.web_path) {
        if ($platform.is_app() && item.app_path) {
            $platform.appRouteTo(item.app_path, true);
        } else {
            locationUrl(item.web_path);
        }
    }
};

onMounted(() => {
    if (route.query) {
        router_url_alias.value = route.query.alias || '';
        router_url.value = route.query.url || '';
        router_name.value = route.query.type || 'search';
        from_path_name.value = route.query.name || '';
        search_placeholder.value = route.query.placeholder || '';
        info.keywords = route.query.keywords || '';
    }
});

onBeforeMount(() => {
    if (localStorage.getItem('keywordList')) {
        search_keywords_all_list.value = search_keywords_list.value = JSON.parse(localStorage.getItem('keywordList'));
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
    .search-history-keywords .title em,
    .search-history-keywords .title label { font-size: 0.28rem; font-weight: 600; color: #343434; position: relative; }
    .search-history-keywords .keywords-list { flex-flow: row wrap; padding: 0.10rem 0; }
    .search-history-keywords .keywords-list .keywords-item { height: 0.44rem; line-height: 0.44rem; padding: 0 0.20rem; margin-top: 10px; margin-right: 0.10rem; text-align: right; font-size: 0.20rem; color: #343434; background-color: var(--page-bg-color); border-radius: 0.60rem; float: left; }
    .search-history-keywords .keywords-list .history-more { padding: 0 4px !important;; margin: 10px 0.20rem 0 0; }
    .search-history-keywords .keywords-list .history-more.history-more-noright { margin-right: 0 !important; }
    /*搜索发现*/
    .search-history-find .keywords-list .keywords-item { width: 40%; text-align: left; margin-bottom: 0.10rem; background: none; font-size: 0.24rem; }
    .search-history-find .title label::before { content: ''; width: 0.50rem; height: 0.05rem; padding: 0 0 0.12rem; background-image: url('@/assets/images/search/active_border.png'); background-position: center bottom; background-repeat: no-repeat; background-size: 0.50rem 0.05rem; position: absolute; bottom: -2px; left: 0.32rem; }
}
</style>
