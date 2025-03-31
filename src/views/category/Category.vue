<template>
    <div class="category s-flex flex-dir">
        <div class="search s-flex ai-ct">
            <div class="search-item s-flex ai-ct">
                    <div class="imgs s-flex ai-ct jc-ct">
                        <em class="iconfont">&#xe7c3;</em>
                    </div>
                    <div class="home-search-item">
                        <template v-if="Object.keys(navigation_data).length">
                            <swiper
                                    style="height: 0.66rem"
                                    @swiper="swiper => serachSwiper_1 = swiper"
                                    direction="vertical"
                                    :slidesPerView="1"
                                    :observer="true"
                                    :loop="true"
                                    :observeParents="true"
                                    :observeSlideChildren="true"
                                    :centeredSlides="true"
                                    :autoplay="{
                                        delay: 5000,
                                        stopOnLastSlide: false,
                                        disableOnInteraction: true,
                                    }"
                                    @tap="handleClickSearch(navigation_data.search_data.items[currentIndex], 'history');"
                                    @slideChange="slideChange">
                                <swiper-slide v-for="(item, index) in navigation_data.search_data.items" :key="index">
                                    <div class="s_flex" style="height: 0.66rem; line-height: 0.66rem;">
                                        <p class="ellipsis-1">{{item.keywords}}</p>
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </template>
                    </div>
                </div>
        </div>
        <div class="content s-flex flex-1" v-if="!noData" ref="content">
            <template v-if="loading">
                <div class="leftNav flex-1">
                    <div class="nav-box">
                        <div class="nav-list flex ai-ct jc-ct" v-for="its in 6" :key="its">
                            <span style="width: 1.28rem;height: 0.34rem;background: #f2f3f5;border-radius: 0.1rem;"></span>
                        </div>
                    </div>
                </div>
                <div class="right s-flex flex-dir">
                    <div class="head-nav s-flex jc-bt">
                        <div class="head-nav-box">
                            <div class="head-nav-ul s-flex jc-bt">
                                <div class="head-nav-li s-flex ai-ct jc-ct" style="width: 1.5rem;" v-for="its in 3" :key="its">
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div class="head-nav-more">
                            <div class="mores s-flex jc-ct ai-ct">
                                <i class="iconfont" style="color: rgb(187 187 187);" :class="{'drop-down':dropDown}">&#xe6b2;</i>
                            </div>
                        </div>
                    </div>
                    <div class="category-content flex-1">
                        <div class="category-box" v-for="its in 2" :key="its">
                            <div class="title s-flex ai-ct">
                                <span style="width: 1.12rem;height: 0.2rem;background: #f2f3f5;border-radius: 0.1rem;"></span>
                                <i class="iconfont" style="color: rgb(187 187 187);">&#xe60b;</i>
                            </div>
                            <div class="category-list-box s-flex flex-wrap">
                                <div class="category-list" style="width: 1.52rem" v-for="itas in 6" :key="itas">
                                    <div class="imgs s-flex ai-ct jc-ct">
                                    </div>
                                    <div class="names s-flex ai-ct">
                                        <span style="width: 1.4rem;height: 0.18rem;background: #f2f3f5;border-radius: 0.1rem;">{{ itas.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="leftNav flex-1">
                    <div class="nav-box" ref="navBox">
                        <div class="nav-list flex ai-ct jc-ct" :class="{'active' : ids === active}" v-for="(its,ids) in categoryArr" :key="its.id" @click="clickActive(ids,its)">
                            <span>{{ its.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="right s-flex flex-dir">
                    <div class="head-nav s-flex jc-bt">
                        <div class="head-nav-box">
                            <div class="head-nav-ul s-flex jc-bt">
                                <template v-if="categoryArr.length && categoryArr[active].children" :key="active">
                                    <swiper
                                        :key="active"
                                        style="width: 100%"
                                        slidesPerView="auto"
                                        :loop="false"
                                        @swiper="setSwiper"
                                        :freeMode="true">
                                        <swiper-slide v-for="(its,ids) in categoryArr[active].children" :class="{'active' : ids === navActive}" style="width: auto;" :key="its.id">
                                            <div class="head-nav-li s-flex ai-ct jc-ct" @click="switchCategory(its.id,its.name,ids)">
                                                <span>{{ its.name }}</span>
                                            </div>
                                        </swiper-slide>
                                    </swiper>
                                </template>
                            </div>
                        </div>
                        <div class="head-nav-more">
                            <div class="mores s-flex jc-ct ai-ct" @click="popupShow=true" v-if="categoryArr.length && categoryArr[active].children">
                                <i class="iconfont" :class="{'drop-down':dropDown}">&#xe6b2;</i>
                            </div>
                        </div>
                    </div>
                    <div class="category-content category-content-scroll flex-1">
                        <template v-if="categoryArr.length">
                            <div class="category-box" :ref="el => itemRef[ids] = el" v-for="(its,ids) in categoryArr[active].children" :key="its.id">
                                <div class="title s-flex ai-ct" @click="!its.type?to_detail(its,{}):null">
                                    <span>{{ its.name }}</span>
                                    <i class="iconfont" v-if="!its.type">&#xe60b;</i>
                                </div>
                                <div class="category-list-box s-flex flex-wrap" v-if="its.children && its.children.length">
                                    <div class="category-list" v-for="itas in its.children"  @click="to_detail(its,itas)" :key="itas.id">
                                        <div class="imgs s-flex ai-ct jc-ct">
                                            <img :src="itas.logo" :alt="itas.name">
                                        </div>
                                        <div class="names s-flex ai-ct">
                                            <span>{{ itas.name }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
        <div class="content flex-1" id="content" style="display: inline-block" ref="contentRef" v-else-if="noData && !loading">
            <div class="noData flex ai-ct flex-dir">
                <div class="imgs">
                    <img src="https://cdn.toodudu.com/uploads/2023/11/14/MasterSlicePNGd2f56cbd100219346b980cad08920560.png" alt="">
                </div>
                <span>阿哦，数据跑掉了</span>
                <div class="btns flex jc-se" @click="getData()">
                    <div class="btn reload">
                        <span>刷新</span>
                    </div>
                    <div class="btn backHome" @click="appRoute('home')">
                        <span>返回首页</span>
                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model:show="popupShow" class="popupClass" position="top" teleport="#app" round @close="closePopup">
            <div class="search s-flex ai-ct">
                <div class="search-item s-flex ai-ct">
                    <div class="imgs s-flex ai-ct jc-ct">
                        <em class="iconfont">&#xe7c3;</em>
                    </div>
                    <div class="home-search-item">
                        <template v-if="Object.keys(navigation_data).length">
                            <swiper
                                :key="currentIndex"
                                style="height: 0.66rem"
                                @swiper="swiper => serachSwiper_2 = swiper"
                                direction="vertical"
                                :initialSlide="currentIndex"
                                :slidesPerView="1"
                                :observer="true"
                                :loop="true"
                                :observeParents="true"
                                :observeSlideChildren="true"
                                :centeredSlides="true"
                                :autoplay="{
                                    delay: 5000,
                                    stopOnLastSlide: false,
                                    disableOnInteraction: true,
                                }"
                                @tap="handleClickSearch(navigation_data.search_data.items[currentIndex], 'history');"
                                @slideChange="slideChange">
                                <swiper-slide v-for="(item, index) in navigation_data.search_data.items" :key="index">
                                    <div class="s_flex" style="height: 0.66rem; line-height: 0.66rem;">
                                        <p class="ellipsis-1">{{item.keywords}}</p>
                                    </div>
                                </swiper-slide>
                            </swiper>
                        </template>
                    </div>
                </div>
            </div>
            <div class="category-mores">
                <div class="title s-flex ai-ct jc-bt">
                    <span v-if="categoryArr.length">{{ categoryArr[active].name }}</span>
                    <i class="iconfont" @click="closePopup">&#xe6b2;</i>
                </div>
                <div class="head-nav-ul s-flex flex-wrap">
                    <template v-if="categoryArr.length">
                        <div class="head-nav-li s-flex ai-ct jc-ct" :class="{'active' : ids === navActive}" v-for="(its,ids) in categoryArr[active].children" :key="its.id" @click="switchCategory(its.id,its.name,ids)">
                            <span>{{ its.name }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </van-popup>

    </div>
</template>

<script setup>
import {ref , reactive , computed , onMounted , watch , nextTick} from 'vue'
import $public from '@/utils/public'
import {useRoute,useRouter} from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import {cateAxios, navAxios} from "@/api/category.js";
import { showToast } from 'vant';
import { appRoute } from "@/router/appRoute";


const route = useRoute();
const router = useRouter();

const serachSwiper_1 = ref(null);
const serachSwiper_2 = ref(null)
const swiperRef = ref(null)
const itemRef = ref([])
const contentRef = ref(null)

const isScroll = ref(false);

const loading = ref(true)
const navigation_data = reactive({})
const categoryId = ref(route.query.id || 3)
const active = ref(0) // 左侧选中分类
const serachPlaceholder = ref('搜索关键词')
const searchKey = ref('')
const navActive = ref(0); // 右侧头部选中
const dropDown = ref(true);
const categoryArr = ref([]);
const popupShow = ref(false);
const currentIndex = ref(0);
const noData = ref(false);
const replaceObj = reactive({});

const keyword_hot = ''
const config = {}

const slideChange = () => {
    nextTick(() => {
        if (popupShow.value) {
            currentIndex.value = serachSwiper_2.value.realIndex;
        } else {
            currentIndex.value = serachSwiper_1.value.realIndex;
        }
    })
}

const setSwiper = (swiper) => {
    swiperRef.value = swiper
}

onMounted(() => {
    getPageData();
    getData();
    if (keyword_hot.value) {
        searchKey.value = keyword_hot.value;
    }
});

const getData = () => {
    noData.value = false;
    loading.value = true;
    cateAxios().then(res => {
        loading.value = false;
        noData.value = false;
        if (res.code == 200) {
            categoryArr.value = res.data;
            nextTick(() => {
                document.querySelector(".category-content-scroll") && document.querySelector(".category-content-scroll").addEventListener("scroll", doubleScroll);
            });
        } else if (res.code === 3004) {
            noData.value = true;
        } else {
            noData.value = true;
            showToast(res.message);
        }
    });
};

const doubleScroll = $public.throttle(() => {
    if(isScroll.value) return
    let categoryBox = event.target.querySelectorAll(".category-box")
    if(categoryBox.length){
        for(let i = 0;i < categoryBox.length;i++){
            let rect = categoryBox[i].getBoundingClientRect()
            if(rect.bottom > 120){
                if (isScrolledToBottom(event.target)) {
                    return false
                }
                navActive.value = i
                if(swiperRef.value){
                    swiperRef.value.slideTo && swiperRef.value.slideTo(i,200,true)
                }
                break
            }
        }
    }
},100)

const routerBack = () => {
    if (Object.keys(replaceObj.value).length) {
        router.replace({ name: replaceObj.value.name, params: {}, query: replaceObj.value.query });
    } else {
        router.back();
    }
};

const switchCategory = (id, name, index) => {
    isScroll.value = true

    if (popupShow.value) {
        closePopup();
    }
    nextTick(() => {
        swiperRef.value && swiperRef.value.slideTo(index, 200, true);
    });
    navActive.value = index;
    const searchHeight = document.querySelector(".search") ? document.querySelector(".search").scrollHeight : 0
    document.querySelector(".category-content").scrollTo({
        top: itemRef.value[index].offsetTop - searchHeight - 63,
        behavior: 'smooth'
    });
    setTimeout(() => {
        isScroll.value = false
    },1000)
};

const closePopup = () => {
    popupShow.value = false;
};

const clickActive = (index, item) => {
    isScroll.value = true
    active.value = index;
    navActive.value = 0;
    document.querySelector(".category-content").scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    nextTick(() => {
        if (categoryArr.value[index].children) {
            setTimeout(() => {
                swiperRef.value && swiperRef.value.slideTo(0, 200, true);
            },200)
        }
        let parent = document.querySelector(".nav-box");
        let child = document.querySelectorAll(".nav-list")[index];
        let scrollDistance = child.offsetTop - (parent.offsetHeight / 2) + (child.offsetHeight / 2);
        parent.scrollTo({
            top: scrollDistance,
            behavior: 'smooth' // 使用平滑滚动效果
        });
    });
    setTimeout(() => {
        isScroll.value = false
    },1000)
};

const to_detail = (its, itas) => {
    let query;
    if (Object.keys(itas).length) {
        if (its.type === 'is_hot_brands') {
            query = { 'keywords': itas.name,  };
        } else {
            query = { 'cat_id': itas.id, 'keywords': itas.name, };
        }
    } else {
        // 分类名称
        query = { 'cat_id': its.id, 'keywords': its.name };
    }
    setTimeout(() => {
        appRoute('search', query, {});
    }, 100);
};

const getPageData = () => {
    navAxios().then(res => {
        if (res.code == 200) {
            Object.assign(navigation_data,res.data)
        } else {
            showToast(res.message);
        }
    });
};

const handleClickSearch = (item, type) => {
    console.log(item.keywords)
    appRoute('search_history', {placeholder: item.keywords}, {});
};

const isScrolledToBottom = (element) => {
    const scrollTop = element.scrollTop;
    const totalHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    return scrollTop + clientHeight >= totalHeight;
};
</script>

<style scoped lang="scss">
.search{
    padding: 0.2rem 0.3rem;
    height: 1.06rem;
    box-sizing: border-box;
    .search-item{
        width: 100%;
        height: 0.66rem;
        background: #FFFFFF;
        border-radius: 0.33rem;
        border: 1px solid var(--main-color);
        .imgs{
            width: 0.4rem;
            height: 0.4rem;
            margin-left: 0.25rem;
            em { font-size: 0.4rem; color: var(--main-color); }
        }

        .home-search-item {
            width: 5.10rem;
            height: 0.66rem;
            //padding: 0 0.1rem;
            font-size: 0.28rem;
            color: #c1c1c1;
            box-sizing: border-box;
            position: relative;
        }

        .swiper {
            width: 4.66rem;
            height: 0.66rem;
            box-sizing: border-box;
        }
    }

}
.head-nav-ul {
    width: 100%;
    .active{
        .head-nav-li{
            border: 1px solid var(--main-color);
            background: var(--main-color-30);
            span {
                color: var(--main-color);
            }
        }
    }
    .swiper-slide:first-child .head-nav-li{
        margin-left: 0;
    }
    .head-nav-li {
        //width: 1.4rem;
        height: 0.58rem;
        background: #FFFFFF;
        border-radius: 0.3rem;
        padding: 0.2rem;
        box-sizing: border-box;
        margin-left: 0.15rem;
        span {
            font-size: 0.24rem;
            font-weight: 400;
            color: var(--color-text);
            //overflow: hidden;
            //text-overflow: ellipsis;
            //white-space: nowrap;
        }

    }
}
.category {
    height: 100%;
    overflow: hidden;
    background: #F8F8F8;
    box-sizing: border-box;

    .content {
        width: 100%;
        height: 0;
        //height: 100%;
        //height: calc(100% - 2.05rem);
        padding: 0.1rem 0.23rem 0;
        box-sizing: border-box;

        .leftNav {
            overflow: hidden;
            padding-bottom: 0.1rem;
            .nav-box {
                width: 100%;
                height: 100%;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 0px;
                }

                .nav-list {
                    padding: 0 0.20rem;
                    height: 1.1rem;
                    span {
                        font-size: 0.28rem;
                        font-weight: 400;
                        color: #666666;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        text-align: center;
                    }

                    &.active {
                        span {
                            //font-size: 0.32rem;
                            //font-weight: bold;
                            color: var(--main-color);
                        }
                    }
                }
            }
        }

        .right {
            width: 5.24rem;
            .head-nav {
                padding: 0.2rem 0;
                .head-nav-box {
                    width: 4.5rem;

                }

                .head-nav-more {
                    .mores {
                        width: 0.58rem;
                        height: 0.58rem;
                        background: #FFFFFF;
                        border-radius: 0.3rem;
                        i {
                            font-size: 0.5rem;
                            &.drop-down {
                                transform: rotateX(180deg);
                            }
                        }
                    }
                }
            }
            .category-content{
                overflow-y: auto;
                height: 0;
                &::-webkit-scrollbar {
                    width: 0px;
                }
                .category-box{
                    padding: 0.3rem;
                    background: #FFFFFF;
                    width: 100%;
                    margin-top: 0.1rem;
                    border-radius: 0.2rem;
                    box-sizing: border-box;
                    padding-bottom: 0rem;
                    .title{
                        span{
                            font-size: 0.3rem;
                            font-weight: bold;
                            color: #3D3D3D;
                            max-width: 4.15rem;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            white-space:nowrap;
                        }
                        i{
                            font-size: 0.4rem;
                        }
                        padding-bottom: 0.3rem;
                    }
                    .category-list-box{
                        //margin-top: 0.3rem;
                        .category-list{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            width: 1.52rem;
                            margin-bottom: 0.2rem;
                            &:nth-child(3n+3){
                                margin-right: 0;
                            }
                            .imgs{
                                width: 1.28rem;
                                height: 1.28rem;
                                background: #F8F8F8;
                                border-radius: 0.2rem;
                                overflow: hidden;
                                img{
                                    max-width: 100%;
                                    max-height: 100%;
                                }
                            }
                            .names{
                                width: auto;
                                height: 0.7rem;
                                margin-top: 0.2rem;
                                text-align: center;
                                span{
                                    font-size: 0.24rem;
                                    font-weight: 400;
                                    color: #666666;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    overflow:hidden;
                                    -webkit-box-orient: vertical;
                                    line-height: 0.28rem;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .noData{
        padding: 2.41rem 0;
        .imgs{
            width: 4rem;
            height: 4rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .btns{
            width: 100%;
            margin-top: 1.21rem;
            .btn{
                width: 3rem;
                height: 0.8rem;
                line-height: 0.8rem;
                border-radius: 0.4rem;
                box-sizing: border-box;
                text-align: center;
                span{
                    font-size: 0.28rem;
                    font-weight: 600;
                }
            }
            .reload{
                border: 2px solid var(--red-color);
                background: #FFFFFF;
                span{
                    color: var(--red-color);
                }
            }
            .backHome{
                background: linear-gradient(270deg, #F64651 0%, #F71111 99%);
                span{
                    color: #FFFFFF;
                }
            }
        }

    }
}

.popupClass{
    width: 7.5rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    //left: 50%;
    //transform: translate(-50%);
    overflow: hidden;
    .search{
        padding: 0.2rem 0;
    }
    .category-mores{
        //margin-top: 10rpx;
        .title{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span{
                font-size: 0.32rem;
                font-weight: bold;
                color: #3D3D3D;
            }
            i{
                font-size: 0.5rem;
            }
        }
        .head-nav-ul{
            margin: 0.3rem 0 0.1rem 0;
            max-height: 3.4rem;
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: inherit;
            }
            .head-nav-li{
                background: #F8F8F8;
                //width: 1.5rem;
                height: 0.6rem;
                margin-bottom: 0.2rem;
                margin-right: 0.3rem;
                //span{
                //	overflow: hidden;
                //	text-overflow: ellipsis;
                //	white-space: nowrap;
                //}

                &:nth-child(4n+4){
                    margin-right: 0;
                }
                &.active {
                    border: 1px solid var(--main-color);
                    background: var(--main-color-30);
                    span {
                        font-size: 0.24rem;
                        color: var(--main-color);
                    }
                }
            }
        }
    }
}

</style>
