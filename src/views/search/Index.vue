<template>
    <div class="search-index">
        <!--搜索历史-->
        <!--<div class="home-history">-->
        <!--    <van-popup v-model="showHomeHis" position="static" :style="{ height: '100%', paddingTop: '0px' }"-->
        <!--               style="width: 100%; top: 0; bottom: 0; left: 0; right: 0;" :duration="0.1">-->
        <!--        <form action="javascript:return true" ref="historyHeader">-->
        <!--            <span class="iconfont" @click="onHomeCancel">&#xe605;</span>-->
        <!--            <van-search-->
        <!--                v-model="keywords"-->
        <!--                :placeholder="searchKey"-->
        <!--                left-icon="search"-->
        <!--                @search="onHomeSearch"-->
        <!--                @input="inputSearchKeydown"-->
        <!--            >-->
        <!--                <template #left-icon>-->
        <!--                    <em class="iconfont cursor-p" style="color: var(&#45;&#45;color-text-desc);padding:0;font-size: 14px;">&#xe610;</em>-->
        <!--                </template>-->
        <!--            </van-search>&lt;!&ndash;                        show-action @cancel="onHomeCancel"&ndash;&gt;-->
        <!--            <input type="search" style="display: none;">-->
        <!--            <span class="search-btn" @click="onSearch">搜索</span>-->
        <!--        </form>-->
        <!--        <div class="search-recommend" v-if="listenKeywords.length > 0">-->
        <!--            <van-cell v-for="(item,i) in listenKeywords" :title="item" @click="clickSearchRecommend(item)"-->
        <!--                      :key="`${i}_${item}`"/>-->
        <!--        </div>-->
        <!--        <div class="home-keywords" v-if="keywordList && keywordList.length > 0 && listenKeywords.length == 0">-->
        <!--            <div class="title s-flex" ref="keywordTitle">-->
        <!--                <label class="flex-1">搜索历史</label>-->
        <!--                <em class="iconfont" @click="clickRemoveKey">&#xe666;</em>-->
        <!--            </div>-->
        <!--            <div class="keywords-list s-flex" ref="keywordBox">-->
        <!--                <div class="keywords-item van-ellipsis" v-for="(item, index) in keywordList" :key="index"-->
        <!--                     ref="keywordItem"-->
        <!--                     v-if="item"-->
        <!--                     style="margin: 10px 10px 0 0;"-->
        <!--                     @click="clickHisKeyItem(item)">{{item}}-->
        <!--                </div>-->
        <!--                <div v-if="keyWordMore" class="history-more keywords-item van-ellipsis"-->
        <!--                     :class="{'history-more-noright':!keyWordOpen}"><em class="iconfont"-->
        <!--                                                                        @click="clickToggleKeyList"-->
        <!--                                                                        style="font-size: 0.40rem;">{{keyWordOpen-->
        <!--                    ? '&#xe6b2;' : '&#xe604;'}}</em></div>-->
        <!--            </div>-->
        <!--        </div>-->
        <!--        <div class="home-keywords home-discover"-->
        <!--             v-if="$bus.searchFind&&$bus.searchFind.length&&listenKeywords.length == 0">-->
        <!--            <div class="title s-flex">-->
        <!--                <label class="flex-1"><span>搜索发现</span></label>-->
        <!--                <span @click="clickToggleVisible"><em-->
        <!--                    class="iconfont">{{clickToggleValue?'&#xe681':'&#xe67d'}}</em></span>-->
        <!--            </div>-->
        <!--            <div class="keywords-list s-flex" v-if="clickToggleValue">-->
        <!--                <div class="keywords-item van-ellipsis" v-for="(item, index) in $bus.searchFind" :key="index"-->
        <!--                     v-if="item.web_path" @click="clickSearchFind(item)">{{item.title}}-->
        <!--                </div>-->
        <!--            </div>-->
        <!--            <p v-else class="co-999" style="text-align: center;padding: 0.4rem 0;">已隐藏搜索发现</p>-->
        <!--        </div>-->
        <!--    </van-popup>-->
        <!--</div>-->
        <van-sticky>
            <div class="search-selection" :style="{ position: (brandDownShow?'fixed':'static'), top: 0 }"
                 style="background: var(--page-bg-color);"
                 @touchmove.prevent @mousemove.prevent>
                <div class="search-box backF bg-fff">
                    <span class="iconfont" @click="$router.back()" style="font-size: 24px;margin-left: 0;">&#xe605;</span>
                    <div class="search" @click="hisSearchCancel">
                        <span class="iconfont icon" style="color: var(--color-text-desc);font-size: 14px;">&#xe610;</span>
                        <p class="van-ellipsis keywords-word" v-if="keywords">
                            {{keywords}}<!--<i class="iconfont icon" style="margin-left: 0.05rem;"
                                           @click.stop="clearKeyword">&#xe68c;</i>-->
                        </p>
                        <p v-else style="padding-left: 8px;color: #bbb;">{{searchKey}}</p>
                    </div>
                    <div class="text" @click="rank=!rank">
                        <!--<img :src="rank?require('@/assets/images/search/search_type_row_2.png'):require('@/assets/images/search/search_type_row_1.png')">-->
                        <!--<img :src="require(`${rank?'@/assets/images/search/search_type_row_2':'@/assets/images/search/search_type_row_1'}.png`)" alt="">-->
                        <img :src="rank?searchType1:searchType2" alt="">
                    </div>
                </div>
                <div class="search-filter s-flex backF bg-fff">
                    <div class="filter-item" :class="{ active : searchType == '' }" @click="searchTypeChange('')">综合排序
                    </div>
                    <div class="filter-item" :class="{ active : searchType == 'sale_desc'}"
                         @click="searchTypeChange('sale_desc')">销量
                    </div>
                    <div class="filter-item filter-price s-flex"
                         :class="{ active : searchType == 'price_asc' || searchType == 'price_desc' }"
                         @click="searchTypeChange('price')">
                        <span>价格</span>
                        <div>
                            <em class="iconfont" :class="{ active : searchType == 'price_asc' }">&#xe6b2;</em>
                            <em class="iconfont" :class="{ active : searchType == 'price_desc' }">&#xebbe;</em>
                        </div>
                    </div>
                    <div class="filter-item" :class="{ active : searchType == 'shop' }"
                         @click="searchTypeChange('shop')">店铺
                    </div>
                    <div class="filter-item filter-select" :class="{ active : searchType == 'select' }"
                         @click="searchTypeChange('select')">
                        <span>{{(haveBrandSelected||minPrice||maxPrice)?'已':''}}筛选 <em
                            class="iconfont">&#xe68d;</em></span>
                    </div>
                </div>
                <van-popup v-model="selectShow" position="right" :round='true'
                           :style="{ height: '100%',width:'90%',left:'auto !important' }">
                    <div class="select-wrap">
                        <div class="brand-dropdown price MB20" style="padding-top: 0.2rem;height: 1.6rem;">
                            <h4>价格区间</h4>
                            <div class="form-price">
                                <van-field v-model="minPrice" type="number" placeholder="最低价"
                                           :formatter="formatterFilterprice"
                                           format-trigger="onBlur"/>
                                <span>-</span>
                                <van-field v-model="maxPrice" type="number" placeholder="最高价"
                                           :formatter="formatterFilterprice"
                                           format-trigger="onBlur"/>
                            </div>
                        </div>
                        <div class="brand-dropdown" style="height: calc(100vh - 2rem);">
                            <h4>品牌</h4>
                            <ul>
                                <li class="elli-psis" v-for="(item, index) in brandList"
                                    @click="clickBrandItem(item, index)" :class="{ active : item.selected }"
                                    :key="`${index}_brand`">
                                    <span>{{ item.brand_name }}</span>
                                </li>
                                <li v-if="brandList.length%3==2" style="background: none;border:none;"></li>
                            </ul>
                            <div class="brand-btns s-flex">
                                <div class="reset" @click="clickResetSelect">重置</div>
                                <div class="confirm" @click="clickConfirmSelect">确定</div>
                            </div>
                        </div>
                    </div>
                </van-popup>
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
                <van-sticky :offset-top="viewHeightForYou" v-if="searchType !== 'shop'&&!listNoData&&info.keywords">
                    <p class="result">
                        为您显示“<span>{{info.keywords.length>15?info.keywords.substr(0,15)+'..':info.keywords}}</span>”相关的搜索结果
                    </p>
                </van-sticky>
                <div class="noData" v-if="searchType === 'shop'&&listNoData" style="padding-top: 1.5rem;">
                    <img class="noImg" src="@/assets/images/search/nodata.png"/>
                    <div class="noTex">没有符合条件的内容</div>
                </div>
                <template v-if="searchType === 'shop'">
                    <ul class="shop-list" v-if="shopList.length">
                        <li v-for="(item ,index) in shopList" :key="`${index}_shop`">
                            <div class="shop-config s-flex">
                                <div class="shop-logo">
                                    <img
                                        :src="item.shop_logo?item.shop_logo:require('@/assets/images/search/shop_default.png')"
                                        alt="">
                                </div>
                                <div class="shop-name elli-psis">
                                    <div class="name-text">
                                        <i style="float: left;font-style: normal;">{{ item.shop_name.length>11?item.shop_name.substr(0,10)+'...': item.shop_name}}</i>
                                        <span class="isZiying" :class="{'def':item.is_ziying==0}" style="float: left;font-style: normal;">{{item.shop_sign}}</span>
                                    </div>
                                    <p>
                                        <van-rate v-model="item.rank" readonly color="#F71111" void-color="#dddddd" void-icon="star"/>
                                        <span>{{item.focus_counts}}人关注</span></p><!--formatNum(item.focus_counts)-->
                                    <span @click="goStore(item.seller_id)">进店</span>
                                </div>
                            </div>
                            <div class="shop-photo s-flex">
                                <div class="shop-photo-item" v-for="g in item.list"
                                     :key="`s_shop${index}_${g.goods_id}`" @click="appRoute('good', {}, { goods_id: g.goods_id })">
                                    <van-image :src="g.goods_thumb+'?imageView2/1/w/230/h/230'" width="100%"
                                               height="100%">
                                        <template v-slot:loading>
                                            <img src="@/assets/images/search/app_nopic.png" alt="">
                                        </template>
                                        <template v-slot:error>
                                            <img src="@/assets/images/search/app_nopic.png" alt="">
                                        </template>
                                    </van-image>
                                    <span>￥{{g.shop_price_format}}/{{g.unit}}</span>
                                </div>
                                <div class="shop-photo-item" v-if="item.list.length==2"></div>
                            </div>
                        </li>
                    </ul>
                </template>

                <div class="search-dl" v-else>
                    <div class="search-dd flex-pack-justify flex-wrap s-flex">
                        <div class="search-li" v-for="(item, index) in searchList" :class="{'type-row':rank,hf:isHf}"
                             @click="routerGoodsDetail(item.goods_id)"
                             :key="`${index}_good`">
                            <div>
                                <div class="search-img">
                                    <van-image :src="item.goods_thumb+'?imageView2/1/w/350/h/350'" width="100%"
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
                                    {{ item.goods_name }}
                                </div>
                                <div class="search-view-price s-flex">
                                    <form-price :price="item.shop_price" :unit="item.unit"
                                                :unit_color="'#333'"></form-price>
                                </div><!--<i>AppConfig.currency_sign</i>-->
                                <div class="group-mark">
                                    <span v-if="item.shop_sign && item.is_ziying >= 0" class="isZiying"
                                          :class="{ def: item.is_ziying == 0 }" style="margin:0 0.05rem 0 0;">{{item.shop_sign}}</span>
                                    <span class="attribute" v-if="item.attribute_source">{{item.attribute_source==1?'现货':'期货'}}</span>
                                    <span class="mark-border"
                                          v-if="item.act_type==1||item.act_type==2||item.act_type==6">{{item.act_type==1?'秒杀':item.act_type==2?'特卖':item.act_type==6?'满减':''}}</span>
                                    <span class="mark-border" v-if="item.is_group">拼团</span>
                                    <span class="mark-border mark-vip" v-if="item.act_type==11">VIP</span>
                                </div>
                                <!--                                <div class="group" v-if="item.is_group">-->
                                <!--                                    <span>{{item.group.people_number}}人团</span>-->
                                <!--                                    <span>优惠<i>{{item.group.price}}</i>/{{item.unit
                                }}</span>-->
                                <!--                                </div>-->
                                <!--                                <div class="home-foryou-store povf_ell" style="margin: 0;height: 0.35rem;"-->
                                <!--                                     @click="routerStoreDetail(item.seller_id)">-->
                                <!--                                    <i>{{item.shop_name
                                }}</i><span class="iconfont">&#xe60b</span>-->
                                <!--                                </div>-->
                                <div class="s-flex ai-ct MT10 shop-enter"
                                     @click.stop="routerStoreDetail(item.seller_id)"
                                     style="padding: 0 0.15rem 0.10rem;">
                                    <div class="fs20 "
                                         style="line-height:0.30rem;color: #666;padding-right: 0.18rem;overflow: hidden;text-overflow: ellipsis;height: 0.3rem;">
                                        {{item.shop_name}}
                                    </div>
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
import searchType1 from '@/assets/images/search/search_type_row_2.png'
import searchType2 from '@/assets/images/search/search_type_row_1.png'

const route = useRoute();
const router = useRouter();

const keywordItem = ref(null)
const keywordTitle = ref(null)
const historyHeader = ref(null)
const keywordBox = ref(null)


const isHf = ref(false);
const showHomeHis = ref(false);
const keywords = ref(route.query.keywords);
const keywordList = ref([]);
const keywordOverList = ref([]);
const keywordAllList = ref([]);
const keyWordMore =  ref(false)
const keyWordOpen =  ref(false)
const listenKeywords =  ref([])
const viewHeightForYou =  ref('0')
const searchKey = route.query.hotKeywords || '搜索关键字'
const clickToggleValue = ref(true)
const brandDownShow = ref(false)
const rank = ref(false)
const searchType = ref('')
const selectShow = ref(false)
const info = reactive({
    brand_id: route.query.brand_id,
    cat_id: route.query.cat_id,
    keywords: route.query.keywords,
    page: 1,
    sort_type: null,
})
const brandList = ref([]);
const haveBrandSelected = ref(false)
const shopInfo = reactive({
    page: 1,
    keywords: route.query.keywords,
    cat_id: route.query.cat_id,
})
const minPrice = ref('')
const maxPrice = ref('')

const shopList = ref([])
const loading = ref(false)
const finished = ref(false)

const searchList = ref([])
const listNoData = ref(false)
const show_back = ref(false)

onBeforeRouteLeave((to, from, next) => {
    if (
        to.name === 'home' ||
        to.name === 'cart' ||
        to.name === 'category' ||
        to.name === 'industry' ||
        to.name === 'publicPage' ||
        to.name === 'search_history'
    ) {
        from.meta.keepAlive = false;
    } else {
        from.meta.keepAlive = true;
    }
    next();
});

const setTop = () => {
    document.documentElement.scrollTop = document.body.scrollTop = 0;
}

const formatterFilterprice = computed((value) => {
    let arr = value.split('.')
    if (arr[1]) {
        return arr[0] + '.' + (arr[1].length > 2 ? arr[1].substr(0, 2) : arr[1])
    } else {
        return value
    }
})

const clickToggleKeyList = () => {
    keyWordOpen.value = !keyWordOpen.value
    keywordList.value = keyWordOpen.value ? keywordAllList.value : keywordOverList.value
}

const routerGoodsDetail = (id) => {
    let params = {'goods_id': id}
    let query = {'goods_id': id}
    appRoute('good', params, query)
}

const routerStoreDetail = (id) => {
    let params = {'seller_id': id}
    let query = {'seller_id': id}
    appRoute('store_index', params, query)
}

/** 点击品牌筛选 **/
const clickBrandItem = (item, index) => {

    if (brandList.value[index]["selected"]) {
        brandList.value[index]["selected"] = false;
        brandList.value[index]["selectsave"] = true;
    } else {
        brandList.value[index]["selected"] = true;
        brandList.value[index]["selectsave"] = false;
    }
    // haveBrandSelected
    brandList.value[index] = brandList.value[index]
    haveBrandSelected.value = false
    brandList.value.length && brandList.value.forEach(d => {
        if (d.selected) {
            haveBrandSelected.value = true
        }
    })
}

const searchData = (first) => {
    if (searchType.value == 'shop') {
        haveBrandSelected.value = false
        Object.assign(shopInfo,{
            ...shopInfo,
            page:1,
            keywords:keywords.value
        })
        let params = JSON.parse(JSON.stringify(shopInfo))
        if (route.query.cat_id && params.cat_id&& route.query.keywords == params.keywords) {
            params.keywords = ''
        }else {
            params.cat_id=''
            Object.assign(shopInfo,{
                ...shopInfo,
                cat_id:'',
            })
        }
        searchShopAxios(params).then(res => {
            if (res.code == 200) {
                shopList.value = res.data.list;
                if (route.query.cat_id && params.cat_id && route.query.keywords != res.data.keywords) {
                    Object.assign(shopInfo,{
                        ...shopInfo,
                        cat_id:'',
                    })
                }
                listNoData.value = !res.data.list.length
                if (res.data.list.length < res.meta.pagination.per_page) {
                    finished.value = false;
                }
                Object.assign(shopInfo,{
                    ...shopInfo,
                    page:shopInfo.page++,
                })
            } else {
                showToast('请求参数错误')
            }
        })
    } else {
        Object.assign(info,{
            ...info,
            page:1,
        })
        let ids = []
        let params = JSON.parse(JSON.stringify(info))
        if (((route.query.cat_id && params.cat_id && route.query.cat_id==params.cat_id )||(route.query.brand_id && params.brand_id&&route.query.brand_id==params.brand_id)) && route.query.keywords == params.keywords) {
            params.keywords = ''
        }else {
            params.cat_id = ''
            params.brand_id = ''
        }
        if(!first){
            brandList.value.length && brandList.value.forEach(d => {
                if (d.selected) {
                    ids.push(d.brand_id)
                }
            })
            params.brand_id = ids.join(",")
        }
        searchAxios(params).then(res => {
            if (res.code == 200) {
                listNoData.value = !res.data.list.length
                Object.assign(info,{
                    ...info,
                    keywords:res.data.keywords
                })
                keywords.value = res.data.keywords
                if (((route.query.cat_id && params.cat_id && route.query.cat_id==params.cat_id )||(route.query.brand_id && params.brand_id&&route.query.brand_id==params.brand_id))   && route.query.keywords != res.data.keywords) {
                    Object.assign(info,{
                        ...info,
                        cat_id:'',
                        brand_id:'',
                    })
                }
                // 如果购物车找相似进来，则获取到cat_id返回的kewwords时，清除cat_id
                if (res.data.list.length < res.meta.pagination.per_page) {
                    finished.value = false;
                }
                searchList.value = res.data.list;
                if(!params.brand_id){
                    brandList.value = res.data.brands
                }
                if(first && route.query.brand_id==params.brand_id){
                    brandList.value = res.data.brands
                }
                if(route.query.brand_id && first){
                    brandList.value.forEach(d => {
                        if (d.brand_id==route.query.brand_id) {
                            d.selected=true
                            haveBrandSelected.value = true
                        }
                    })
                }
                Object.assign(info,{
                    ...info,
                    page:info.page++,
                })
            }
        })
    }
}

/** 上拉加载 **/
const loadMore = () => {
    if (searchType.value === 'shop') {
        if (shopList.value.length >= 10) {
            setTimeout(() => {
                let params = JSON.parse(JSON.stringify(shopInfo))
                if (route.query.cat_id && params.cat_id && route.query.keywords == params.keywords) {
                    params.keywords = ''
                }else {
                    params.cat_id=''
                    Object.assign(shopInfo,{
                        ...shopInfo,
                        cat_id:''
                    })
                }
                searchShopAxios(params).then(res => {
                    if (res.code == 200) {
                        loading.value = false;
                        if (res.data.list.length == 0) {
                            finished.value = true;
                            return;
                        } else {
                            if (shopInfo.page == 1) {
                                shopList.value = res.data.list;
                            } else {
                                for (var key in res.data.list) {
                                    shopList.value.push(res.data.list[key]);
                                }
                            }
                        }
                        Object.assign(shopInfo,{
                            ...shopInfo,
                            page:shopInfo.page++
                        })
                    }
                    loading.value = false;
                })
            }, 200)
        } else {
            loading.value = false;
            finished.value = false;
        }
    } else {
        if (searchList.value.length >= 10) {
            setTimeout(() => {
                let ids = []
                let params = JSON.parse(JSON.stringify(info))
                if (((route.query.cat_id && params.cat_id && route.query.cat_id==params.cat_id )||(route.query.brand_id && params.brand_id&&route.query.brand_id==params.brand_id)) && route.query.keywords == params.keywords) {
                    params.keywords = ''
                }else {
                    params.cat_id = ''
                    params.brand_id = ''
                }
                brandList.value.forEach(d => {
                    if (d.selected) {
                        ids.push(d.brand_id)
                    }
                })
                params.brand_id = ids.join(",")
                searchAxios(params).then(res => {
                    if (res.code == 200) {
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
}

const clearKeyword = () => {
    showHomeHis.value = true;
    inputSearchFocus();
}

const clickResetSelect = () => {
    minPrice.value = ''
    maxPrice.value = ''
    Object.assign(info,{
        ...info,
        min_price:'',
        max_price:'',
        brand_id:null,
        page:1,
        sort_type:null
    })
    brandList.value.forEach(d => {
        d.selected = false
    })
    searchType.value = ''
    searchData()
}

const clickConfirmSelect = () => {
    if (Number(maxPrice.value) < Number(minPrice.value)) {
        showToast('最高价不能小于最低价')
        return
    }
    selectShow.value = false
    let ids = []
    brandList.value.forEach(d => {
        if (d.selected) {
            ids.push(d.brand_id)
        }
    })

    Object.assign(info,{
        ...info,
        min_price:minPrice.value,
        max_price:maxPrice.value,
        brand_id:ids.join(",")
    })
    if (searchType.value == 'shop') {
        searchType.value = ''
        Object.assign(info,{
            ...info,
            sort_type:null
        })
    }
    searchData()
}

/***************************店铺数据部分  ****************/
const searchTypeChange = (type) => {
    if(searchType.value == type) return false
    if (type == 'price') {
        searchType.value = searchType.value == 'price_asc' ? 'price_desc' : 'price_asc'
    } else if (type != 'select') {
        searchType.value = type
    }
    if (type == 'shop') {
        searchData()
        return
    }
    Object.assign(info,{
        ...info,
        sort_type:searchType.value
    })
    if (type == 'select') {
        selectShow.value = true
    } else {
        searchList.value = []
        shopList.value = []
        searchData()
    }

}

/*搜所发现是否可见*/
const clickToggleVisible = () => {
    clickToggleValue.value = !clickToggleValue.value
}

/*搜索框右侧搜索*/
const onSearch = () => {
    onHomeSearch(keywords.value)
}

/**点击搜索历史确定**/
const onHomeSearch = (event) => {
    if (event != '' && event != null && event != undefined) {
        if (keywords.value !== '') {
            keywords.value = event.trim();
        }
    } else if (searchKey.value !== '') {
        if (searchKey.value !== '搜索关键字') {
            keywords.value = searchKey.value;
        } else {
            keywords.value = '';
        }
    }

    let list = keyWordMore.value ? keywordAllList.value : keywordList.value
    let newlist = [];
    if (keywords.value.trim() != '') {
        list.unshift(keywords.value);
    }
    list = [...new Set(list)]

    keywordList.value = list;
    showHomeHis.value = false;
    localStorage.setItem('keywordList', JSON.stringify(keywordList.value))
    Object.assign(info,{
        ...info,
        keywords: keywords.value
    })

    searchData()
}

/**点击搜索历史取消**/
const onHomeCancel = () => {
    if (searchKey.value && searchKey.value !== '搜索关键字') {
        keywords.value = searchKey.value
    }
    showHomePopup();
}

/**清空搜索历史**/
const clickRemoveKey = () => {
    keywordList.value = [];
    localStorage.removeItem('keywordList')
}

/**点击展示店铺搜索历史**/
const showHomePopup = () => {
    showHomeHis.value = !showHomeHis.value;
    if (!showHomeHis.value) {
        return
    }
    if (localStorage.getItem('keywordList')) {
        keywordList.value = JSON.parse(localStorage.getItem('keywordList'))
    }
    inputSearchFocus();
}

/**点击搜索历史**/
const clickHisKeyItem = (item) => {
    keywords.value = item;

    serachPlaceholder.value = "搜索关键字";
    onHomeSearch(item)
}
/**监听输入**/
const inputSearchKeydown = (item) => {
    nextTick(() => {
        document.querySelector("input[type=search]").focus()
    })
    listenKeywords.value = [];
    keywords.value = item;
    searchKeywordsAxios( {keywords: item}).then(res => {
        if (res.code == 200) {
            listenKeywords.value = res.data;
        }
    })
    setTimeout(() => {
        if (item == "") {
            listenKeywords.value = [];
            return;
        }
    }, 200);
}


const inputSearchFocus = () => {
    inputSearchKeydown(keywords.value);
}

/**点击搜索发现**/
const clickSearchFind = (item) => {
    if (item.web_path) {
        locationUrl(item.web_path)
    }
}

/** 点击搜索推荐 **/
const clickSearchRecommend = (text) => {
    keywords.value = text;
    onHomeSearch(text);
}

/** 点击显示搜索历史 **/
const hisSearchCancel = () => {
    showHomeHis.value = !showHomeHis.value;
    brandDownShow.value = false;
    showSearchPopup();
    inputSearchFocus();
}
const showSearchPopup = () => {
    if (localStorage.getItem('keywordList')) {
        keywordAllList.value = keywordList.value = JSON.parse(localStorage.getItem('keywordList'))
    }
    /*搜索历史超出截取处理*/
    nextTick(() => {
        //  设置要截取的索引
        let index = 0
        let ulChid = keywordItem.value
        if (!ulChid) return false
        let boxHeight = ((ulChid[0].clientHeight + parseInt(ulChid[0].style.marginTop)) * 3) + keywordTitle.value.clientHeight + historyHeader.value.clientHeight
        let keyWorldBox = keywordBox.value.clientWidth
        for (let key in ulChid) {
            if (ulChid[key].offsetTop >= boxHeight) {
                if (key - 1) {
                    if (keyWorldBox - ulChid[key - 1].offsetLeft - ulChid[key - 1].clientWidth) {
                        index = (key)
                    }
                }
                break
            }
        }
        //  获取超出3行高度的第一个元素，超过3行截断数据
        if (index > 0) {
            keyWordMore.value = true
            keywordOverList.value = keywordList.value = keywordAllList.value.slice(0, index)
        } else {
            keyWordMore.value = false
            keywordOverList.value = keywordList.value = keywordAllList.value
        }
    })
}

/*进店铺*/
const goStore = (id) => {
    appRoute('store_index', {}, {seller_id: id})
}

const scrolls = () => {
    const sTop = window.scrollY || document.documentElement.scrollTop;
    show_back.value = sTop > 350;
};

// 生命周期钩子
onMounted(() => {
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
        height: 1.98rem;
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
            height: 0.06rem;
            background: var(--main-color);
            background-size: 100% 100%;
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            bottom: -0.1rem;
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
        padding: 0.05rem 0.15rem 0.1rem;
        margin-top: 0.08rem;
        font-size: 0.24rem;
        color: var(--color-text);
        -webkit-line-clamp: 2;
        box-sizing: border-box;
    }

    .search-list .search-dl .search-dd .search-li .search-view-price {
        display: inline-block;
        padding: 0 0.1rem;
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
